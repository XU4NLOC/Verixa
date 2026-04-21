// VIFC Trade Finance Platform - Application Logic

const VIFC = {
  currentScreen: "onboarding",

  investorScreens: ["onboarding", "wallet", "asset", "invest", "dashboard", "secondary", "settlement", "guide"],
  smeScreens: ["sme", "verification"],

  tokenPrice: 96,
  faceValue: 100,

  init() {
    this.loadTheme();
    this.setupEventListeners();
    this.setupNavItems();
    this.setupClickHandlers();
    showScreen("onboarding");
    updateInvestPreview();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light");
      this.updateThemeIcon("🌙");
    } else {
      this.updateThemeIcon("☀️");
    }
  },

  toggleTheme() {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    this.updateThemeIcon(isLight ? "🌙" : "☀️");
  },

  updateThemeIcon(icon) {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.textContent = icon;
    });
  },

  setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      const investInput = document.getElementById("invest-amount");
      if (investInput) {
        investInput.addEventListener("input", () => updateInvestPreview(investInput.value));
      }

      document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            overlay.classList.remove("active");
          }
        });
      });
    });
  },

  setupNavItems() {
    document.querySelectorAll(".nav-item[data-screen]").forEach((item) => {
      item.addEventListener("click", () => {
        const screenId = item.dataset.screen;
        if (screenId) {
          showScreen(screenId);
        }
      });
    });
  },

  setupClickHandlers() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      if (target.classList.contains("theme-toggle")) {
        this.toggleTheme();
        return;
      }

      if (target.dataset.screen) {
        showScreen(target.dataset.screen);
        return;
      }

      if (target.dataset.amount) {
        setInvestAmount(target.dataset.amount);
        return;
      }

      if (target.dataset.scrollTo) {
        scrollToGuideSection(target.dataset.scrollTo);
        return;
      }

      const card = target.closest("[data-screen]");
      if (card) {
        showScreen(card.dataset.screen);
        return;
      }

      const scrollTarget = target.closest("[data-scroll-to]");
      if (scrollTarget) {
        scrollToGuideSection(scrollTarget.dataset.scrollTo);
        return;
      }
    });
  }
};

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const target = document.getElementById("screen-" + screenId);
  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  const navItem = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
  if (navItem) {
    navItem.classList.add("active");
  }

  updateNavSections(screenId);
  VIFC.currentScreen = screenId;
}

function updateNavSections(screenId) {
  const investorSection = document.getElementById("nav-section-investor");
  const smeSection = document.getElementById("nav-section-sme");

  if (!investorSection || !smeSection) return;

  if (VIFC.investorScreens.includes(screenId)) {
    investorSection.classList.remove("inactive");
    investorSection.classList.add("active");
    smeSection.classList.remove("active");
    smeSection.classList.add("inactive");
  } else if (VIFC.smeScreens.includes(screenId)) {
    smeSection.classList.remove("inactive");
    smeSection.classList.add("active");
    investorSection.classList.remove("active");
    investorSection.classList.add("inactive");
  }
}

function updateInvestPreview(amount) {
  const amt = parseFloat(amount) || 0;
  const tokenPrice = VIFC.tokenPrice;
  const faceValue = VIFC.faceValue;
  const tokens = Math.floor(amt / tokenPrice);
  const returnAmt = tokens * faceValue;
  const gain = returnAmt - amt;

  const previewInvest = document.getElementById("preview-invest");
  const previewReturn = document.getElementById("preview-return");
  const previewGain = document.getElementById("preview-gain");
  const previewTokens = document.getElementById("preview-tokens");
  const tokenDisplay = document.getElementById("token-display");

  if (previewInvest) {
    previewInvest.textContent = "$" + amt.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  if (previewReturn) {
    previewReturn.textContent = "$" + returnAmt.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  if (previewGain) {
    previewGain.textContent = "+$" + gain.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  if (previewTokens) {
    previewTokens.textContent = tokens;
  }
  if (tokenDisplay) {
    tokenDisplay.textContent = tokens + " tokens";
  }
}

function setInvestAmount(amount) {
  const input = document.getElementById("invest-amount");
  if (input) {
    input.value = amount;
    updateInvestPreview(amount);
  }
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

function scrollToGuideSection(sectionId) {
  showScreen("guide");
  setTimeout(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, 100);
}

function formatCurrency(amount) {
  return "$" + parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatNumber(num) {
  return parseFloat(num).toLocaleString("en-US");
}

document.addEventListener("DOMContentLoaded", () => {
  VIFC.init();
});