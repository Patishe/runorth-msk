<?php
/**
 * Обработка изображений объектов: сохранение загруженного файла как <stem>.jpg
 * и генерация webp-вариантов 480 / 768 / 1200 (как в исходной вёрстке).
 *
 * Мягкая деградация: если на хостинге нет GD/webp — сохраняем только jpg,
 * а публичный рендер сам не выведет <source webp>, если файла нет на диске.
 */

function admin_gd_available(): bool
{
    return extension_loaded('gd') && function_exists('imagecreatetruecolor');
}

function admin_webp_available(): bool
{
    return admin_gd_available() && function_exists('imagewebp');
}

/** Ширины webp-вариантов: суффикс => целевая ширина (px). '' = базовый 1200. */
function admin_webp_sizes(): array
{
    return ['-480' => 480, '-768' => 768, '' => 1200];
}

/**
 * Загрузить картинку из файла в GD-ресурс. Возвращает [resource, width, height] или null.
 */
function admin_load_image(string $path): ?array
{
    $info = @getimagesize($path);
    if (!$info) return null;
    $im = null;
    switch ($info[2]) {
        case IMAGETYPE_JPEG: $im = @imagecreatefromjpeg($path); break;
        case IMAGETYPE_PNG:  $im = @imagecreatefrompng($path); break;
        case IMAGETYPE_WEBP: $im = function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : null; break;
        default: return null;
    }
    if (!$im) return null;
    return [$im, imagesx($im), imagesy($im)];
}

/** Масштабировать GD-ресурс до ширины $w (без апскейла). Возвращает новый ресурс. */
function admin_scale(\GdImage $src, int $srcW, int $srcH, int $targetW): \GdImage
{
    if ($targetW >= $srcW) return $src;
    $h = (int)round($srcH * $targetW / $srcW);
    $dst = imagecreatetruecolor($targetW, $h);
    // сохранить прозрачность для png
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $targetW, $h, $srcW, $srcH);
    return $dst;
}

/**
 * Сохранить загруженное изображение в каталог объекта.
 *
 * @param string $tmpPath  путь к временно загруженному файлу ($_FILES['...']['tmp_name'])
 * @param string $destDir  абсолютный путь каталога объекта (создаётся при необходимости)
 * @param string $stem     базовое имя без расширения, напр. "3"
 * @return array{ok:bool, file?:string, webp?:bool, error?:string}
 */
function admin_save_image(string $tmpPath, string $destDir, string $stem): array
{
    if (!is_dir($destDir) && !@mkdir($destDir, 0775, true) && !is_dir($destDir)) {
        return ['ok' => false, 'error' => 'Не удалось создать каталог для изображений'];
    }

    $info = @getimagesize($tmpPath);
    if (!$info) {
        return ['ok' => false, 'error' => 'Файл не является изображением'];
    }
    $type = $info[2];
    $allowed = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];
    if (!in_array($type, $allowed, true)) {
        return ['ok' => false, 'error' => 'Допустимы только JPG, PNG или WEBP'];
    }

    $jpgPath = $destDir . '/' . $stem . '.jpg';

    // --- Без GD: принимаем только готовый jpg ---
    if (!admin_gd_available()) {
        if ($type !== IMAGETYPE_JPEG) {
            return ['ok' => false, 'error' => 'На сервере нет модуля изображений (GD): загрузите файл в формате JPG'];
        }
        if (!@copy($tmpPath, $jpgPath)) {
            return ['ok' => false, 'error' => 'Не удалось сохранить файл'];
        }
        return ['ok' => true, 'file' => $stem . '.jpg', 'webp' => false];
    }

    // --- С GD: пересжать в jpg (cap 1600px) + webp-варианты ---
    $loaded = admin_load_image($tmpPath);
    if (!$loaded) {
        return ['ok' => false, 'error' => 'Не удалось прочитать изображение'];
    }
    [$src, $sw, $sh] = $loaded;

    // базовый jpg (ограничим ширину 1600 для веса)
    $jpgSrc = admin_scale($src, $sw, $sh, min(1600, $sw));
    // jpg без альфы — зальём белым фоном
    $jw = imagesx($jpgSrc); $jh = imagesy($jpgSrc);
    $flat = imagecreatetruecolor($jw, $jh);
    $white = imagecolorallocate($flat, 255, 255, 255);
    imagefilledrectangle($flat, 0, 0, $jw, $jh, $white);
    imagecopy($flat, $jpgSrc, 0, 0, 0, 0, $jw, $jh);
    imagejpeg($flat, $jpgPath, 85);
    imagedestroy($flat);
    if ($jpgSrc !== $src) imagedestroy($jpgSrc);

    // webp-варианты
    $webpOk = false;
    if (admin_webp_available()) {
        foreach (admin_webp_sizes() as $suffix => $w) {
            $variant = admin_scale($src, $sw, $sh, min($w, $sw));
            imagepalettetotruecolor($variant);
            imagealphablending($variant, false);
            imagesavealpha($variant, true);
            imagewebp($variant, $destDir . '/' . $stem . $suffix . '.webp', 82);
            if ($variant !== $src) imagedestroy($variant);
            $webpOk = true;
        }
    }
    imagedestroy($src);

    return ['ok' => true, 'file' => $stem . '.jpg', 'webp' => $webpOk];
}

/** Удалить jpg и все webp-варианты для $stem. */
function admin_delete_image_files(string $destDir, string $stem): void
{
    @unlink($destDir . '/' . $stem . '.jpg');
    foreach (admin_webp_sizes() as $suffix => $_) {
        @unlink($destDir . '/' . $stem . $suffix . '.webp');
    }
}

/** Следующий числовой stem на основе уже существующих имён images[]. */
function admin_next_stem(array $images): string
{
    $max = 0;
    foreach ($images as $img) {
        if (preg_match('/(\d+)/', (string)$img, $m)) {
            $max = max($max, (int)$m[1]);
        }
    }
    return (string)($max + 1);
}

/** Следующий stem по реальным jpg-файлам в каталоге. */
function admin_next_stem_for_dir(string $destDir): string
{
    $max = 0;
    foreach (glob($destDir . '/*.jpg') ?: [] as $f) {
        if (preg_match('/(\d+)\.jpg$/i', $f, $m)) {
            $max = max($max, (int)$m[1]);
        }
    }
    return (string)($max + 1);
}
