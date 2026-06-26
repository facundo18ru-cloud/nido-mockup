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

// Chat threads — each conversation has its own people, property and history,
// keyed by the data-thread id set on the .chat-item in chat.html.
const CHAT_THREADS = {
  1: {
    name: 'Graciela M.',
    property: 'Habitación en Palermo',
    avatar: 'G',
    listingHref: 'ficha.html',
    messages: [
      { from: 'them', text: 'Hola Tomás! Vi que te interesó la habitación, ¿seguís buscando para marzo?', time: '10:02' },
      { from: 'me', text: 'Sí! ¿Sigue disponible? Soy estudiante de 2° año en UP.', time: '10:05' },
      { from: 'them', text: 'Sigue disponible. Vi tu perfil verificado, todo en orden. ¿Querés coordinar una visita?', time: '10:07' },
      { from: 'me', text: 'Me viene bien el sábado a la tarde.', time: '10:08' },
      { from: 'them', text: 'Perfecto, quedamos así.', time: '10:09' },
    ],
  },
  2: {
    name: 'Martín R.',
    property: 'Depto entero en Almagro',
    avatar: 'M',
    listingHref: 'ficha.html',
    messages: [
      { from: 'them', text: 'Hola, gracias por tu interés en el depto de Almagro.', time: '09:14' },
      { from: 'me', text: 'Hola Martín, quería saber si acepta mascotas.', time: '09:20' },
      { from: 'them', text: 'No, este en particular no acepta. ¿Te sirve igual?', time: '09:25' },
      { from: 'me', text: 'No tengo mascota, así que sí, no hay problema.', time: '09:26' },
      { from: 'them', text: '¿Te sirve visitarlo el sábado?', time: '09:30' },
    ],
  },
  3: {
    name: 'Lucía F.',
    property: 'Depto compartido en Palermo',
    avatar: 'L',
    listingHref: 'ficha.html',
    messages: [
      { from: 'them', text: 'Hola! Vi tu perfil, encajás bien con la convivencia que buscamos.', time: '14:40' },
      { from: 'me', text: 'Genial, ¿cuándo podría mudarme?', time: '14:55' },
      { from: 'them', text: 'Está libre desde el 1 de marzo. Si te interesa armamos el contrato.', time: '15:02' },
      { from: 'me', text: 'Sí, me interesa.', time: '15:05' },
      { from: 'them', text: 'Te paso el link del contrato.', time: '15:06' },
    ],
  },
};

function renderThread(threadId) {
  const thread = CHAT_THREADS[threadId];
  if (!thread) return;
  const head = document.querySelector('.chat-head .who strong');
  const avatar = document.querySelector('.chat-head .avatar');
  const body = document.querySelector('.chat-body');
  if (head) head.textContent = `${thread.name} — ${thread.property}`;
  if (avatar) avatar.textContent = thread.avatar;
  if (body) {
    body.innerHTML = thread.messages.map(m =>
      `<div class="bubble ${m.from === 'me' ? 'me' : 'them'}">${m.text} <span class="t">${m.time}</span></div>`
    ).join('');
    body.scrollTop = body.scrollHeight;
  }
  body && (body.dataset.activeThread = threadId);
}

// Chat thread switching + send simulation on chat.html
function initChat() {
  const list = document.querySelectorAll('.chat-item[data-thread]');
  if (!list.length) return;

  const initial = list[0].dataset.thread;
  renderThread(initial);

  list.forEach(item => {
    item.addEventListener('click', () => {
      list.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      renderThread(item.dataset.thread);
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
        const thread = CHAT_THREADS[body.dataset.activeThread];
        const reply = document.createElement('div');
        reply.className = 'bubble them';
        reply.innerHTML = `Perfecto, quedamos así. <span class="t">${time}</span>`;
        body.appendChild(reply);
        body.scrollTop = body.scrollHeight;
      }, 900);
    });
  }
}

// Property photos — elements declare [data-img="assets/properties/x.jpg"].
// If the file doesn't exist yet, the element keeps its gradient + emoji placeholder.
function initPhotos() {
  document.querySelectorAll('[data-img]').forEach(el => {
    const src = el.dataset.img;
    const probe = new Image();
    probe.onload = () => {
      el.style.backgroundImage = `url('${src}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    };
    probe.src = src;
  });
}

// Search filters on busqueda.html — filters the listing-grid cards by
// data-price / data-type / data-zone attributes set on each .listing-card.
function initSearchFilters() {
  const bar = document.querySelector('.search-bar[data-filters]');
  if (!bar) return;
  const zoneSelect = bar.querySelector('[name="zone"]');
  const priceSelect = bar.querySelector('[name="price"]');
  const typeSelect = bar.querySelector('[name="type"]');
  const button = bar.querySelector('button');
  const cards = document.querySelectorAll('.listing-grid .listing-card');
  const countLabel = document.querySelector('[data-results-count]');

  function apply() {
    const maxPrice = priceSelect ? Number(priceSelect.value) : Infinity;
    const zone = zoneSelect ? zoneSelect.value : 'todas';
    const type = typeSelect ? typeSelect.value : 'todos';
    let visible = 0;
    cards.forEach(card => {
      const price = Number(card.dataset.price || 0);
      const cardZone = card.dataset.zone || '';
      const cardType = card.dataset.type || '';
      const matches = price <= maxPrice
        && (zone === 'todas' || cardZone === zone)
        && (type === 'todos' || cardType === type);
      card.style.display = matches ? '' : 'none';
      if (matches) visible++;
    });
    if (countLabel) {
      countLabel.textContent = visible === 0
        ? 'Ningún resultado con esos filtros'
        : `${visible} resultado${visible === 1 ? '' : 's'} cerca de Universidad de Palermo`;
    }
  }

  if (button) button.addEventListener('click', e => { e.preventDefault(); apply(); });
  [zoneSelect, priceSelect, typeSelect].forEach(sel => sel && sel.addEventListener('change', apply));
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
  initPhotos();
  initSearchFilters();
  initFakeForms();
});
