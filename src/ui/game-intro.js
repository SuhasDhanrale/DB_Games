import '../styles/game-intro.css';

// Fallback for pages without the demo session. The host and its game frames
// share DBJamDemo memory, so dismissing the host guide also dismisses the frame's.
const seen = new Set();
let standaloneIntro = null;
const aliases = { neeti: 'niti', superover: 'cricket', carrom_puzzles: 'carrom' };
const canonicalId = id => aliases[id] || id;

const copy = {
  hi: {
    heading: 'कैसे खेलें?', example: 'एक छोटा उदाहरण', play: 'खेले',
    note: 'मदद चाहिए? ऊपर ⓘ / ? वाला बटन दबाएँ।',
    wordal: { title: 'आज का शब्द', caption: 'हर रंग एक हिंट है', labels: ['सही जगह', 'दूसरी जगह', 'शब्द में नहीं'], rules: [
      ['हिंट पढ़ें', 'छोटे हिंट से आज का शब्द पहचानें। आपके पास 6 प्रयास हैं।'],
      ['5 खाने भरें, फिर जाँचें', 'एक बटन एक खाना भरता है। मात्रा साथ आती है, जैसे “का” या “नी”। फिर “✓ जाँचें” दबाएँ।'],
      ['रंग देखकर अगला प्रयास करें', 'हरा: सही जगह। पीला: दूसरी जगह। स्लेटी: शब्द में नहीं।'],
    ] },
    niti: { title: 'आज की नीति', caption: 'पढ़ें → चुनें → समझें', labels: ['अधूरा विचार', 'अपना उत्तर चुनें', 'पूरा विचार पढ़ें'], rules: [
      ['विचार पढ़ें', 'आज के विचार में एक हिस्सा खाली है। उसे ध्यान से पढ़ें।'],
      ['सही जवाब चुनें', 'चार विकल्पों में से विचार पूरा करने वाला जवाब चुनें और जाँचें।'],
      ['सीख साथ ले जाएँ', 'पूरा विचार और उसका अर्थ पढ़ें। चाहें तो उसका कार्ड साझा करें।'],
    ] },
    cricket: { title: 'आज का ओवर', caption: 'बल्लेबाज़ी में सरकाएँ · गेंदबाज़ी में जगह चुनें', labels: ['शॉट की दिशा', 'गेंद की जगह'], rules: [
      ['अपनी भूमिका चुनें', 'बल्लेबाज़ बनकर लक्ष्य हासिल करें या गेंदबाज़ बनकर लक्ष्य बचाएँ।'],
      ['उंगली से खेलें', 'बल्लेबाज़ी: गेंद हरे निशान पर आए तो शॉट की दिशा में उंगली सरकाएँ। गेंदबाज़ी: पिच पर जगह चुनें और उंगली छोड़ें।'],
      ['6 गेंदें, 2 विकेट', 'एक ओवर में खेल पूरा करें। दो विकेट गिरने पर पारी खत्म हो जाती है।'],
    ] },
    carrom: { title: 'आज का निशाना', caption: 'पीछे खींचें → निशाना साधें → छोड़ें', labels: ['स्ट्राइकर', 'लक्ष्य'], rules: [
      ['आज का लक्ष्य देखें', 'ऊपर लिखा लक्ष्य पढ़ें। लक्ष्य पूरा होने तक शॉट लें; कुल शॉट गिने जाएँगे।'],
      ['स्ट्राइकर लगाएँ', 'स्ट्राइकर को नीचे की रेखा पर बाएँ या दाएँ खिसकाएँ।'],
      ['खींचें और छोड़ें', 'स्ट्राइकर से पीछे खींचकर निशाना साधें, फिर छोड़ें। चूकें तो उसी बोर्ड पर अगला शॉट लें।'],
    ] },
    jodo: { title: 'आज की जोड़ी', caption: 'दो संबंधित कार्ड → एक जोड़ी', labels: ['आम', 'फल', 'दूध', 'पेय'], rules: [
      ['संबंध खोजें', 'दोनों सूचियों के कार्ड पढ़ें। कौन से दो तथ्य आपस में जुड़े हैं?'],
      ['दो कार्ड जोड़ें', 'पहली सूची के कार्ड पर टैप करें, फिर उसके साथी पर। या एक से दूसरे तक रेखा खींचें।'],
      ['चार जोड़ियाँ बनाएँ', 'सभी 4 जोड़ियाँ मिलाएँ, फिर उनका संबंध और आज की खबर पढ़ें।'],
    ] },
  },
  en: {
    heading: 'How to play', example: 'A quick example', play: 'Got it, let’s play',
    note: 'Need a reminder? Use the ⓘ / ? button at the top.',
    wordal: { title: 'Today’s Word', caption: 'Each colour gives you a hint', labels: ['Right place', 'Other place', 'Not in word'], rules: [
      ['Read the hint', 'Use the short hint to guess today’s Hindi word. You have 6 tries.'],
      ['Fill 5 boxes, then check', 'Each button fills one box. Vowel marks come with the letter, as in “का” or “नी”. Then press “✓ जाँचें” (Check).'],
      ['Use the colour hints', 'Green: right place. Yellow: another place. Grey: not in the word.'],
    ] },
    niti: { title: 'Today’s Wisdom', caption: 'Read → choose → understand', labels: ['An unfinished thought', 'Choose your answer', 'Read the full thought'], rules: [
      ['Read the thought', 'One part of today’s thought is missing. Read it carefully.'],
      ['Choose an answer', 'Pick the option that completes the thought, then check your answer.'],
      ['Take away a lesson', 'Read the full thought and its meaning. Share its card if you like.'],
    ] },
    cricket: { title: 'Aaj Ka Over', caption: 'Batting: swipe · Bowling: pick a spot', labels: ['Shot direction', 'Ball placement'], rules: [
      ['Choose your role', 'Bat to reach the target or bowl to defend it.'],
      ['Play with your finger', 'Batting: swipe in the shot’s direction as the ball reaches the green mark. Bowling: choose a spot on the pitch and release.'],
      ['6 balls, 2 wickets', 'Play one over. The innings ends when two wickets fall.'],
    ] },
    carrom: { title: 'Aaj Ka Nishana', caption: 'Pull back → aim → release', labels: ['Striker', 'Target'], rules: [
      ['Read today’s target', 'Check the goal above the board. Keep shooting until you complete it; every shot counts.'],
      ['Place the striker', 'Slide the striker left or right along the bottom line.'],
      ['Pull and release', 'Pull back from the striker to aim, then release. After a miss, take another shot on the same board.'],
    ] },
    jodo: { title: 'Aaj Ki Jodi', caption: 'Two related cards → one pair', labels: ['Mango', 'Fruit', 'Milk', 'Drink'], rules: [
      ['Find the connection', 'Read the cards in both lists. Which two facts belong together?'],
      ['Connect two cards', 'Tap a card in the first list, then its partner. Or drag a line between them.'],
      ['Make four pairs', 'Match all 4 pairs, then read their connections and today’s news.'],
    ] },
  },
};

function illustration(id, labels) {
  const svg = body => `<svg viewBox="0 0 320 150" fill="none" aria-hidden="true">${body}</svg>`;
  if (id === 'wordal') return `<div class="gi-tiles">${['क', 'म', 'ल'].map((letter, i) => `<div><span class="gi-tile gi-tile--${i}">${letter}</span><small>${labels[i]}</small></div>`).join('')}</div>`;
  if (id === 'niti') return `<div class="gi-thought"><div class="gi-paper">${labels[0]} <span>____</span></div><div class="gi-options"><span>①</span><span class="gi-choice">② <b>✓</b></span><span>③</span><span>④</span></div><small>${labels[1]}</small></div>`;
  if (id === 'jodo') return `<div class="gi-pairs">${svg('<path class="gi-connection" d="M100 43 C165 43 155 43 220 43" stroke="#597762" stroke-width="4" stroke-dasharray="120"/><path d="M100 108H220" stroke="#bcc8bc" stroke-width="3" stroke-dasharray="4 6"/>')}<div class="gi-pair gi-pair--a">${labels[0]}</div><div class="gi-pair gi-pair--b">${labels[1]} <span class="gi-check">✓</span></div><div class="gi-pair gi-pair--c">${labels[2]}</div><div class="gi-pair gi-pair--d">${labels[3]}</div></div>`;
  if (id === 'carrom') return svg('<rect x="94" y="7" width="132" height="132" rx="9" fill="#ead9b5" stroke="#9b7958" stroke-width="8"/><g fill="#3d352f"><circle cx="108" cy="21" r="8"/><circle cx="212" cy="21" r="8"/><circle cx="108" cy="125" r="8"/><circle cx="212" cy="125" r="8"/></g><path d="M118 112H202" stroke="#aa5d49" stroke-width="2"/><path d="M151 113L211 21" stroke="#597762" stroke-width="2" stroke-dasharray="4 5"/><circle class="gi-coin" cx="180" cy="68" r="8" fill="#3d352f"/><circle class="gi-striker" cx="151" cy="113" r="11" fill="#fffaf0" stroke="#9b7958" stroke-width="2"/><path class="gi-pull" d="M151 113L136 138" stroke="#9b7958" stroke-width="3" stroke-linecap="round"/>');
  return svg('<rect x="18" y="8" width="132" height="126" rx="14" fill="#e1ebdf"/><rect x="170" y="8" width="132" height="126" rx="14" fill="#e1ebdf"/><rect x="210" y="23" width="52" height="95" rx="5" fill="#d8c59f"/><path d="M213 41H259M213 101H259" stroke="#fffaf0" stroke-width="3"/><path d="M78 117L118 78" stroke="#597762" stroke-width="3" stroke-linecap="round"/><path d="m107 78 11 0 0 11" stroke="#597762" stroke-width="3"/><rect x="53" y="84" width="12" height="39" rx="3" fill="#b18e55" transform="rotate(-25 59 103)"/><rect x="51" y="118" width="6" height="14" rx="2" fill="#526f5c" transform="rotate(-25 54 125)"/><circle cx="80" cy="85" r="12" stroke="#597762" stroke-width="3"/><circle class="gi-ball" cx="80" cy="34" r="6" fill="#b74e3f"/><circle cx="238" cy="63" r="13" stroke="#597762" stroke-width="2" stroke-dasharray="3 3"/><circle class="gi-placement" cx="238" cy="63" r="6" fill="#b74e3f"/>') + `<div class="gi-cricket-labels"><span>${labels[0]}</span><span>${labels[1]}</span></div>`;
}

export function hasSeenIntro(id) {
  const key = canonicalId(id);
  return window.DBJamDemo
    ? window.DBJamDemo.getItem(`game-intro:${key}`) === 'seen'
    : seen.has(key);
}

// A review link can show the first-visit experience without clearing browser data.
export function needsIntro(id) {
  return new URLSearchParams(window.location.search).get('intro') === '1' || !hasSeenIntro(id);
}

function markSeen(id) {
  const key = canonicalId(id);
  if (window.DBJamDemo) window.DBJamDemo.setItem(`game-intro:${key}`, 'seen');
  else seen.add(key);
}

export function renderGameIntro(container, id, { onPlay, lang = 'hi', replay = false } = {}) {
  id = canonicalId(id);
  const text = copy[lang] || copy.hi;
  const game = text[id];
  if (!game) { onPlay?.(); return () => {}; }
  container.innerHTML = `<section class="game-intro" aria-labelledby="gi-title" lang="${lang === 'en' ? 'en' : 'hi'}">
    <header class="gi-heading"><p>${game.title}</p><h2 id="gi-title">${text.heading}</h2></header>
    <figure class="gi-demo gi-demo--${id}"><span class="gi-example">${text.example}</span>${illustration(id, game.labels)}<figcaption>${game.caption}</figcaption></figure>
    <ol class="gi-rules">${game.rules.map(([title, body], i) => `<li><span class="gi-number" aria-hidden="true">${i + 1}</span><div><h3>${title}</h3><p>${body}</p></div></li>`).join('')}</ol>
    <footer class="gi-footer"><button type="button" class="gi-play">${text.play}</button><p>${text.note}</p></footer>
  </section>`;
  const button = container.querySelector('.gi-play');
  const play = () => { if (!replay) markSeen(id); onPlay?.(); };
  button.addEventListener('click', play, { once: true });
  button.focus({ preventScroll: true });
  return () => button.removeEventListener('click', play);
}

// Direct HTML links use the same introduction as games opened from the hub.
export function showStandaloneIntro(id, { force = false } = {}) {
  if (standaloneIntro) return standaloneIntro;
  if (!force && !needsIntro(id)) return Promise.resolve();
  const previousFocus = document.activeElement;
  standaloneIntro = new Promise(resolve => {
    const open = () => {
      const dialog = document.createElement('dialog');
      dialog.className = 'gi-dialog';
      dialog.setAttribute('aria-labelledby', 'gi-title');
      document.body.appendChild(dialog);
      let cleanup;
      const finish = () => {
        cleanup?.();
        dialog.close();
        dialog.remove();
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        resolve();
      };
      // Keep game keyboard handlers from acting on dialog keystrokes.
      dialog.addEventListener('keydown', event => event.stopPropagation());
      dialog.addEventListener('cancel', event => event.preventDefault());
      dialog.showModal();
      cleanup = renderGameIntro(dialog, id, { onPlay: finish, lang: document.documentElement.lang === 'en' ? 'en' : 'hi', replay: force });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open, { once: true });
    else open();
  }).finally(() => { standaloneIntro = null; });
  return standaloneIntro;
}

export async function prepareStandaloneIntro(id) {
  // Existing help handlers retain game-specific pause/resume behaviour.
  if (typeof window.openHelpModal !== 'function') {
    window.openHelpModal = () => showStandaloneIntro(id, { force: true });
    window.addEventListener('message', event => {
      if (event.source === window.parent && event.data?.type === 'OPEN_RULES') window.openHelpModal();
    });
  }
  if (window.parent === window) {
    const help = document.createElement('button');
    help.type = 'button';
    help.className = 'gi-help';
    help.textContent = 'ⓘ नियम';
    help.addEventListener('click', () => window.openHelpModal());
    document.body.appendChild(help);
  }
  await showStandaloneIntro(id);
}
