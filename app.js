
const investorScreens = new Set(['onboarding', 'wallet', 'asset', 'invest', 'dashboard', 'secondary', 'settlement']);

function setMobileNavState(isOpen) {
  document.body.classList.toggle('mobile-nav-open', isOpen);
  const toggle = document.querySelector('.mobile-nav-toggle');
  if (toggle) {
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.textContent = isOpen ? '✕' : '☰';
  }
}

function closeMobileNav() {
  setMobileNavState(false);
}

function updateFlowState(screenId) {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  const flow = investorScreens.has(screenId) ? 'investor' : 'sme';
  sidebar.setAttribute('data-active-flow', flow);
}

function showScreen(id, navEl) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
  const screen = document.getElementById(`screen-${id}`);
  if (screen) screen.classList.add('active');
  updateFlowState(id);
  if (navEl) navEl.classList.add('active');
}

function updateThemeButtons(icon) {
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.textContent = icon;
  });
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeButtons(isLight ? '🌙' : '☀️');
}

function updateInvest(amount) {
  const amt = parseFloat(amount) || 0;
  const purchasePrice = 96;
  const faceValue = 100;
  const tokens = Math.floor(amt / purchasePrice);
  const returnAmt = tokens * faceValue;
  const gain = returnAmt - amt;

  const money = (value) =>
    `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  setText('preview-invest', money(amt));
  setText('preview-return', money(returnAmt));
  setText('preview-gain', `+$${gain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  setText('preview-tokens', `~${tokens}`);
  setText('token-display', `~${tokens} tokens`);
}

document.addEventListener('click', (event) => {
  const nav = event.target.closest('.nav-item[data-screen]');
  if (nav) {
    showScreen(nav.dataset.screen, nav);
    closeMobileNav();
    return;
  }


  const jump = event.target.closest('[data-screen-jump]');
  if (jump) {
    const id = jump.dataset.screenJump;
    const nav = document.querySelector(`.nav-item[data-screen="${id}"]`);
    showScreen(id, nav);
    closeMobileNav();
    return;
  }

  const action = event.target.closest('[data-action="toggle-theme"]');
  if (action) {
    toggleTheme();
    return;
  }

  const mobileNavToggle = event.target.closest('[data-action="toggle-mobile-nav"]');
  if (mobileNavToggle) {
    const isOpen = document.body.classList.contains('mobile-nav-open');
    setMobileNavState(!isOpen);
    return;
  }

  const closeNav = event.target.closest('[data-action="close-mobile-nav"]');
  if (closeNav) {
    closeMobileNav();
    return;
  }

  const quick = event.target.closest('[data-invest-quick]');
  if (quick) {
    const amount = Number(quick.dataset.investQuick);
    const input = document.getElementById('invest-amount');
    if (input) {
      input.value = String(amount);
      updateInvest(amount);
    }
  }
});

document.addEventListener('input', (event) => {
  const input = event.target.closest('[data-role="invest-input"]');
  if (input) updateInvest(input.value);
});

setInterval(() => {
  document.querySelectorAll('.check-spin').forEach((el) => {
    el.style.transform = el.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
    el.style.transition = 'transform 0.5s linear';
  });
}, 800);

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    updateThemeButtons('🌙');
  } else {
    updateThemeButtons('☀️');
  }

  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen && activeScreen.id) updateFlowState(activeScreen.id.replace('screen-', ''));

  const investAmount = document.getElementById('invest-amount');
  if (investAmount) updateInvest(investAmount.value);

  if (window.innerWidth > 900) closeMobileNav();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobileNav();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav();
});
