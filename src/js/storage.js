const STORAGE_KEY = "avb:reactions:v1";
const FALLBACK_VOTE = null;
const MAX_COMMENTS = 100;
const MAX_NAME_LENGTH = 40;
const MAX_TEXT_LENGTH = 600;

/** @type {Record<string, ReactionState> | null} */
let cache = null;

/**
 * @typedef {Object} ReactionComment
 * @property {string} id
 * @property {string} name
 * @property {string} text
 * @property {string} date
 */

/**
 * @typedef {Object} ReactionState
 * @property {number} totalVotes
 * @property {number} sumRatings
 * @property {number | null} myVote
 * @property {ReactionComment[]} comments
 */

/**
 * @param {string} id
 * @returns {ReactionState}
 */
export function loadReaction(id) {
  return normalizeState(readAll()[id]);
}

/**
 * @param {string} id
 * @param {ReactionState} state
 */
export function saveReaction(id, state) {
  const all = readAll();
  all[id] = state;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Sin almacenamiento disponible: la página sigue funcionando en memoria.
  }
}

/**
 * @returns {Record<string, unknown>}
 */
function readAll() {
  if (cache) {
    return cache;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    cache = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    cache = {};
  }

  return cache;
}

/**
 * @param {unknown} raw
 * @returns {ReactionState}
 */
function normalizeState(raw) {
  if (!raw || typeof raw !== "object") {
    return { totalVotes: 0, sumRatings: 0, myVote: FALLBACK_VOTE, comments: [] };
  }

  const source = /** @type {Record<string, unknown>} */ (raw);
  const totalVotes = Number.isFinite(source.totalVotes)
    ? Math.max(0, Math.trunc(Number(source.totalVotes)))
    : 0;
  const rawSum = Number.isFinite(source.sumRatings) ? Number(source.sumRatings) : 0;
  const sumRatings = Math.min(Math.max(0, rawSum), totalVotes * 5);
  const myVote =
    Number.isInteger(source.myVote) && Number(source.myVote) >= 1 && Number(source.myVote) <= 5
      ? Number(source.myVote)
      : null;

  const comments = Array.isArray(source.comments)
    ? source.comments
        .map(normalizeComment)
        .filter((comment) => comment !== null)
        .slice(0, MAX_COMMENTS)
    : [];

  return { totalVotes, sumRatings, myVote, comments };
}

/**
 * @param {unknown} raw
 * @returns {ReactionComment | null}
 */
function normalizeComment(raw) {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = /** @type {Record<string, unknown>} */ (raw);
  const name = typeof source.name === "string" ? source.name.trim().slice(0, MAX_NAME_LENGTH) : "";
  const text = typeof source.text === "string" ? source.text.trim().slice(0, MAX_TEXT_LENGTH) : "";

  if (!name || !text) {
    return null;
  }

  const parsedDate = typeof source.date === "string" ? new Date(source.date) : new Date();
  const date = Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

  return {
    id: typeof source.id === "string" ? source.id : createCommentId(),
    name,
    text,
    date,
  };
}

/**
 * @returns {string}
 */
export function createCommentId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
