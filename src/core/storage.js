/* Preferences and progress live only until this page is refreshed. */
const values = new Map();
const clone = value => JSON.parse(JSON.stringify(value));
export function get(key, fallback = null) {
  return values.has(key) ? clone(values.get(key)) : fallback;
}
export function set(key, value) {
  values.set(key, clone(value));
}
export function remove(key) {
  values.delete(key);
}
export function has(key) { return keys().includes(key); }
export function keys() {
  return [...values.keys()];
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
