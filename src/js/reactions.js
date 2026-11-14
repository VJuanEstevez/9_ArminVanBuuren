import { createCommentId, loadReaction, saveReaction } from "./storage.js";

const STAR_VALUES = [5, 4, 3, 2, 1];
const MAX_NAME_LENGTH = 40;
const MAX_TEXT_LENGTH = 600;

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/**
 * Monta el panel de valoración y comentarios en cada contenedor
 * `.reactions[data-reaction-id]`.
 * @param {Document | HTMLElement} root
 */
export function initReactions(root = document) {
  const template = document.querySelector("#reactions-template");

  if (!(template instanceof HTMLTemplateElement)) {
    return;
  }

  root.querySelectorAll(".reactions[data-reaction-id]").forEach((mount) => {
    if (mount instanceof HTMLElement) {
      setupReactions(mount, template);
    }
  });
}

/**
 * @param {HTMLElement} mount
 * @param {HTMLTemplateElement} template
 */
function setupReactions(mount, template) {
  const reactionId = mount.dataset.reactionId?.trim();

  if (!reactionId) {
    return;
  }

  mount.append(template.content.cloneNode(true));

  const score = mount.querySelector('[data-role="score"]');
  const count = mount.querySelector('[data-role="count"]');
  const stars = mount.querySelector('[data-role="stars"]');
  const form = mount.querySelector('[data-role="form"]');
  const nameInput = mount.querySelector('[data-role="name"]');
  const nameLabel = mount.querySelector('[data-role="name-label"]');
  const commentInput = mount.querySelector('[data-role="comment"]');
  const commentLabel = mount.querySelector('[data-role="comment-label"]');
  const status = mount.querySelector('[data-role="status"]');
  const commentList = mount.querySelector('[data-role="comments"]');
  const emptyState = mount.querySelector('[data-role="empty"]');

  if (
    !score ||
    !count ||
    !stars ||
    !form ||
    !nameInput ||
    !nameLabel ||
    !commentInput ||
    !commentLabel ||
    !status ||
    !commentList ||
    !emptyState
  ) {
    return;
  }

  const nameId = `${reactionId}-name`;
  const commentId = `${reactionId}-comment`;

  nameInput.id = nameId;
  nameLabel.htmlFor = nameId;
  commentInput.id = commentId;
  commentLabel.htmlFor = commentId;

  const starInputs = buildStars(stars, reactionId);
  const state = loadReaction(reactionId);

  /**
   * @param {number} value
   */
  function registerVote(value) {
    if (state.myVote === null) {
      state.totalVotes += 1;
      state.sumRatings += value;
    } else {
      state.sumRatings += value - state.myVote;
    }

    state.myVote = value;
    saveReaction(reactionId, state);
    renderSummary();
  }

  function renderSummary() {
    if (state.totalVotes > 0) {
      const average = state.sumRatings / state.totalVotes;
      score.textContent = `★ ${average.toFixed(1)}`;
      count.textContent = `${state.totalVotes} ${state.totalVotes === 1 ? "voto" : "votos"}${
        state.comments.length > 0
          ? ` · ${state.comments.length} ${state.comments.length === 1 ? "comentario" : "comentarios"}`
          : ""
      }`;
    } else {
      score.textContent = "Sin votos";
      count.textContent =
        state.comments.length > 0
          ? `${state.comments.length} ${state.comments.length === 1 ? "comentario" : "comentarios"}`
          : "";
    }

    starInputs.forEach((input) => {
      input.checked = Number(input.value) === state.myVote;
    });
  }

  function renderComments() {
    commentList.replaceChildren(...state.comments.map(createCommentElement));
    emptyState.hidden = state.comments.length > 0;
  }

  stars.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const value = Number(event.target.value);

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return;
    }

    registerVote(value);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim().replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH);
    const text = commentInput.value.trim().slice(0, MAX_TEXT_LENGTH);

    if (!name || !text) {
      showStatus(
        !name ? "Escribe tu nombre para publicar." : "Escribe un comentario antes de publicar.",
        "error",
      );
      (!name ? nameInput : commentInput).focus();
      return;
    }

    state.comments.unshift({
      id: createCommentId(),
      name,
      text,
      date: new Date().toISOString(),
    });
    state.comments = state.comments.slice(0, 100);

    saveReaction(reactionId, state);
    commentInput.value = "";
    showStatus("Publicado. Gracias por sumarte.", "success");
    renderComments();
    renderSummary();
    commentInput.focus();
  });

  form.addEventListener("input", () => {
    status.hidden = true;
  });

  /**
   * @param {string} message
   * @param {"success" | "error"} stateName
   */
  function showStatus(message, stateName) {
    status.textContent = message;
    status.dataset.state = stateName;
    status.hidden = false;
  }

  renderComments();
  renderSummary();
}

/**
 * @param {Element} container
 * @param {string} reactionId
 * @returns {HTMLInputElement[]}
 */
function buildStars(container, reactionId) {
  const inputs = [];

  STAR_VALUES.forEach((value) => {
    const input = document.createElement("input");
    const label = document.createElement("label");
    const glyph = document.createElement("span");
    const accessibleText = document.createElement("span");

    input.type = "radio";
    input.name = `${reactionId}-rating`;
    input.value = String(value);
    input.id = `${reactionId}-rating-${value}`;

    label.htmlFor = input.id;
    glyph.textContent = "★";
    glyph.setAttribute("aria-hidden", "true");
    accessibleText.className = "visually-hidden";
    accessibleText.textContent = `${value} de 5 estrellas`;

    label.append(glyph, accessibleText);
    container.append(input, label);
    inputs.push(input);
  });

  return inputs;
}

/**
 * @param {{ name: string, text: string, date: string }} comment
 * @returns {HTMLLIElement}
 */
function createCommentElement(comment) {
  const item = document.createElement("li");
  const meta = document.createElement("p");
  const author = document.createElement("strong");
  const time = document.createElement("time");
  const text = document.createElement("p");

  item.className = "comment";
  meta.className = "comment__meta";
  text.className = "comment__text";

  author.textContent = comment.name;
  time.dateTime = comment.date;
  time.textContent = formatDate(comment.date);
  text.textContent = comment.text;

  meta.append(author, time);
  item.append(meta, text);

  return item;
}

/**
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);

  return Number.isNaN(date.getTime()) ? "" : DATE_FORMATTER.format(date);
}
