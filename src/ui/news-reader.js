import { getCurrentRoute, navigate } from '../core/router.js';
import { getAllGames, getGame } from '../games/registry.js';

const readerId = crypto.randomUUID();
let panel;
let frame;
let newsUrl;
let returnRoute;
let previousFocus;
let coveredScreens = [];

function showNews() {
  previousFocus = document.activeElement;
  coveredScreens = [...document.querySelectorAll('#app-root > .screen')];
  coveredScreens.forEach(screen => { screen.inert = true; });
  panel.hidden = false;
  frame.focus();
}

function hideNews() {
  panel.hidden = true;
  coveredScreens.forEach(screen => { screen.inert = false; });
  coveredScreens = [];
  previousFocus?.focus();
  if (returnRoute && returnRoute !== getCurrentRoute()) navigate(returnRoute);
  returnRoute = null;
}

function closeNews(href) {
  if (!panel || panel.hidden) return;
  if (href) {
    const file = new URL(href, window.location.href).pathname.split('/').pop();
    const currentGame = getGame(getCurrentRoute()?.split('/')[2]);
    const game = getAllGames().find(game => game.htmlFile === file);
    if (game && currentGame?.htmlFile !== file) returnRoute = `/game/${game.id}`;
  }
  if (history.state?.newsReader === readerId) history.back();
  else hideNews();
}

export function openNews(href = './news.html') {
  newsUrl = new URL(href, window.location.href);
  newsUrl.searchParams.set('day', window.DBJamDemo?.day || 'd1');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'news-reader';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'News');
    panel.style.cssText = 'position:absolute;inset:0;z-index:400;background:var(--bg-app);';
    panel.hidden = true;
    frame = document.createElement('iframe');
    frame.title = 'News';
    frame.style.cssText = 'display:block;width:100%;height:100%;border:0;';
    frame.src = newsUrl.href;
    frame.addEventListener('load', () => frame.contentWindow.DBNewsView?.open(newsUrl.search));
    panel.appendChild(frame);
    document.getElementById('app-root').appendChild(panel);
    window.DBNewsReader = { close: closeNews };
    window.addEventListener('popstate', () => {
      if (!panel.hidden && history.state?.newsReader !== readerId) hideNews();
      else if (panel.hidden && history.state?.newsReader === readerId) showNews();
    });
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeNews();
    });
  } else {
    frame.contentWindow.DBNewsView?.open(newsUrl.search);
  }
  if (panel.hidden) {
    history.pushState({ ...history.state, newsReader: readerId }, '', window.location.href);
    showNews();
  }
  frame.focus();
}
