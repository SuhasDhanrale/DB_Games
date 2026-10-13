import storage from './storage.js';

export function getPlayerName() {
  const name = storage.get('player-name', '');
  return typeof name === 'string' ? name.trim().slice(0, 40) : '';
}
export function setPlayerName(name) {
  storage.set('player-name', String(name).trim().slice(0, 40));
}
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
