/* Three authored demo editions. Refresh preserves the chosen edition and play. */
(() => {
  if (window.DBJamDemo) return;
  try {
    if (window.parent !== window && window.parent.DBJamDemo) {
      window.DBJamDemo = window.parent.DBJamDemo;
      return;
    }
  } catch { /* Standalone or cross-origin frame. */ }
  const url = new URL(window.location.href);
  const requestedDay = url.searchParams.get('day');
  const day = /^d[123]$/.test(requestedDay || '') ? requestedDay : 'd1';
  const index = Number(day[1]) - 1;
  url.searchParams.set('day', day);
  try { history.replaceState(history.state, '', url); } catch {}
  const calendarDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const state = new Map();
  const prefix = 'db-games:rounds:v1:';
  let persistent = false;
  try { localStorage.setItem(prefix + 'storage-check', '1'); localStorage.removeItem(prefix + 'storage-check'); persistent = true; } catch {}
  const keyFor = key => prefix + (key.startsWith('db-jam:') || key.startsWith('wordal:spoiled:') ? calendarDate + ':' : '') + key;
  const getItem = key => {
    try { const value = localStorage.getItem(keyFor(key)); if (value !== null) return value; } catch {}
    return state.get(key) ?? null;
  };
  const setItem = (key, value) => {
    state.set(key, String(value));
    try { localStorage.setItem(keyFor(key), String(value)); } catch {}
  };
  const removeItem = key => {
    state.delete(key);
    try { localStorage.removeItem(keyFor(key)); } catch {}
  };
  window.DBJamDemo = {
    day, index, date: calendarDate + 'T12:00:00+05:30', calendarDate, priorStreak: 0, persistent,
    getItem, setItem, removeItem,
    clearGameState() {
      state.clear();
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith(prefix)) keys.push(key);
        }
        keys.forEach(key => localStorage.removeItem(key));
      } catch {}
    }
  };
})();
