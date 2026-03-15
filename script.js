const revealItems = document.querySelectorAll("[data-reveal]");
const yearTargets = document.querySelectorAll("[data-year]");
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");
const galleryLightbox = document.querySelector("[data-gallery-lightbox]");
const galleryLightboxImage = galleryLightbox?.querySelector("[data-gallery-lightbox-image]");
const galleryLightboxClose = galleryLightbox?.querySelector("[data-gallery-lightbox-close]");
const galleryTriggers = document.querySelectorAll("[data-gallery-trigger]");

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

if (galleryLightbox && galleryLightboxImage && galleryTriggers.length) {
  let lastOpenedTrigger = null;
  let suppressLightboxCloseUntil = 0;

  const closeGalleryLightbox = () => {
    if (galleryLightbox.hidden) {
      return;
    }

    galleryLightbox.hidden = true;
    document.body.classList.remove("is-locked");
    galleryLightboxImage.removeAttribute("src");
    galleryLightboxImage.alt = "";
    lastOpenedTrigger?.focus({ preventScroll: true });
  };

  const openGalleryLightbox = (trigger) => {
    const fullImage = trigger.getAttribute("data-full");
    const description = trigger.getAttribute("data-alt") || trigger.getAttribute("aria-label") || "";

    if (!fullImage) {
      return;
    }

    lastOpenedTrigger = trigger;
    galleryLightboxImage.src = fullImage;
    galleryLightboxImage.alt = description;
    galleryLightbox.hidden = false;
    document.body.classList.add("is-locked");
    suppressLightboxCloseUntil = window.performance.now() + 400;
    galleryLightboxClose?.focus({ preventScroll: true });
  };

  galleryTriggers.forEach((trigger) => {
    let startX = 0;
    let startY = 0;
    let isTrackingTap = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let isTrackingTouch = false;

    trigger.addEventListener("pointerdown", (event) => {
      startX = event.clientX;
      startY = event.clientY;
      isTrackingTap = true;
    });

    trigger.addEventListener("pointerup", (event) => {
      if (!isTrackingTap) {
        return;
      }

      const deltaX = Math.abs(event.clientX - startX);
      const deltaY = Math.abs(event.clientY - startY);
      isTrackingTap = false;

      if (deltaX > 10 || deltaY > 10) {
        return;
      }

      openGalleryLightbox(trigger);
    });

    trigger.addEventListener("pointercancel", () => {
      isTrackingTap = false;
    });

    trigger.addEventListener("click", () => {
      openGalleryLightbox(trigger);
    });

    trigger.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];

      if (!touch) {
        return;
      }

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isTrackingTouch = true;
    }, { passive: true });

    trigger.addEventListener("touchmove", (event) => {
      if (!isTrackingTouch) {
        return;
      }

      const touch = event.changedTouches[0];

      if (!touch) {
        return;
      }

      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);

      if (deltaX > 10 || deltaY > 10) {
        isTrackingTouch = false;
      }
    }, { passive: true });

    trigger.addEventListener("touchend", (event) => {
      if (!isTrackingTouch) {
        return;
      }

      event.preventDefault();
      isTrackingTouch = false;
      openGalleryLightbox(trigger);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openGalleryLightbox(trigger);
    });
  });

  galleryLightboxClose?.addEventListener("click", closeGalleryLightbox);

  galleryLightbox.addEventListener("click", (event) => {
    if (window.performance.now() < suppressLightboxCloseUntil) {
      return;
    }

    if (event.target === galleryLightbox) {
      closeGalleryLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeGalleryLightbox();
    }
  });
}
