const BAR_COUNT = 64;

/**
 * Genera las barras del ecualizador decorativo del hero.
 * @param {HTMLElement | null} container
 */
export function initWaveform(container) {
  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();

  for (let index = 0; index < BAR_COUNT; index += 1) {
    const bar = document.createElement("span");
    const height = Math.round(16 + Math.random() * 84);

    bar.style.setProperty("--bar-height", `${height}%`);
    bar.style.setProperty("--bar-index", String(index));
    fragment.append(bar);
  }

  container.replaceChildren(fragment);
}
