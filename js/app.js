// Nido mockup — shared interactivity. No backend: everything is simulated client-side.

function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2400);
}

// Tabs: any [data-tabs] container with .tab[data-tab] and .tab-panel[data-panel]
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = group.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        group.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
        group.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === target));
      });
    });
  });
}

// Role pick cards on registro.html
function initRolePick() {
  const cards = document.querySelectorAll('.role-card[data-role]');
  if (!cards.length) return;
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const input = document.getElementById('selected-role');
      if (input) input.value = card.dataset.role;
    });
  });
}

// Sign pad simulation on contrato.html
function initSignPad() {
  document.querySelectorAll('.sign-pad').forEach(pad => {
    pad.addEventListener('click', () => {
      if (pad.classList.contains('signed')) return;
      pad.classList.add('signed');
      pad.textContent = pad.dataset.signature || 'Firmado';
      toast('Firma registrada');
      const btn = document.querySelector('[data-finish-contract]');
      if (btn) checkAllSigned();
    });
  });
}
function checkAllSigned() {
  const pads = document.querySelectorAll('.sign-pad');
  const allSigned = [...pads].every(p => p.classList.contains('signed'));
  const btn = document.querySelector('[data-finish-contract]');
  if (btn) btn.disabled = !allSigned;
}

// Chat thread switching + send simulation on chat.html
function initChat() {
  const list = document.querySelectorAll('.chat-item[data-thread]');
  if (!list.length) return;
  list.forEach(item => {
    item.addEventListener('click', () => {
      list.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const name = item.dataset.name;
      const head = document.querySelector('.chat-head .who strong');
      if (head) head.textContent = name;
    });
  });

  const form = document.getElementById('chat-send');
  const body = document.querySelector('.chat-body');
  if (form && body) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (!input.value.trim()) return;
      const bubble = document.createElement('div');
      bubble.className = 'bubble me';
      const time = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
      bubble.innerHTML = `${input.value} <span class="t">${time}</span>`;
      body.appendChild(bubble);
      body.scrollTop = body.scrollHeight;
      input.value = '';
      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'bubble them';
        reply.innerHTML = `Perfecto, quedamos así. <span class="t">${time}</span>`;
        body.appendChild(reply);
        body.scrollTop = body.scrollHeight;
      }, 900);
    });
  }
}

// Generic "fake submit" — prevents real navigation away mid-form, shows toast, then redirects
function initFakeForms() {
  document.querySelectorAll('form[data-redirect]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = form.dataset.toast;
      if (msg) toast(msg);
      const dest = form.dataset.redirect;
      setTimeout(() => { if (dest) window.location.href = dest; }, 700);
    });
  });
}

// ===== Shared header / footer / demo persona bar =====
// Role persists across pages via localStorage so the demo feels continuous.
function getRole() {
  return localStorage.getItem('nido-role') || 'estudiante';
}
function setRole(role) {
  localStorage.setItem('nido-role', role);
}

const NAV = {
  estudiante: [
    { href: 'busqueda.html', label: 'Buscar' },
    { href: 'dashboard-estudiante.html', label: 'Mi alquiler' },
    { href: 'chat.html', label: 'Mensajes' },
  ],
  propietario: [
    { href: 'dashboard-propietario.html', label: 'Mis publicaciones' },
    { href: 'chat.html', label: 'Consultas' },
  ],
};

function renderDemoBar() {
  const mount = document.getElementById('demo-bar');
  if (!mount) return;
  const role = getRole();
  mount.outerHTML = `
  <div class="demo-bar" id="demo-bar">
    <div class="wrap">
      <span class="label">Prototipo académico — Business Innovation, UP. Sin validación real de DNI ni datos.</span>
      <div class="demo-switch">
        <a href="#" data-role="estudiante" class="${role === 'estudiante' ? 'active' : ''}">Ver como Tomás (estudiante)</a>
        <a href="#" data-role="propietario" class="${role === 'propietario' ? 'active' : ''}">Ver como Graciela (propietario)</a>
      </div>
    </div>
  </div>`;
  document.querySelectorAll('.demo-switch a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      setRole(a.dataset.role);
      const dash = a.dataset.role === 'estudiante' ? 'busqueda.html' : 'dashboard-propietario.html';
      const onLanding = document.body.dataset.page === 'landing';
      window.location.href = onLanding ? window.location.pathname : dash;
    });
  });
}

function renderHeader() {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const role = getRole();
  const initials = role === 'estudiante' ? 'T' : 'G';
  const name = role === 'estudiante' ? 'Tomás' : 'Graciela';
  const current = document.body.dataset.page || '';
  const links = NAV[role].map(l =>
    `<a href="${l.href}" class="${current === l.href ? 'active' : ''}">${l.label}</a>`
  ).join('');
  mount.outerHTML = `
  <header class="site" id="site-header">
    <div class="wrap">
      <a href="index.html" class="brand"><span class="mark">N</span> Nido</a>
      <nav class="main">${links}</nav>
      <div class="nav-actions">
        <span class="text-sm muted" style="display:none" id="role-name">${name}</span>
        <a class="avatar" href="${role === 'estudiante' ? 'dashboard-estudiante.html' : 'dashboard-propietario.html'}" title="${name}">${initials}</a>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  mount.outerHTML = `
  <footer class="site" id="site-footer">
    <div class="wrap">
      <span>© 2026 Nido — Mockup académico, Metodologías Ágiles, Universidad de Palermo.</span>
      <span>Grupo: Invernizzi, Ruiz, Sánchez Navarro, Sosa Colello, Yolde</span>
    </div>
  </footer>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderDemoBar();
  renderHeader();
  renderFooter();
  initTabs();
  initRolePick();
  initSignPad();
  initChat();
  initFakeForms();
});
