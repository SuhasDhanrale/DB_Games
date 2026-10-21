import '../styles/interaction-guide.css';

// Two reusable gestures: a tap, or a press -> move -> release.
// Points are fractions of the surface, so canvas and DOM guides scale together.
export function createInteractionGuide({ game, getSteps, isActive = () => true, labels = true, remember = true, compact = false, allowDialog = false, mount = document.body }) {
  const layer = document.createElement('div');
  layer.className = 'interaction-guide' + (compact ? ' interaction-guide--example' : '');
  layer.setAttribute('aria-hidden', 'true');
  layer.hidden = true;
  mount.appendChild(layer);
  const completed = new Set();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const startedAt = performance.now();
  let signature = '';
  let destroyed = false;
  const storageKey = id => `interaction-guide:${game}:${id}`;
  const hasUsed = id => completed.has(id) || (remember && window.DBJamDemo?.getItem(storageKey(id)) === 'seen');
  const visible = element => element?.isConnected && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';

  function update() {
    if (destroyed) return;
    const blocked = document.hidden || (!allowDialog && document.querySelector('.gi-dialog[open]'));
    const steps = !blocked && isActive() ? getSteps().filter(step => !hasUsed(step.id) && visible(step.surface)) : [];
    if (!steps.length) {
      layer.hidden = true;
      signature = '';
      return;
    }
    const step = steps[motion.matches ? 0 : Math.floor((performance.now() - startedAt) / 2600) % steps.length];
    const rect = step.surface.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.bottom <= 0 || rect.top >= innerHeight) {
      layer.hidden = true;
      signature = '';
      return;
    }
    const from = step.from || { x: .5, y: .5 };
    const to = step.to || from;
    const x1 = from.x * rect.width, y1 = from.y * rect.height;
    const x2 = to.x * rect.width, y2 = to.y * rect.height;
    const next = JSON.stringify([step.id, step.label, rect.x, rect.y, rect.width, rect.height, from, to]);
    if (signature === next) return;
    signature = next;
    layer.hidden = false;
    layer.dataset.gesture = step.to ? 'move' : 'tap';
    layer.dataset.step = step.id;
    Object.assign(layer.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    layer.style.setProperty('--cue-from-x', `${x1}px`);
    layer.style.setProperty('--cue-from-y', `${y1}px`);
    layer.style.setProperty('--cue-to-x', `${x2}px`);
    layer.style.setProperty('--cue-to-y', `${y2}px`);
    layer.replaceChildren();
    if (step.to) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
      svg.classList.add('interaction-guide__trail');
      const line = document.createElementNS(svg.namespaceURI, 'path');
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arm = 9;
      line.setAttribute('d', `M${x1} ${y1}L${x2} ${y2}M${x2 - arm * Math.cos(angle - .55)} ${y2 - arm * Math.sin(angle - .55)}L${x2} ${y2}L${x2 - arm * Math.cos(angle + .55)} ${y2 - arm * Math.sin(angle + .55)}`);
      svg.appendChild(line);
      layer.appendChild(svg);
    }
    const touch = document.createElement('span');
    touch.className = 'interaction-guide__touch';
    touch.innerHTML = '<span class="interaction-guide__ring"></span><span class="interaction-guide__finger">👇</span>';
    layer.appendChild(touch);
    if (labels && step.label) {
      const label = document.createElement('span');
      label.className = 'interaction-guide__label';
      label.textContent = step.label;
      label.style.top = `${(step.labelY ?? .12) * rect.height}px`;
      layer.appendChild(label);
    }
  }

  const observer = new MutationObserver(records => {
    if (records.some(record => !layer.contains(record.target))) update();
  });
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden', 'disabled', 'aria-checked', 'data-state'] });
  const timer = setInterval(update, 200);
  window.addEventListener('scroll', update, true);
  window.addEventListener('resize', update);
  document.addEventListener('visibilitychange', update);
  function destroy() {
    destroyed = true;
    clearInterval(timer);
    observer.disconnect();
    window.removeEventListener('scroll', update, true);
    window.removeEventListener('resize', update);
    window.removeEventListener('pagehide', destroy);
    document.removeEventListener('visibilitychange', update);
    layer.remove();
  }
  window.addEventListener('pagehide', destroy);
  update();
  return {
    used(id) {
      completed.add(id);
      if (remember) window.DBJamDemo?.setItem(storageKey(id), 'seen');
      update();
    },
    update,
    destroy,
  };
}

// A point on a child control, relative to its guide surface.
export function interactionPoint(surface, control, x = .5, y = .5) {
  const area = surface.getBoundingClientRect();
  const target = control.getBoundingClientRect();
  return { x: (target.left + target.width * x - area.left) / area.width, y: (target.top + target.height * y - area.top) / area.height };
}
