const revealItems = document.querySelectorAll("[data-reveal]");
const yearTargets = document.querySelectorAll("[data-year]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

yearTargets.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

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
