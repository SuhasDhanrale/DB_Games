// Use exactly the same URL for prefetch and iframe navigation, including the demo day.
export function gameUrl(htmlFile) {
  return `/${htmlFile}?day=${encodeURIComponent(window.DBJamDemo.day)}`;
}

const prefetched = new Set();
export function prefetchGame(htmlFile) {
  if (!htmlFile || navigator.connection?.saveData) return;
  const href = gameUrl(htmlFile);
  if (prefetched.has(href)) return;
  prefetched.add(href);
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'document';
  link.href = href;
  document.head.appendChild(link);
}
