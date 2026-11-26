const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** Ancho máximo de la miniatura genérica que devuelve YouTube. */
const PLACEHOLDER_MAX_WIDTH = 120;

const PLAY_ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
  </svg>
`;

/**
 * Convierte cada contenedor `.embed[data-video-id]` en una miniatura
 * que carga el iframe de YouTube solo cuando la persona pulsa sobre ella.
 * @param {Document | HTMLElement} root
 */
export function initEmbeds(root = document) {
  root.querySelectorAll(".embed[data-video-id]").forEach(buildFacade);
}

/**
 * @param {HTMLElement} container
 */
function buildFacade(container) {
  const videoId = container.dataset.videoId?.trim();

  if (!videoId || !VIDEO_ID_PATTERN.test(videoId)) {
    return;
  }

  const title = container.dataset.videoTitle?.trim() || "Vídeo de YouTube";
  const label = container.dataset.videoLabel?.trim() || "";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "embed__facade";

  const image = createThumbnail(videoId);
  const scrim = document.createElement("span");
  scrim.className = "embed__scrim";
  scrim.setAttribute("aria-hidden", "true");

  const play = document.createElement("span");
  play.className = "embed__play";
  play.setAttribute("aria-hidden", "true");
  play.innerHTML = PLAY_ICON;

  const accessibleName = document.createElement("span");
  accessibleName.className = "visually-hidden";
  accessibleName.textContent = `Reproducir: ${title}`;

  button.append(image, scrim, play);

  if (label) {
    const badge = document.createElement("span");
    badge.className = "embed__label";
    badge.textContent = label;
    button.append(badge);
  }

  button.append(accessibleName);
  button.addEventListener("click", () => playVideo(container, videoId, title));
  container.append(button);
}

/**
 * @param {string} videoId
 * @returns {HTMLImageElement}
 */
function createThumbnail(videoId) {
  const image = document.createElement("img");
  const highRes = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const fallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  image.className = "embed__image";
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.width = 1280;
  image.height = 720;

  // YouTube devuelve, con código 404, una miniatura genérica de 120x90 cuando
  // el vídeo no tiene versión de alta resolución. Se detecta por su tamaño.
  image.addEventListener(
    "load",
    () => {
      if (image.naturalWidth <= PLACEHOLDER_MAX_WIDTH) {
        image.src = fallback;
      }
    },
    { once: true }
  );

  image.addEventListener("error", () => {
    if (image.src !== fallback) {
      image.src = fallback;
      return;
    }

    image.classList.add("embed__image--missing");
  });

  image.src = highRes;

  return image;
}

/**
 * @param {HTMLElement} container
 * @param {string} videoId
 * @param {string} title
 */
function playVideo(container, videoId, title) {
  const iframe = document.createElement("iframe");

  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = title;
  iframe.loading = "lazy";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  container.classList.add("is-playing");
  container.replaceChildren(iframe);

  iframe.focus();
}
