function installSingleFile() {
  const decoder = new TextDecoder();
  const decodedPages = new Map();
  const embeddedAssets = new Map();
  function embedded(kind, path) {
    const node = document.getElementById(`db-embedded-${kind}:${path}`);
    if (!node) throw new Error(`Missing embedded ${kind}: ${path}`);
    const value = node.textContent;
    node.remove();
    return value;
  }
  window.DBSingleFile = {
    asset(path) {
      if (!embeddedAssets.has(path)) embeddedAssets.set(path, embedded('asset', path));
      return embeddedAssets.get(path);
    },
    page(file, search = '') {
      if (!decodedPages.has(file)) {
        const binary = atob(embedded('page', file));
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
        decodedPages.set(file, decoder.decode(bytes));
      }
      const url = new URL(file + search, window.location.href);
      const setup = `(${initializeEmbeddedPage.toString()})(${JSON.stringify(url.href).replaceAll('<', '\\u003c')});`;
      return decodedPages.get(file).replace(/<head\b[^>]*>/i, match => `${match}<script>${setup}<\/script>`);
    },
  };

  // Preserve the existing settings link without requiring music-preview.html.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('/music-preview.html')) return;
    event.preventDefault();
    const dialog = document.createElement('dialog');
    dialog.id = 'single-file-music';
    dialog.setAttribute('aria-label', 'Music and artists');
    dialog.style.cssText = 'width:min(900px,94vw);height:90vh;padding:0;border:0;border-radius:16px;';
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', 'Close music and artists');
    close.style.cssText = 'position:absolute;right:12px;top:8px;font-size:28px;border:0;background:white;cursor:pointer;';
    const frame = document.createElement('iframe');
    frame.title = 'Music and artists';
    frame.style.cssText = 'width:100%;height:100%;border:0;';
    frame.srcdoc = window.DBSingleFile.page('music-preview.html', url.search + url.hash);
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { dialog.remove(); link.focus(); }, { once: true });
    dialog.append(frame, close);
    document.body.append(dialog);
    dialog.showModal();
  });

  function initializeEmbeddedPage(href) {
    window.DBSingleFile = window.parent.DBSingleFile;
    window.DB_BUILD_PAGE_URL = new URL(href);
    // srcdoc preserves parent access and the audio/score bridges. Track each
    // page's query separately, since its real browser URL is about:srcdoc.
    for (const method of ['pushState', 'replaceState']) {
      const original = history[method].bind(history);
      history[method] = (state, title, next) => {
        if (next != null) {
          const url = new URL(next, window.DB_BUILD_PAGE_URL);
          window.DB_BUILD_PAGE_URL = url;
          // Use the actual srcdoc URL: a relative fragment resolves against
          // the host file and is rejected by the iframe's History API.
          original(state, title, window.location.href.split('#')[0] + url.hash);
        } else original(state, title);
      };
    }
    window.addEventListener('popstate', () => {
      window.DB_BUILD_PAGE_URL.hash = window.location.hash;
    });
    if (window.DB_BUILD_PAGE_URL.pathname.endsWith('/music-preview.html')) {
      document.addEventListener('DOMContentLoaded', () => {
        if (window.DB_BUILD_PAGE_URL.hash === '#credits') document.getElementById('credits')?.scrollIntoView();
      }, { once: true });
      document.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        if (!link) return;
        const url = new URL(link.href);
        if (url.pathname.endsWith('/index.html') && url.origin === window.DB_BUILD_PAGE_URL.origin) {
          event.preventDefault();
          window.frameElement.closest('dialog').close();
        }
      });
    }
  }
}
