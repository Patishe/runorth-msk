(function () {
    const postsContainer = document.querySelector('.blog-posts');
    if (!postsContainer) return;

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatDate(value) {
        if (!value) return '';
        return new Date(value).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    function renderPost(post, index) {
        const url = `/blog/${post.slug}`;
        const image = post.cover_image_path || '/images/hero_bg.jpg';
        const category = post.category?.name || 'Блог';
        const date = formatDate(post.published_at || post.created_at);
        const featuredClass = index === 0 ? ' blog-card-featured' : '';

        return `
            <article class="blog-card${featuredClass}">
                <a href="${url}" class="blog-card-image" aria-label="${escapeHtml(post.title)}">
                    <img src="${escapeHtml(image)}" alt="${escapeHtml(post.cover_image_alt || post.title)}" loading="${index === 0 ? 'eager' : 'lazy'}">
                </a>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span>${escapeHtml(category)}</span>
                        ${date ? `<time datetime="${escapeHtml(post.published_at || post.created_at)}">${escapeHtml(date)}</time>` : ''}
                        <span>${escapeHtml(post.reading_time || 1)} минут</span>
                    </div>
                    <h2><a href="${url}">${escapeHtml(post.title)}</a></h2>
                    ${post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : ''}
                    <a href="${url}" class="blog-read-more">Читать статью</a>
                </div>
            </article>
        `;
    }

    fetch('/api/public/blog/posts?limit=30')
        .then((response) => response.ok ? response.json() : null)
        .then((result) => {
            if (!result?.success || !result.data?.length) return;
            postsContainer.innerHTML = result.data.map(renderPost).join('');
        })
        .catch(() => {
            // Static article cards stay visible if the API is unavailable.
        });
})();
