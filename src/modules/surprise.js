const TARGETS_SELECTOR = ".session[id], .track[id]";

/**
 * Lleva a una sesión o canción elegida al azar y le transfiere el foco.
 */
export function initSurprise() {
  const button = document.querySelector("[data-surprise]");

  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  button.addEventListener("click", () => {
    const targets = Array.from(document.querySelectorAll(TARGETS_SELECTOR));

    if (targets.length === 0) {
      return;
    }

    const target = targets[Math.floor(Math.random() * targets.length)];

    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "center",
    });
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  });
}
