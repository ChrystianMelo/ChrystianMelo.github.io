const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-menu');
const year = document.querySelector('#year');

function setMenuState(isOpen) {
  if (!menuToggle || !navigation) return;

  navigation.classList.toggle('is-open', isOpen);
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.querySelector('.sr-only').textContent = isOpen
    ? 'Close navigation menu'
    : 'Open navigation menu';
  document.body.classList.toggle('menu-open', isOpen);
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenuState(!isOpen);
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuState(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuState(false);
    menuToggle?.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 761px)').matches) setMenuState(false);
});

if (year) year.textContent = new Date().getFullYear();
