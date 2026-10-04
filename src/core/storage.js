/* ============================================================
   Storage — Safe localStorage abstraction with namespacing
   ============================================================ */

const NAMESPACE = 'db_gamelab';

/**
 * Get a value from localStorage.
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
export function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(`${NAMESPACE}:${key}`);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Set a value in localStorage.
 * @param {string} key
 * @param {*} value
 */
export function set(key, value) {
  try {
    localStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn('[Storage] Could not write:', key, err);
  }
}

/**
 * Remove a key.
 * @param {string} key
 */
export function remove(key) {
  try {
    localStorage.removeItem(`${NAMESPACE}:${key}`);
  } catch {
    // ignore
  }
}

/**
 * Check if a key exists.
 * @param {string} key
 * @returns {boolean}
 */
export function has(key) {
  return localStorage.getItem(`${NAMESPACE}:${key}`) !== null;
}

/**
 * Get all keys under our namespace.
 * @returns {string[]}
 */
export function keys() {
  const prefix = `${NAMESPACE}:`;
  const result = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) {
      result.push(k.slice(prefix.length));
    }
  }
  return result;
}

/**
 * Clear ALL game lab data.
 */
export function clearAll() {
  const toRemove = keys();
  for (const k of toRemove) {
    remove(k);
  }
}

/**
 * Get or initialize a value (useful for first-run defaults).
 * @param {string} key
 * @param {*} initialValue
 * @returns {*}
 */
export function getOrInit(key, initialValue) {
  if (!has(key)) {
    set(key, initialValue);
    return initialValue;
  }
  return get(key);
}

/**
 * Update a stored object by merging partial data.
 * @param {string} key
 * @param {Object} partial
 * @returns {Object} merged result
 */
export function merge(key, partial) {
  const existing = get(key, {});
  const merged = { ...existing, ...partial };
  set(key, merged);
  return merged;
}

export default { get, set, remove, has, keys, clearAll, getOrInit, merge };
