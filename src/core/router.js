/* ============================================================
   Router — Simple hash-based SPA router
   Maps hash routes to screen render functions
   ============================================================ */

import { bus, Events } from './events.js';

/** @type {Map<string, Function>} route → render function */
const routes = new Map();

/** @type {string|null} current route */
let currentRoute = null;

/** @type {HTMLElement|null} */
let screenContainer = null;

/** @type {string[]} navigation history stack */
const history = [];

/**
 * Register a route.
 * @param {string} path - e.g. '/', '/game/word-search', '/leaderboard'
 * @param {Function} renderFn - (container: HTMLElement, params?: Object) => void
 */
export function addRoute(path, renderFn) {
  routes.set(path, renderFn);
}

/**
 * Initialize the router.
 * @param {HTMLElement} container - element that holds screens
 */
export function initRouter(container) {
  screenContainer = container;

  window.addEventListener('hashchange', () => {
    const route = getRouteFromHash();
    _activate(route);
  });

  // Handle initial route
  const initial = getRouteFromHash();
  _activate(initial);
}

/**
 * Navigate to a route programmatically.
 * @param {string} path
 * @param {Object} [params]
 */
export function navigate(path, params = {}) {
  // Store params for the route to pick up
  _pendingParams = params;
  window.location.hash = `#${path}`;
}

/**
 * Go back in navigation history.
 */
export function goBack() {
  if (history.length > 1) {
    history.pop(); // remove current
    const prev = history[history.length - 1];
    _pendingParams = {};
    window.location.hash = `#${prev}`;
  } else {
    navigate('/');
  }
}

/**
 * Get the current route.
 * @returns {string|null}
 */
export function getCurrentRoute() {
  return currentRoute;
}

// ---- Internal ----

let _pendingParams = {};

function getRouteFromHash() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

function _activate(route) {
  if (!screenContainer) return;

  // Try exact match first, then pattern match for dynamic routes
  let renderFn = routes.get(route);
  let params = { ..._pendingParams };

  if (!renderFn) {
    // Check for dynamic route patterns like /game/:id
    for (const [pattern, fn] of routes) {
      const match = matchDynamicRoute(pattern, route);
      if (match) {
        renderFn = fn;
        params = { ...params, ...match };
        break;
      }
    }
  }

  if (!renderFn) {
    console.warn(`[Router] No route registered for: ${route}`);
    // Fallback to home
    renderFn = routes.get('/');
    if (!renderFn) return;
    route = '/';
  }

  const prevRoute = currentRoute;
  currentRoute = route;

  // Track history (avoid duplicates)
  if (history[history.length - 1] !== route) {
    history.push(route);
    // Cap history at 20
    if (history.length > 20) history.shift();
  }

  // Emit exit event for previous route
  if (prevRoute) {
    bus.emit(Events.SCREEN_EXITED, { route: prevRoute });
  }

  // Animate out existing screens
  const existingScreens = screenContainer.querySelectorAll('.screen.active');
  for (const screen of existingScreens) {
    screen.classList.remove('active');
    screen.classList.add('exit-left');
    // Clean up after transition
    screen.addEventListener('transitionend', () => {
      if (!screen.classList.contains('active')) {
        screen.remove();
      }
    }, { once: true });
    // Fallback cleanup if transition doesn't fire
    setTimeout(() => {
      if (!screen.classList.contains('active')) {
        screen.remove();
      }
    }, 400);
  }

  // Create new screen container
  const screenEl = document.createElement('div');
  screenEl.className = 'screen';
  screenEl.id = `screen-${route.replace(/\//g, '-').replace(/^-/, '')}`;
  screenContainer.appendChild(screenEl);

  // Render the route content
  try {
    renderFn(screenEl, params);
  } catch (err) {
    console.error(`[Router] Error rendering route "${route}":`, err);
    screenEl.innerHTML = `<div class="screen-body"><div class="empty-state"><div class="empty-state__icon">⚠️</div><div class="empty-state__title">Something went wrong</div></div></div>`;
  }

  // Activate with a small delay for the CSS transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      screenEl.classList.add('active');
    });
  });

  _pendingParams = {};
  bus.emit(Events.SCREEN_ENTERED, { route, params });
  bus.emit(Events.NAVIGATE, { route, params, prevRoute });
}

/**
 * Match a dynamic route pattern.
 * Pattern:  /game/:id   →  Route: /game/word-search  →  { id: 'word-search' }
 */
function matchDynamicRoute(pattern, route) {
  const patternParts = pattern.split('/');
  const routeParts = route.split('/');

  if (patternParts.length !== routeParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = routeParts[i];
    } else if (patternParts[i] !== routeParts[i]) {
      return null;
    }
  }

  return params;
}

export default { addRoute, initRouter, navigate, goBack, getCurrentRoute };
