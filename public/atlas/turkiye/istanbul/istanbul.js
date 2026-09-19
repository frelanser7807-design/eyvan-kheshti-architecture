const routes = {
  morning: {
    title: 'Historic Peninsula — four hours',
    description: 'A compact reading of Byzantine infrastructure and Ottoman urban form. Start early and keep the route intentionally small.',
    meta: ['4–4.5 HOURS', 'MOSTLY WALKING', 'HISTORIC CORE'],
    steps: [
      ['09:00', 'Hagia Sophia Square', 'Begin with the urban relationship'],
      ['09:40', 'Blue Mosque courtyard', 'Read the dome sequence'],
      ['10:35', 'Basilica Cistern', 'Subterranean structure and light'],
      ['12:00', 'Topkapı first court', 'Landscape, threshold and power'],
      ['13:15', 'Gülhane edge', 'Pause or continue independently'],
    ],
  },
  afternoon: {
    title: 'Karaköy Waterfront — four hours',
    description: 'A contemporary route through infrastructure, adaptive reuse and Istanbul’s renewed relationship with the Bosphorus.',
    meta: ['4–4.5 HOURS', 'WALK + FERRY', 'CONTEMPORARY'],
    steps: [
      ['14:00', 'Galata Tower edge', 'Begin with the city’s vertical marker'],
      ['14:45', 'SALT Galata', 'Adaptive reuse and civic interior'],
      ['15:45', 'Karaköy streets', 'Passages, workshops and layered facades'],
      ['16:30', 'Istanbul Modern', 'Museum, waterfront and roof plane'],
      ['18:00', 'Bosphorus ferry', 'Read the skyline from the water'],
    ],
  },
};

const filters = document.querySelectorAll('.filter');
const architectureCards = document.querySelectorAll('#architecture-grid article');
filters.forEach((button) => button.addEventListener('click', () => {
  filters.forEach((item) => item.classList.toggle('is-active', item === button));
  const filter = button.dataset.filter;
  architectureCards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.kind !== filter));
}));

const routeTabs = document.querySelectorAll('.route-tab');
const routePanel = document.querySelector('#route-panel');
const routeSteps = document.querySelector('#route-steps');

function renderRoute(id) {
  const route = routes[id];
  routePanel.innerHTML = `<h3>${route.title}</h3><p>${route.description}</p><div class="route-meta">${route.meta.map((item) => `<span>${item}</span>`).join('')}</div>`;
  routeSteps.innerHTML = route.steps.map(([time, place, note]) => `<li><time>${time}</time><strong>${place}</strong><span>${note}</span></li>`).join('');
}

routeTabs.forEach((button) => button.addEventListener('click', () => {
  routeTabs.forEach((item) => {
    const selected = item === button;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  renderRoute(button.dataset.route);
}));
renderRoute('morning');

const dialog = document.querySelector('#lens-dialog');
const lensList = document.querySelector('#lens-list');
document.querySelectorAll('.lens').forEach((button) => button.addEventListener('click', () => {
  lensList.innerHTML = button.dataset.lens.split('|').map((item) => `<li>${item}</li>`).join('');
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

document.querySelectorAll('.booking-button').forEach((button) => button.addEventListener('click', () => {
  showToast('Partner links will appear here only after tracking and payout verification.');
}));

document.querySelector('#print-guide').addEventListener('click', () => window.print());
document.querySelector('#save-offline').addEventListener('click', async () => {
  if (!('caches' in window)) {
    showToast('Offline saving is not supported by this browser. Use Print / Save as PDF instead.');
    return;
  }
  try {
    const cache = await caches.open('eyvan-atlas-istanbul-v1');
    await cache.addAll([location.pathname, './istanbul.css', './istanbul.js', '/favicon.svg']);
    showToast('The Istanbul guide is available offline. Live Google data still needs a connection.');
  } catch {
    showToast('Offline saving could not finish. Use Print / Save as PDF instead.');
  }
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
