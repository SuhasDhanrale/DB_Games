/* Three authored editions rotate on refresh; play lives only in this page. */
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
  const currentIndex = /^d[123]$/.test(requestedDay || '') ? Number(requestedDay[1]) - 1 : 0;
  const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  const index = isReload ? (currentIndex + 1) % 3 : currentIndex;
  const day = 'd' + (index + 1);
  url.searchParams.set('day', day);
  try { history.replaceState(history.state, '', url); } catch {}
  const calendarDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const state = new Map();
  const getItem = key => state.get(key) ?? null;
  const setItem = (key, value) => state.set(key, String(value));
  const removeItem = key => state.delete(key);
  window.DBJamDemo = {
    day, index, date: calendarDate + 'T12:00:00+05:30', calendarDate, priorStreak: 0, persistent: false,
    getItem, setItem, removeItem,
    clearGameState() {
      state.clear();
    }
  };
})();
