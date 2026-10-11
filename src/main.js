/* ============================================================
   MAIN ENTRY POINT
   Initializes all systems, registers routes, bootstraps app
   ============================================================ */

// Systems
import { initI18n, translateDOM } from './i18n/index.js';
import { initAudio } from './core/audio.js';
import { checkDailyReset } from './systems/leaderboard.js';
import { resetDailyChallenges } from './systems/progression.js';
import { initToastSystem, initModalSystem } from './ui/components.js';

// Router & Screens
import { initRouter, addRoute } from './core/router.js';
import renderHub from './screens/hub.js';
import renderLeaderboard from './screens/leaderboard.js';
import renderProfile from './screens/profile.js';
import renderSettings from './screens/settings.js';
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
  checkDailyReset();
  resetDailyChallenges();

  // 3. Setup global UI
  initToastSystem();
  initModalSystem();

  // 4. Register Routes
  addRoute('/', renderHub);
  addRoute('/leaderboard', renderLeaderboard);
  addRoute('/profile', renderProfile);
  addRoute('/settings', renderSettings);
  addRoute('/game/:id', renderGamePlayer);

  // 5. Hide Loading Screen
  const loadingScreen = document.getElementById('loading-screen');
  const appRoot = document.getElementById('app-root');

  // Simulate minimal load time to show off the loader
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => loadingScreen.remove(), 500);
    }
    
    // 6. Start Router (mounts initial screen)
    initRouter(appRoot);
    
    // Translate any lingering DOM nodes (though screens handle their own usually)
    translateDOM();
  }, 800);
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
