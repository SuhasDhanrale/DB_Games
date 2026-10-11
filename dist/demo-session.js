/* The URL carries the demo edition across refresh. Player state is memory-only. */
(() => {
  if (window.DBJamDemo) return;
  try {
    if (window.parent !== window && window.parent.DBJamDemo) {
      window.DBJamDemo = window.parent.DBJamDemo;
      return;
    }
  } catch { /* Standalone or cross-origin frame. */ }
  let index = 0;
  const url = new URL(window.location.href);
  const requestedDay = url.searchParams.get('day');
  const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  if (/^d[123]$/.test(requestedDay || '')) {
    index = (Number(requestedDay[1]) - 1 + (isReload ? 1 : 0)) % 3;
  }
  const day = `d${index + 1}`;
  url.searchParams.set('day', day);
  try { history.replaceState(history.state, '', url); } catch {}
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + index);
  const state = new Map();
  window.DBJamDemo = {
    day, index, date: date.toISOString(), priorStreak: 12 + index,
    getItem: key => state.get(key) ?? null,
    setItem: (key, value) => state.set(key, String(value)),
    removeItem: key => state.delete(key),
  };
})();
