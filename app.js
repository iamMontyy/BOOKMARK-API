const API = 'http://localhost:3000/bookmarks';
let allBookmarks = [];
let editingId = null;
const listEl      = document.getElementById('list-bookmark');
const countEl     = document.getElementById('count');
const searchEl    = document.getElementById('search');
const formEl      = document.getElementById('form-bookmark');
const overlay     = document.getElementById('modal-overlay');
const toastEl     = document.getElementById('toast');
const inputJudul  = document.getElementById('input-judul');
const inputUrl    = document.getElementById('input-url');
const inputWeb    = document.getElementById('input-web');
const editJudul   = document.getElementById('edit-judul');
const editUrl     = document.getElementById('edit-url');
const editWeb     = document.getElementById('edit-web');

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchBookmarks() {
    try {
        const res  = await fetch(API);
        const json = await res.json();
        allBookmarks = json.data || [];
        render(allBookmarks);
    } catch {
        toast('gagal mengambil data');
    }
}

// ─── Render ───────────────────────────────────────────────────────────────────

function render(data) {
    countEl.textContent = `${data.length} saved`;
    listEl.innerHTML = '';

    if (!data.length) {
        listEl.innerHTML = '<p class="empty">no bookmarks yet.</p>';
        return;
    }

    data.forEach(b => {
        const item = document.createElement('div');
        item.className = 'bookmark-item';

        const href = b.url.startsWith('http') ? b.url : 'https://' + b.url;
        const date = new Date(b.tanggal_disimpan).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        item.innerHTML = `
            <div class="bookmark-info">
                <span class="bookmark-title">${esc(b.judul)}</span>
                <div class="bookmark-meta">
                    <a class="bookmark-url" href="${href}" target="_blank" rel="noopener">${esc(b.url)}</a>
                    <span class="bookmark-tag">${esc(b.web)}</span>
                    <span class="bookmark-date">${date}</span>
                </div>
            </div>
            <div class="actions">
                <button class="btn-action" onclick="openEdit('${b._id}')">edit</button>
                <button class="btn-action delete" onclick="deleteBookmark('${b._id}')">del</button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

// ─── Create ───────────────────────────────────────────────────────────────────

formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const judul = inputJudul.value.trim();
    const url   = inputUrl.value.trim();
    const web   = inputWeb.value.trim();

    if (!judul || !url || !web) return;

    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, url, web })
        });

        if (!res.ok) throw new Error();
        inputJudul.value = '';
        inputUrl.value   = '';
        inputWeb.value   = '';
        toast('saved');
        fetchBookmarks();
    } catch {
        toast('gagal menyimpan');
    }
});

// ─── Delete ───────────────────────────────────────────────────────────────────

async function deleteBookmark(id) {
    try {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        toast('deleted');
        fetchBookmarks();
    } catch {
        toast('gagal menghapus');
    }
}

// ─── Edit ─────────────────────────────────────────────────────────────────────

function openEdit(id) {
    const b = allBookmarks.find(x => x._id === id);
    if (!b) return;
    editingId        = id;
    editJudul.value  = b.judul;
    editUrl.value    = b.url;
    editWeb.value    = b.web;
    overlay.classList.remove('hidden');
}

document.getElementById('btn-cancel').addEventListener('click', () => {
    overlay.classList.add('hidden');
    editingId = null;
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.add('hidden');
        editingId = null;
    }
});

document.getElementById('btn-save-edit').addEventListener('click', async () => {
    if (!editingId) return;
    const judul = editJudul.value.trim();
    const url   = editUrl.value.trim();
    const web   = editWeb.value.trim();

    if (!judul || !url || !web) return;

    try {
        await fetch(`${API}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, url, web })
        });
        overlay.classList.add('hidden');
        editingId = null;
        toast('updated');
        fetchBookmarks();
    } catch {
        toast('gagal update');
    }
});

// ─── Search ───────────────────────────────────────────────────────────────────

searchEl.addEventListener('input', () => {
    const q = searchEl.value.toLowerCase();
    const filtered = allBookmarks.filter(b =>
        b.judul.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.web.toLowerCase().includes(q)
    );
    render(filtered);
});

// ─── Utils ────────────────────────────────────────────────────────────────────

function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

let toastTimer;
function toast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden', 'fade-out');
    toastTimer = setTimeout(() => {
        toastEl.classList.add('fade-out');
        setTimeout(() => toastEl.classList.add('hidden'), 300);
    }, 1800);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

fetchBookmarks();
