/* Return to the hub from an embedded game or a standalone game page. */
window.DBGameNavigation = {
  goHome() {
    try {
      if (window.parent !== window) {
        window.parent.location.hash = '#/';
        return;
      }
    } catch { /* Use the standalone destination if the parent is inaccessible. */ }
    const hub = new URL('./index.html', window.location.href);
    const day = window.DBJamDemo?.day || new URLSearchParams(window.location.search).get('day');
    if (day) hub.searchParams.set('day', day);
    hub.hash = '/';
    window.location.href = hub.href;
  }
};
