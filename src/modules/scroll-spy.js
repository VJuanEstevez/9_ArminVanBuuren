const SECTION_OFFSET_RATIO = 0.3;

/**
 * Marca con `aria-current` el enlace de navegación de la sección visible.
 */
export function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));

  const sections = links
    .map((link) => {
      const target = link.getAttribute("href");
      const section = target ? document.querySelector(target) : null;

      return section instanceof HTMLElement ? { link, section } : null;
    })
    .filter((item) => item !== null);

  if (sections.length === 0) {
    return;
  }

  let ticking = false;

  const updateActiveSection = () => {
    const marker = window.scrollY + window.innerHeight * SECTION_OFFSET_RATIO;
    let current = sections[0];

    sections.forEach((item) => {
      if (item.section.offsetTop <= marker) {
        current = item;
      }
    });

    sections.forEach((item) => {
      if (item === current) {
        item.link.setAttribute("aria-current", "location");
      } else {
        item.link.removeAttribute("aria-current");
      }
    });

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActiveSection);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();
}
