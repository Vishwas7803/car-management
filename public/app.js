/* ─── State ──────────────────────────────────────────────────────────────── */
const API = '';  // same origin
let token = localStorage.getItem('cv_token') || null;
let currentUser = JSON.parse(localStorage.getItem('cv_user') || 'null');
let currentCar = null;
let imagesToRemove = [];

/* ─── API Helper ─────────────────────────────────────────────────────────── */
async function api(method, path, body = null, isForm = false) {
  const headers = { Authorization: `Bearer ${token}` };
  if (!isForm) headers['Content-Type'] = 'application/json';

  const opts = { method, headers };
  if (body) opts.body = isForm ? body : JSON.stringify(body);

  const res = await fetch(API + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  setTimeout(() => el.classList.add('hidden'), 2800);
}

/* ─── Auth ───────────────────────────────────────────────────────────────── */
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
  document.querySelector(`.auth-tab[onclick="switchTab('${tab}')"]`).classList.add('active');
  document.getElementById(`${tab}-form`).classList.remove('hidden');
}

async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');

  if (!email || !password) { errEl.textContent = 'Please fill in all fields'; errEl.classList.remove('hidden'); return; }

  try {
    const data = await apiNoAuth('POST', '/api/auth/login', { email, password });
    token = data.token;
    currentUser = data.user;
    localStorage.setItem('cv_token', token);
    localStorage.setItem('cv_user', JSON.stringify(currentUser));
    enterApp();
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

async function signup() {
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  errEl.classList.add('hidden');

  if (!username || !email || !password) { errEl.textContent = 'Please fill in all fields'; errEl.classList.remove('hidden'); return; }

  try {
    const data = await apiNoAuth('POST', '/api/auth/signup', { username, email, password });
    token = data.token;
    currentUser = data.user;
    localStorage.setItem('cv_token', token);
    localStorage.setItem('cv_user', JSON.stringify(currentUser));
    enterApp();
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

async function apiNoAuth(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function logout() {
  token = null; currentUser = null; currentCar = null;
  localStorage.removeItem('cv_token');
  localStorage.removeItem('cv_user');
  showPage('auth-page');
}

function enterApp() {
  document.getElementById('nav-username').textContent = `👤 ${currentUser.username}`;
  showPage('app-page');
  showListView();
}

/* ─── Pages & Views ─────────────────────────────────────────────────────── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
  const pg = document.getElementById(id);
  pg.classList.remove('hidden');
  pg.classList.add('active');
}

function showView(id) {
  document.querySelectorAll('.view').forEach(v => { v.classList.remove('active'); v.classList.add('hidden'); });
  const vw = document.getElementById(id);
  vw.classList.remove('hidden');
  vw.classList.add('active');
}

function showListView() { showView('list-view'); loadCars(); }
function showCreateView() {
  clearCreateForm();
  showView('create-view');
}
function showDetailView() {
  if (!currentCar) { showListView(); return; }
  renderDetail(currentCar);
  showView('detail-view');
}
function showEditView() {
  if (!currentCar) return;
  populateEditForm(currentCar);
  showView('edit-view');
}

/* ─── Cars CRUD ─────────────────────────────────────────────────────────── */
async function loadCars(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  try {
    const data = await api('GET', `/api/cars${query}`);
    renderCarsList(data.cars);
    document.getElementById('car-count').textContent =
      data.cars.length === 0 ? 'No cars found' : `${data.cars.length} car${data.cars.length !== 1 ? 's' : ''}`;
  } catch (e) {
    if (e.message.includes('nauthorized')) logout();
    showToast('Failed to load cars', 'error');
  }
}

function searchCars() {
  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(() => {
    loadCars(document.getElementById('search-input').value.trim());
  }, 300);
}

function renderCarsList(cars) {
  const grid = document.getElementById('cars-grid');
  const empty = document.getElementById('empty-state');

  if (!cars.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  grid.innerHTML = cars.map(car => `
    <div class="car-card" onclick="viewCar('${car.id}')">
      <div class="car-img">
        ${car.images && car.images.length
          ? `<img src="${car.images[0]}" alt="${escHtml(car.title)}" loading="lazy" />`
          : `<span class="no-img">🚗</span>`
        }
      </div>
      <div class="car-info">
        <h3>${escHtml(car.title)}</h3>
        <p>${escHtml(car.description || 'No description')}</p>
        <div class="car-tags">
          ${car.tags?.car_type ? `<span class="tag accent">${escHtml(car.tags.car_type)}</span>` : ''}
          ${car.tags?.company ? `<span class="tag">${escHtml(car.tags.company)}</span>` : ''}
          ${car.tags?.dealer ? `<span class="tag">${escHtml(car.tags.dealer)}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

async function viewCar(id) {
  try {
    const data = await api('GET', `/api/cars/${id}`);
    currentCar = data.car;
    renderDetail(currentCar);
    showView('detail-view');
  } catch (e) {
    showToast('Failed to load car', 'error');
  }
}

function renderDetail(car) {
  const gallery = car.images && car.images.length
    ? `<div class="detail-gallery ${car.images.length === 1 ? 'single' : ''}">
        ${car.images.map(img => `<img src="${img}" alt="${escHtml(car.title)}" />`).join('')}
       </div>`
    : `<div class="detail-no-img">🚗</div>`;

  const dateStr = car.createdAt ? new Date(car.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  document.getElementById('car-detail-content').innerHTML = `
    <div class="detail-card">
      ${gallery}
      <div class="detail-body">
        <h2>${escHtml(car.title)}</h2>
        ${car.description ? `<p class="detail-desc">${escHtml(car.description)}</p>` : ''}
        <div class="detail-meta">
          ${car.tags?.car_type ? `<span class="tag accent">${escHtml(car.tags.car_type)}</span>` : ''}
          ${car.tags?.company ? `<span class="tag">${escHtml(car.tags.company)}</span>` : ''}
          ${car.tags?.dealer ? `<span class="tag">${escHtml(car.tags.dealer)}</span>` : ''}
        </div>
        ${dateStr ? `<p class="detail-date">Added on ${dateStr}</p>` : ''}
      </div>
    </div>
  `;
}

async function createCar() {
  const title = document.getElementById('create-title').value.trim();
  const errEl = document.getElementById('create-error');
  errEl.classList.add('hidden');

  if (!title) { errEl.textContent = 'Title is required'; errEl.classList.remove('hidden'); return; }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', document.getElementById('create-desc').value.trim());
  formData.append('car_type', document.getElementById('create-cartype').value.trim());
  formData.append('company', document.getElementById('create-company').value.trim());
  formData.append('dealer', document.getElementById('create-dealer').value.trim());

  const files = document.getElementById('create-images').files;
  if (files.length > 10) { errEl.textContent = 'Max 10 images allowed'; errEl.classList.remove('hidden'); return; }
  Array.from(files).forEach(f => formData.append('images', f));

  try {
    await api('POST', '/api/cars', formData, true);
    showToast('Car added!');
    showListView();
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

function populateEditForm(car) {
  document.getElementById('edit-title').value = car.title || '';
  document.getElementById('edit-desc').value = car.description || '';
  document.getElementById('edit-cartype').value = car.tags?.car_type || '';
  document.getElementById('edit-company').value = car.tags?.company || '';
  document.getElementById('edit-dealer').value = car.tags?.dealer || '';
  document.getElementById('edit-new-preview').innerHTML = '';
  document.getElementById('edit-images').value = '';
  imagesToRemove = [];

  const container = document.getElementById('edit-current-images');
  if (car.images && car.images.length) {
    container.innerHTML = car.images.map(img => `
      <div class="img-preview-item" id="eimg-${btoa(img)}">
        <img src="${img}" alt="car" />
        <button class="remove-img" onclick="markRemoveImage('${img}', 'eimg-${btoa(img)}')">×</button>
      </div>
    `).join('');
  } else {
    container.innerHTML = '<p style="color:var(--text2);font-size:0.85rem">No images</p>';
  }
}

function markRemoveImage(imgPath, elemId) {
  imagesToRemove.push(imgPath);
  document.getElementById(elemId)?.remove();
}

async function updateCar() {
  const title = document.getElementById('edit-title').value.trim();
  const errEl = document.getElementById('edit-error');
  errEl.classList.add('hidden');

  if (!title) { errEl.textContent = 'Title is required'; errEl.classList.remove('hidden'); return; }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', document.getElementById('edit-desc').value.trim());
  formData.append('car_type', document.getElementById('edit-cartype').value.trim());
  formData.append('company', document.getElementById('edit-company').value.trim());
  formData.append('dealer', document.getElementById('edit-dealer').value.trim());
  imagesToRemove.forEach(img => formData.append('remove_images', img));

  const files = document.getElementById('edit-images').files;
  Array.from(files).forEach(f => formData.append('images', f));

  try {
    const data = await api('PUT', `/api/cars/${currentCar.id}`, formData, true);
    currentCar = data.car;
    showToast('Car updated!');
    renderDetail(currentCar);
    showView('detail-view');
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

async function deleteCar() {
  if (!currentCar) return;
  if (!confirm(`Delete "${currentCar.title}"? This cannot be undone.`)) return;
  try {
    await api('DELETE', `/api/cars/${currentCar.id}`);
    currentCar = null;
    showToast('Car deleted');
    showListView();
  } catch (e) {
    showToast('Failed to delete', 'error');
  }
}

/* ─── Image Preview ─────────────────────────────────────────────────────── */
function previewImages(input, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  Array.from(input.files).slice(0, 10).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const div = document.createElement('div');
      div.className = 'img-preview-item';
      div.innerHTML = `<img src="${e.target.result}" alt="preview" />`;
      container.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function clearCreateForm() {
  ['create-title', 'create-desc', 'create-cartype', 'create-company', 'create-dealer'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('create-images').value = '';
  document.getElementById('create-preview').innerHTML = '';
  document.getElementById('create-error').classList.add('hidden');
}

/* ─── Utility ───────────────────────────────────────────────────────────── */
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─── Init ───────────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  if (token && currentUser) {
    enterApp();
  } else {
    showPage('auth-page');
  }
});
