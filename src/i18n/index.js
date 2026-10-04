/* ============================================================
   i18n — Internationalization engine
   Reactive language switching with template interpolation
   ============================================================ */

import { translations } from './translations.js';
import { bus, Events } from '../core/events.js';
import storage from '../core/storage.js';

const STORAGE_KEY = 'lang';
const SUPPORTED_LANGS = ['en', 'hi'];
const DEFAULT_LANG = 'hi'; // Default to Hindi for Dainik Bhaskar audience

let currentLang = DEFAULT_LANG;

/**
 * Initialize i18n — reads saved preference or uses default.
 */
export function initI18n() {
  const saved = storage.get(STORAGE_KEY);
  if (saved && SUPPORTED_LANGS.includes(saved)) {
    currentLang = saved;
  }
  document.documentElement.lang = currentLang;
}

/**
 * Get the current language code.
 * @returns {'en'|'hi'}
 */
export function getLang() {
  return currentLang;
}

/**
 * Switch language.
 * @param {'en'|'hi'} lang
 */
export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    console.warn(`[i18n] Unsupported language: ${lang}`);
    return;
  }
  if (lang === currentLang) return;

  currentLang = lang;
  storage.set(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  bus.emit(Events.LANG_CHANGED, { lang });
}

/**
 * Toggle between Hindi and English.
 */
export function toggleLang() {
  setLang(currentLang === 'en' ? 'hi' : 'en');
}

/**
 * Translate a key, with optional interpolation.
 * @param {string} key - dot-notation key, e.g. 'hub.title'
 * @param {Object} [params] - interpolation params, e.g. { count: 5 }
 * @returns {string}
 *
 * @example
 *   t('prog.streak_fire', { count: 7 })
 *   // → "🔥 7 day streak!" (en) or "🔥 7 दिन की स्ट्रीक!" (hi)
 */
export function t(key, params = {}) {
  const dict = translations[currentLang] || translations[DEFAULT_LANG];
  let str = dict[key];

  if (str === undefined) {
    // Fallback to English if Hindi key is missing
    str = translations.en[key];
    if (str === undefined) {
      console.warn(`[i18n] Missing key: "${key}"`);
      return key;
    }
  }

  // Interpolate {param} placeholders
  if (params && typeof params === 'object') {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }

  return str;
}

/**
 * Auto-translate all elements with data-i18n attribute.
 * Usage:  <span data-i18n="hub.title"></span>
 *         <input data-i18n-placeholder="common.search" />
 *
 * @param {HTMLElement} [root=document]
 */
export function translateDOM(root = document) {
  // Text content
  const els = root.querySelectorAll('[data-i18n]');
  for (const el of els) {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  }

  // Placeholders
  const placeholders = root.querySelectorAll('[data-i18n-placeholder]');
  for (const el of placeholders) {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  }

  // Aria labels
  const ariaEls = root.querySelectorAll('[data-i18n-aria]');
  for (const el of ariaEls) {
    const key = el.getAttribute('data-i18n-aria');
    if (key) el.setAttribute('aria-label', t(key));
  }
}

/**
 * Get all supported languages.
 */
export function getSupportedLangs() {
  return [...SUPPORTED_LANGS];
}

export default { initI18n, getLang, setLang, toggleLang, t, translateDOM, getSupportedLangs };
