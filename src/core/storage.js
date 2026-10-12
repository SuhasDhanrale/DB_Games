/* Device-local preferences and progress, with a memory fallback when blocked. */
const values = new Map();
const PREFIX = 'db-games:v1:';
const clone = value => JSON.parse(JSON.stringify(value));
export function get(key, fallback = null) {
  try { const raw = localStorage.getItem(PREFIX + key); if (raw !== null) return JSON.parse(raw); } catch {}
  return values.has(key) ? clone(values.get(key)) : fallback;
}
export function set(key, value) {
  values.set(key, clone(value));
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
}
export function remove(key) {
  values.delete(key);
  try { localStorage.removeItem(PREFIX + key); } catch {}
}
export function has(key) { return keys().includes(key); }
export function keys() {
  const found = new Set(values.keys());
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(PREFIX)) found.add(key.slice(PREFIX.length));
    }
  } catch {}
  return [...found];
}
export function clearAll() { keys().forEach(remove); }
export function getOrInit(key, initialValue) {
  if (!has(key)) set(key, initialValue);
  return get(key);
}
export function merge(key, partial) {
  const merged = { ...get(key, {}), ...partial };
  set(key, merged);
  return merged;
}
export default { get, set, remove, has, keys, clearAll, getOrInit, merge };
