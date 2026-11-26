const MOBILE_QUERY = "(max-width: 44rem)";

/**
 * Convierte la navegación de la cabecera en un panel desplegable en móvil.
 * El patrón solo se activa cuando se ejecuta este módulo: sin JavaScript la
 * navegación conserva su aspecto de fila desplazable.
 */
export function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("site-nav");

  if (!(toggle instanceof HTMLButtonElement) || !(nav instanceof HTMLElement)) {
    return;
  }

  const label = toggle.querySelector("[data-menu-label]");
  const mobile = window.matchMedia(MOBILE_QUERY);
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  /**
   * @param {boolean} open
   */
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.hidden = open ? false : mobile.matches;

    if (label) {
      label.textContent = open ? "Cerrar menú" : "Abrir menú";
    }
  };

  document.documentElement.dataset.menuReady = "true";
  setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(!isOpen());
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      setOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (
      isOpen() &&
      event.target instanceof Node &&
      !toggle.contains(event.target) &&
      !nav.contains(event.target)
    ) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  mobile.addEventListener("change", () => {
    setOpen(false);
  });
}
