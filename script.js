const revealItems = document.querySelectorAll("[data-reveal]");
const yearTargets = document.querySelectorAll("[data-year]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");

yearTargets.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

if (menuToggle && menuPanel) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Navigation öffnen");
    menuPanel.classList.remove("is-open");
  };

  const openMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Navigation schließen");
    menuPanel.classList.add("is-open");
  };

  closeMenu();

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  menuPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!menuPanel.classList.contains("is-open")) {
      return;
    }

    if (menuPanel.contains(event.target) || menuToggle.contains(event.target)) {
      return;
    }

    closeMenu();
  });
}

if (revealItems.length) {
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

if (!prefersReducedMotion.matches) {
  const heroImage = document.querySelector("[data-parallax]");

  if (heroImage) {
    let rafId = 0;

    const updateHeroPosition = () => {
      const offset = Math.min(window.scrollY * 0.06, 24);
      heroImage.style.transform = `scale(1.02) translate3d(0, ${offset}px, 0)`;
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(updateHeroPosition);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateHeroPosition();
  }
}
