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
import { playOpening } from './ui/opening.js';

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

  // 5. Hide Loading Screen
  const loadingScreen = document.getElementById('loading-screen');
  const appRoot = document.getElementById('app-root');

  playOpening(loadingScreen, () => {
    // 6. Start Router (mounts initial screen)
    initRouter(appRoot);
    
    // Translate any lingering DOM nodes (though screens handle their own usually)
    translateDOM();
  });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
