/* ============================================================
   MAIN ENTRY POINT
   Initializes all systems, registers routes, bootstraps app
   ============================================================ */

// Systems
import '../public/demo-session.js';
import { initI18n, translateDOM } from './i18n/index.js';
import { initAudio } from './core/audio.js';
import { resetDailyChallenges } from './systems/progression.js';
import { initToastSystem, initModalSystem } from './ui/components.js';
import { finishOpening } from './ui/opening.js';

// Router & Screens
import { initRouter, addRoute } from './core/router.js';
import renderHub from './screens/hub.js';
import renderProfile from './screens/profile.js';
import { renderSettings } from './screens/settings.js';
import renderGamePlayer from './screens/game-player.js';

// Game Registry Bootstrapping (Imports self-registering modules: 5 Daily Games)
import './games/game-1/index.js';
import './games/game-2/index.js';
import './games/game-3/index.js';
import './games/game-4/index.js';
import './games/game-5/index.js';

async function bootstrap() {
  // Give the HTML opening a paint before initializing the app. The single-file
  // build keeps its embedded media inert until an individual game needs it.
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await Promise.all([...document.querySelectorAll('link[data-app-style]')].map(link => {
    if (link.sheet || link.dataset.loaded) return;
    if (link.dataset.failed) throw new Error('App stylesheet failed to load');
    return new Promise((resolve, reject) => {
      link.addEventListener('load', resolve, { once: true });
      link.addEventListener('error', () => reject(new Error('App stylesheet failed to load')), { once: true });
    });
  }));
  // 1. Initialize core systems
  initI18n();
  initAudio();
  
  // 2. Run daily resets
  resetDailyChallenges();

  // 3. Setup global UI
  initToastSystem();
  initModalSystem();

  // 4. Register Routes
  addRoute('/', renderHub);
  addRoute('/leaderboard', renderHub);
  addRoute('/profile', renderProfile);
  addRoute('/progress', renderProfile);
  addRoute('/settings', renderSettings);
  addRoute('/game/:id', renderGamePlayer);

  // 5. Mount the app behind the opening, then reveal it once it has painted.
  const loadingScreen = document.getElementById('loading-screen');
  const appRoot = document.getElementById('app-root');

  initRouter(appRoot);
  translateDOM();
  finishOpening(loadingScreen);
}

function startApp() {
  bootstrap().catch(error => {
    console.error('[Startup]', error);
    const label = document.querySelector('#loading-screen .loading-label');
    if (label) label.textContent = 'खेल नहीं खुल सके। फिर कोशिश करने के लिए पेज दोबारा खोलें।';
    document.querySelector('#loading-screen .loading-bar')?.remove();
  });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
