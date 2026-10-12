import audio from '../core/audio.js';
import '../styles/game-music.css';

const musicIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/><path class="game-music__slash" d="m3 3 18 18"/></svg>';

export function mountMusicButton(container, controller = audio, lang = 'hi', standalone = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'game-music' + (standalone ? ' game-music--standalone' : '');
  button.innerHTML = musicIcon;
  const update = () => {
    const enabled = controller.isMusicEnabled();
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', lang === 'en' ? (enabled ? 'Turn music off' : 'Turn music on') : (enabled ? 'संगीत बंद करें' : 'संगीत चालू करें'));
    button.title = button.getAttribute('aria-label');
  };
  update();
  button.addEventListener('click', () => {
    controller.unlockAudio();
    controller.setMusicEnabled(!controller.isMusicEnabled());
  });
  const unsubscribe = controller.onAudioChange(update);
  container.appendChild(button);
  return () => { unsubscribe(); button.remove(); };
}

// The parent owns embedded music. The child forwards real gestures so direct
// links and iframe play both unlock audio, with exactly one music player.
export function installGameMusic(gameId) {
  let controller = audio;
  try { controller = window.parent !== window ? (window.parent.DBGameLab?.audio || audio) : audio; } catch {}
  window.DBGameAudio = controller;
  const owned = controller === audio;
  if (owned) controller.initAudio();
  const unlock = () => controller.unlockAudio();
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);
  const ready = () => {
    if (!owned) return;
    // The intro helper adds its help control in the same module turn. Move it
    // into one reserved toolbar rather than floating controls over the board.
    queueMicrotask(() => {
      const toolbar = document.createElement('nav');
      toolbar.className = 'game-music-toolbar';
      toolbar.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Music and help' : 'संगीत और मदद');
      const label = document.createElement('span');
      label.textContent = document.title.split(/[·|]/)[0].trim();
      toolbar.appendChild(label);
      mountMusicButton(toolbar, controller, document.documentElement.lang, true);
      const help = document.querySelector('.gi-help');
      if (help) toolbar.appendChild(help);
      document.body.classList.add('has-game-music');
      document.body.appendChild(toolbar);
    });
    Promise.resolve(window.gameIntroReady).then(() => controller.startMusic(gameId));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
  if (owned) window.addEventListener('pageshow', event => { if (event.persisted) controller.startMusic(gameId); });
}
