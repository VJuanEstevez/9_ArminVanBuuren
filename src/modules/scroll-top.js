const SHOW_AFTER_PX = 480;

/**
 * Muestra el botón de volver arriba tras desplazarse y gestiona el scroll suave.
 */
export function initScrollTop() {
  const button = document.querySelector("[data-scroll-top]");

  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  const updateVisibility = () => {
    button.hidden = window.scrollY < SHOW_AFTER_PX;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateVisibility);
      }
    },
    { passive: true }
  );

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  });

  updateVisibility();
}
