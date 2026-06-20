/* ─── Variables ─────────────────────────────────────────────────────────────── */
:root {
  --bg: #0f0f13;
  --bg2: #16161d;
  --bg3: #1e1e28;
  --border: #2a2a38;
  --accent: #5b6ef5;
  --accent2: #7c8bff;
  --accent-glow: rgba(91,110,245,0.25);
  --text: #f0f0f5;
  --text2: #9999b0;
  --text3: #6666808;
  --danger: #ef4444;
  --danger2: #dc2626;
  --success: #22c55e;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
}

/* ─── Reset & Base ───────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
h1,h2,h3,h4 { font-family: 'Space Grotesk', sans-serif; }
input, textarea, button { font-family: inherit; }
textarea { resize: vertical; }

/* ─── Pages ───────────────────────────────────────────────────────────────── */
.page { display: none; }
.page.active { display: block; }
.view { display: none; }
.view.active { display: block; }

/* ─── Auth Page ─────────────────────────────────────────────────────────── */
.auth-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(ellipse at 60% 0%, rgba(91,110,245,0.15) 0%, transparent 60%);
}

.auth-brand {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-icon { font-size: 3rem; margin-bottom: 0.5rem; }
.auth-brand h1 { font-size: 2.2rem; letter-spacing: -0.5px; color: var(--text); }
.auth-brand p { color: var(--text2); margin-top: 0.25rem; }

.auth-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow);
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
}

.auth-tab {
  flex: 1;
  background: none;
  border: none;
  color: var(--text2);
  padding: 0.6rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  margin-bottom: -1px;
}
.auth-tab.active { color: var(--accent2); border-bottom-color: var(--accent); }

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
.navbar {
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  padding: 0.85rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text);
}
.brand-icon-sm { font-size: 1.3rem; }

.nav-right { display: flex; align-items: center; gap: 1rem; }
.nav-user { color: var(--text2); font-size: 0.9rem; }

/* ─── Container ─────────────────────────────────────────────────────────── */
.container { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }

/* ─── List View ─────────────────────────────────────────────────────────── */
.list-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.list-header h2 { font-size: 1.8rem; }
.sub-text { color: var(--text2); font-size: 0.9rem; margin-top: 0.2rem; }

.search-bar { margin-bottom: 1.5rem; }
.search-bar input {
  width: 100%;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  color: var(--text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-bar input:focus { border-color: var(--accent); }
.search-bar input::placeholder { color: var(--text2); }

/* ─── Cars Grid ─────────────────────────────────────────────────────────── */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.car-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.car-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: 0 8px 32px rgba(91,110,245,0.2);
}

.car-img {
  height: 180px;
  background: var(--bg3);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.car-img img { width: 100%; height: 100%; object-fit: cover; }
.car-img .no-img { font-size: 3rem; opacity: 0.3; }

.car-info { padding: 1rem; }
.car-info h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.35rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.car-info p { color: var(--text2); font-size: 0.85rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.car-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
.tag {
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text2);
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 20px;
}
.tag.accent { background: var(--accent-glow); border-color: var(--accent); color: var(--accent2); }

/* ─── Empty State ───────────────────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: var(--text2);
}
.empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-state h3 { color: var(--text); font-size: 1.3rem; margin-bottom: 0.5rem; }
.empty-state p { margin-bottom: 1.5rem; }

/* ─── View Headers ──────────────────────────────────────────────────────── */
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.view-header h2 { font-size: 1.5rem; }
.detail-actions { display: flex; gap: 0.75rem; }

/* ─── Form Card ─────────────────────────────────────────────────────────── */
.form-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  max-width: 720px;
}

.form-group { margin-bottom: 1.25rem; }
.form-group label {
  display: block;
  color: var(--text2);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}
.form-group input,
.form-group textarea {
  width: 100%;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  color: var(--text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group textarea:focus { border-color: var(--accent); }
.form-group input::placeholder,
.form-group textarea::placeholder { color: var(--text2); opacity: 0.6; }

.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; }

.req { color: var(--danger); }
.hint { color: var(--text2); font-size: 0.8rem; font-weight: 400; }

.form-error {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.3);
  color: #fca5a5;
  padding: 0.65rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }

/* ─── Upload Area ───────────────────────────────────────────────────────── */
.upload-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  color: var(--text2);
  transition: border-color 0.2s, background 0.2s;
}
.upload-area:hover { border-color: var(--accent); background: rgba(91,110,245,0.05); }
.upload-icon { font-size: 1.8rem; margin-bottom: 0.4rem; }
.upload-area p { font-size: 0.9rem; }
.upload-area span { font-size: 0.78rem; opacity: 0.6; }

/* ─── Image Preview ─────────────────────────────────────────────────────── */
.img-preview { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.75rem; }

.img-preview-item {
  position: relative;
  width: 100px;
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
}
.img-preview-item img { width: 100%; height: 100%; object-fit: cover; }
.img-preview-item .remove-img {
  position: absolute;
  top: 3px; right: 3px;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px; height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  line-height: 1;
}
.img-preview-item .remove-img:hover { background: var(--danger); }

/* ─── Detail View ───────────────────────────────────────────────────────── */
.detail-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }

.detail-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  padding: 0.5rem;
  max-height: 340px;
  overflow: hidden;
}

.detail-gallery img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.detail-gallery.single img { height: 260px; }

.detail-no-img {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  opacity: 0.2;
}

.detail-body { padding: 1.5rem; }
.detail-body h2 { font-size: 1.6rem; margin-bottom: 0.5rem; }
.detail-desc { color: var(--text2); line-height: 1.7; margin-bottom: 1.25rem; }
.detail-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.detail-date {
  color: var(--text2);
  font-size: 0.82rem;
  margin-top: 1rem;
}

/* ─── Buttons ───────────────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  white-space: nowrap;
}
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: var(--accent2); box-shadow: 0 4px 12px var(--accent-glow); }
.btn-secondary { background: var(--bg3); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent2); }
.btn-ghost { background: none; color: var(--text2); }
.btn-ghost:hover { color: var(--text); background: var(--bg3); }
.btn-danger { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.3); }
.btn-danger:hover { background: var(--danger); color: white; }
.btn-full { width: 100%; }

/* ─── Toast ─────────────────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  font-size: 0.9rem;
  z-index: 1000;
  transition: opacity 0.3s, transform 0.3s;
}
.toast.success { border-color: var(--success); color: var(--success); }
.toast.error { border-color: var(--danger); color: #fca5a5; }
.toast.hidden { opacity: 0; pointer-events: none; transform: translateY(8px); }

/* ─── Utilities ──────────────────────────────────────────────────────────── */
.hidden { display: none !important; }

/* ─── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .container { padding: 1rem; }
  .auth-card { padding: 1.5rem; }
  .form-card { padding: 1.25rem; }
  .cars-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .navbar { padding: 0.75rem 1rem; }
  .detail-gallery { max-height: 220px; }
}
