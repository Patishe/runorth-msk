<style>
:root{
  --a-bg:#f4f5f7; --a-card:#fff; --a-ink:#1f2329; --a-muted:#6b7280;
  --a-line:#e5e7eb; --a-accent:#d08b4f; --a-accent-d:#b5743b;
  --a-danger:#dc2626; --a-ok:#16a34a; --a-radius:12px;
}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:var(--a-bg);color:var(--a-ink);font-size:15px;line-height:1.45}
a{color:var(--a-accent-d);text-decoration:none}
.admin-wrap{max-width:1080px;margin:0 auto;padding:24px 20px 80px}
.admin-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:24px;flex-wrap:wrap}
.admin-topbar h1{font-size:22px;margin:0}
.admin-switch{display:inline-flex;gap:4px;background:#eceef1;padding:4px;border-radius:10px}
.admin-switch-tab{padding:8px 18px;border-radius:7px;font-weight:700;color:var(--a-muted);font-size:15px}
.admin-switch-tab:hover{color:var(--a-ink)}
.admin-switch-tab.active{background:#fff;color:var(--a-ink);box-shadow:0 1px 2px rgba(0,0,0,.1)}
.admin-muted{color:var(--a-muted);margin:4px 0 0}
.admin-card{background:var(--a-card);border:1px solid var(--a-line);border-radius:var(--a-radius);padding:18px}
.admin-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

.admin-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--a-line);background:#fff;color:var(--a-ink);
  padding:9px 14px;border-radius:9px;cursor:pointer;font-size:14px;font-weight:600;transition:.15s}
.admin-btn:hover{border-color:#cbd0d6;background:#fafafa}
.admin-btn-primary{background:var(--a-accent);border-color:var(--a-accent);color:#fff}
.admin-btn-primary:hover{background:var(--a-accent-d);border-color:var(--a-accent-d)}
.admin-btn-danger{color:var(--a-danger);border-color:#f0c9c9}
.admin-btn-danger:hover{background:#fef2f2}
.admin-btn-sm{padding:6px 10px;font-size:13px}

.admin-alert{padding:10px 14px;border-radius:9px;margin-bottom:14px;font-weight:600}
.admin-alert-error{background:#fef2f2;color:var(--a-danger);border:1px solid #f3caca}
.admin-alert-ok{background:#f0fdf4;color:var(--a-ok);border:1px solid #bbf7d0}

/* список */
.case-row{display:flex;align-items:center;gap:14px;padding:12px;border:1px solid var(--a-line);border-radius:10px;background:#fff;margin-bottom:10px}
.case-row.is-hidden{opacity:.55}
.case-drag{cursor:grab;color:#9aa1a9;font-size:20px;line-height:1;user-select:none;padding:0 2px}
.case-thumb{width:88px;height:60px;object-fit:cover;border-radius:7px;background:#eee;flex:none}
.case-main{flex:1;min-width:0}
.case-main h3{margin:0 0 2px;font-size:16px}
.case-meta{color:var(--a-muted);font-size:13px}
.case-badge{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:#eef0f2;color:#555;margin-left:6px;vertical-align:middle}
.case-badge-hidden{background:#fde8e8;color:#b91c1c}

/* форма */
.admin-form{display:grid;gap:16px}
.admin-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.admin-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
label{display:flex;flex-direction:column;gap:5px;font-weight:600;font-size:13px;color:#374151}
input[type=text],input[type=password],textarea,select{font:inherit;padding:10px 12px;border:1px solid var(--a-line);border-radius:9px;background:#fff;width:100%}
input:focus,textarea:focus{outline:none;border-color:var(--a-accent)}
textarea{min-height:90px;resize:vertical}
.admin-section-title{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--a-muted);margin:6px 0 0}

/* spec rows: [ключ 170px][подпись 170px][значение 1fr][✕] */
.spec-row{display:grid;grid-template-columns:170px 170px 1fr auto;gap:10px;align-items:center;margin-bottom:8px}
.spec-row input,.spec-row select{margin:0}
.spec-row .spec-del{padding:6px 10px}

/* number field with unit */
.num-field{display:flex;align-items:stretch;border:1px solid var(--a-line);border-radius:9px;overflow:hidden;background:#fff}
.num-field:focus-within{border-color:var(--a-accent)}
.num-field input{border:none;border-radius:0}
.num-field input:focus{outline:none}
.num-suffix{display:flex;align-items:center;padding:0 12px;background:#f4f5f7;color:var(--a-muted);font-weight:600;font-size:13px;border-left:1px solid var(--a-line)}
.metric-preview{color:var(--a-accent-d);font-weight:600;font-size:12px;min-height:14px}

/* images */
.img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px}
.img-tile{position:relative;border:1px solid var(--a-line);border-radius:9px;overflow:hidden;background:#fff}
.img-tile img{display:block;width:100%;height:90px;object-fit:cover}
.img-tile .img-tools{display:flex;justify-content:space-between;gap:4px;padding:6px}
.img-cover-flag{position:absolute;top:6px;left:6px;background:var(--a-accent);color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:20px;z-index:1}
.img-drag{position:absolute;top:4px;right:6px;cursor:grab;color:#fff;font-size:18px;line-height:1;text-shadow:0 1px 3px rgba(0,0,0,.6);user-select:none;z-index:1}
.img-tile.sortable-ghost{opacity:.4}
.img-tile-new{border:2px dashed var(--a-accent)}
.img-tile-new img{height:90px;object-fit:cover;width:100%;display:block}
.img-new-flag{position:absolute;top:6px;left:6px;background:#16a34a;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:20px;z-index:1}

/* login */
.admin-login-body{display:flex;min-height:100vh;align-items:center;justify-content:center;padding:20px}
.admin-login{width:100%;max-width:360px;display:grid;gap:14px}
.admin-login h1{margin:0;font-size:20px}
.admin-login label{gap:6px}

@media(max-width:640px){.admin-grid-2,.admin-grid-3{grid-template-columns:1fr}.spec-row,.badge-row{grid-template-columns:1fr}}
</style>
