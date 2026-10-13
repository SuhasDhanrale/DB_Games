// Keep earned Mashal bars across visits while demo rounds still reset on refresh.
const KEY = 'db-games:v1:mashal-completions';
let completed = [];

export function getMashalCompletions() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    if (Array.isArray(saved)) completed = [...new Set([...completed, ...saved.filter(key => typeof key === 'string' && /^\d{4}-\d{2}-\d{2}:(wordal|niti|jodo|cricket|carrom)$/.test(key))])];
  } catch { /* Keep this visit's progress when browser storage is unavailable. */ }
  return [...completed];
}

export function awardMashalCompletion(date, gameId) {
  const keys = getMashalCompletions();
  const key = `${date}:${gameId}`;
  if (keys.includes(key)) return false;
  completed = [...keys, key];
  try { window.localStorage.setItem(KEY, JSON.stringify(completed)); } catch { /* Session fallback. */ }
  return true;
}

export function resetMashalCompletions() {
  completed = [];
  try { window.localStorage.removeItem(KEY); } catch { /* Session fallback. */ }
}
