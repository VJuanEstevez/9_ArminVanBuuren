import "./css/main.css";
import { initEmbeds } from "./modules/embeds.js";
import { initMobileMenu } from "./modules/mobile-menu.js";
import { initScrollTop } from "./modules/scroll-top.js";
import { initScrollSpy } from "./modules/scroll-spy.js";
import { initSurprise } from "./modules/surprise.js";
import { initWaveform } from "./modules/waveform.js";

initWaveform(document.querySelector("[data-waveform]"));
initEmbeds();
initMobileMenu();
initScrollTop();
initScrollSpy();
initSurprise();
