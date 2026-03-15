const revealItems = document.querySelectorAll("[data-reveal]");
const yearTargets = document.querySelectorAll("[data-year]");
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");
const galleryDialog = document.querySelector("[data-gallery-dialog]");
const galleryDialogImage = galleryDialog?.querySelector("[data-gallery-dialog-image]");
const galleryDialogCaption = galleryDialog?.querySelector("[data-gallery-dialog-caption]");
const galleryDialogClose = galleryDialog?.querySelector("[data-gallery-dialog-close]");
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

if (galleryDialog && galleryDialogImage && galleryTriggers.length) {
  const closeGalleryDialog = () => {
    if (!galleryDialog.open) {
      return;
    }

    galleryDialog.close();
  };

  const openGalleryDialog = (trigger) => {
    const fullImage = trigger.getAttribute("data-full");
    const description = trigger.getAttribute("data-alt") || "";

    if (!fullImage) {
      return;
    }

    galleryDialogImage.src = fullImage;
    galleryDialogImage.alt = description;

    if (galleryDialogCaption) {
      galleryDialogCaption.textContent = description;
    }

    if (!galleryDialog.open) {
      galleryDialog.showModal();
    }

    document.body.classList.add("is-locked");
  };

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openGalleryDialog(trigger));
  });

  galleryDialogClose?.addEventListener("click", closeGalleryDialog);

  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) {
      closeGalleryDialog();
    }
  });

  galleryDialog.addEventListener("close", () => {
    document.body.classList.remove("is-locked");
    galleryDialogImage.removeAttribute("src");
    galleryDialogImage.alt = "";

    if (galleryDialogCaption) {
      galleryDialogCaption.textContent = "";
    }
  });
}
