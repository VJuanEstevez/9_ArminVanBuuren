import "./styles/main.css";
import { initEmbeds } from "./js/embeds.js";
import { initReactions } from "./js/reactions.js";
import { initScrollTop } from "./js/scroll-top.js";
import { initScrollSpy } from "./js/scroll-spy.js";
import { initWaveform } from "./js/waveform.js";

initWaveform(document.querySelector("[data-waveform]"));
initEmbeds();
initReactions();
initScrollTop();
initScrollSpy();
