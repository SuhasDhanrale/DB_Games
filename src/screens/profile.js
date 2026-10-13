import { getLang, t } from '../i18n/index.js';
import { getProgression, todayStr } from '../systems/progression.js';
import { getPlayHistory, readRound } from '../systems/play-history.js';
import { navigate } from '../core/router.js';
import { openModal, closeModal } from '../ui/components.js';
import '../styles/support.css';
import '../styles/torch.css';
import { torchCardMarkup } from '../ui/torch.js';

const GAMES = ['wordal', 'niti', 'cricket', 'carrom', 'jodo'];
const title = id => t('game' + (GAMES.indexOf(id) + 1) + '.title');
const number = value => Number.isFinite(value) ? value : null;
function skill(history, id, reference, hi) {
  if (id === 'wordal') {
    const daily = history.filter(entry => entry.gameId === id && entry.mode === 'daily' && typeof entry.details.solved === 'boolean');
    return daily.length ? (hi ? `${daily.filter(entry => entry.details.solved).length}/${daily.length} शब्द हल किए` : `${daily.filter(entry => entry.details.solved).length}/${daily.length} words solved`) : '';
  }
  const candidates = history.filter(entry => entry.gameId === id).flatMap(entry => [entry.details, entry.bestDetails].filter(Boolean));
  if (id === 'carrom') {
    if (!reference?.details.challengeId || !reference?.details.rulesVersion) return '';
    const shots = candidates.filter(d => d.challengeId === reference.details.challengeId && d.rulesVersion === reference.details.rulesVersion).map(d => d.shots).filter(Number.isFinite);
    return shots.length ? (hi ? `इसी चुनौती में सर्वश्रेष्ठ · ${Math.min(...shots)} शॉट` : `Same challenge best · ${Math.min(...shots)} shots`) : '';
  }
  if (id === 'cricket' && reference?.details.role) {
    const role = reference.details.role;
    const runs = candidates.filter(d => d.role === role && d.matchId === reference.details.matchId).map(d => d.runs).filter(Number.isFinite);
    if (!runs.length) return '';
    const best = role === 'BOWLING' ? Math.min(...runs) : Math.max(...runs);
    return hi ? `इसी मुकाबले में ${role === 'BOWLING' ? 'सबसे कम दिए' : 'सबसे ज़्यादा बनाए'} · ${best} रन` : `Same match · ${role === 'BOWLING' ? 'fewest conceded' : 'most scored'}: ${best} runs`;
  }
  return '';
}
function summary(entry, hi) {
  const d = entry.details || {};
  if (entry.gameId === 'wordal' && number(d.attempts) !== null) return d.solved ? (hi ? `${d.attempts}/6 प्रयासों में हल किया` : `Solved in ${d.attempts}/6 attempts`) : (hi ? 'छह प्रयास पूरे · शब्द का अर्थ देखें' : 'Six attempts used · discover the meaning');
  if (entry.gameId === 'niti') return hi ? 'विचार पूरा · अर्थ और साझा कार्ड देखें' : 'Thought completed · meaning and share card';
  if (entry.gameId === 'jodo' && number(d.wrongMatches) !== null) return hi ? `चार जोड़ियाँ · ${d.wrongMatches} गलत मिलान${d.assistedPairs ? ' · मदद ली' : ''}` : `Four pairs · ${d.wrongMatches} mismatches${d.assistedPairs ? ' · assisted' : ''}`;
  if (entry.gameId === 'cricket' && number(d.runs) !== null) return hi ? `${d.role === 'BOWLING' ? 'गेंदबाजी' : 'बल्लेबाजी'} · ${d.runs}/${d.wickets} · ${d.balls} गेंद` : `${d.role === 'BOWLING' ? 'Bowling' : 'Batting'} · ${d.runs}/${d.wickets} · ${d.balls} balls`;
  if (entry.gameId === 'carrom' && number(d.shots) !== null) return hi ? `${d.puzzles} पहेलियाँ · ${d.shots} शॉट` : `${d.puzzles} puzzles · ${d.shots} shots`;
  return hi ? 'खेल पूरा · परिणाम देखें' : 'Completed · view result';
}
function progressContent(container) {
  const hi = getLang() === 'hi';
  const history = getPlayHistory();
  const prog = getProgression();
  const today = todayStr();
  const weekStart = new Date(today + 'T12:00:00Z');
  weekStart.setUTCDate(weekStart.getUTCDate() - 6);
  const playedDays = Object.keys(prog.dailyHistory).filter(date => date >= weekStart.toISOString().slice(0, 10) && date <= today).length;
  container.classList.add('support-view');
  container.innerHTML = `
    <aside class="torch-card" lang="${getLang()}">${torchCardMarkup()}</aside>
    <p class="support-muted">${hi ? 'अपनी रफ़्तार से खेलें। कोई एक खेल भी काफ़ी है।' : 'Play at your pace. One game is enough.'}</p>
    <div class="support-summary"><div><strong>${playedDays}</strong><span>${hi ? 'पिछले सात दिनों में खेला' : 'Days played in the last seven'}</span></div><div><strong>${prog.streak}</strong><span>${hi ? 'लगातार खेले गए दिन' : 'Consecutive days played'}</span></div></div>
    <h3>${hi ? 'आज के खेल' : "Today's games"}</h3>
    <div class="support-list">${GAMES.map((id, index) => {
      const first = history.find(item => item.gameId === id && item.date === today && item.edition === window.DBJamDemo.day && item.mode === 'daily');
      const practice = history.find(item => item.gameId === id && item.date === today && item.edition === window.DBJamDemo.day && item.mode === 'practice');
      const round = readRound(id);
      const started = round && (round.currentRowTokens?.length || round.boardGuesses?.length || round.selectedOption || round.confirmed || round.matchedPairIds?.length || round.wrongMatches || round.started || round.shots);
      const status = first ? summary(first, hi) : practice ? (hi ? 'अभ्यास · ' : 'Practice · ') + summary(practice, hi) : started ? (hi ? 'जहाँ छोड़ा था, वहीं से खेलें' : 'Continue where you left off') : (hi ? 'जब मन हो, खेलें' : 'Play whenever you like');
      const improvement = skill(history, id, practice || first, hi);
      return `<button type="button" class="support-game" data-game-theme="${id}" data-progress-game="${id}"><span class="support-game__mark" aria-hidden="true">${first ? '✓' : ['अ', '“', '↗', '◎', '⌘'][index]}</span><span class="support-game__copy"><strong>${title(id)}</strong><span>${status}</span>${improvement ? `<span>${improvement}</span>` : ''}</span><span aria-hidden="true">→</span></button>`;
    }).join('')}</div>
    ${history.length ? `<h3>${hi ? 'आपके परिणाम' : 'Your results'}</h3>${history.slice(-15).reverse().map(entry => `<div class="support-history"><strong>${title(entry.gameId)}</strong><p>${summary(entry, hi)}</p><p>${entry.date} · ${hi ? 'डेमो संस्करण' : 'Demo edition'} ${entry.edition.slice(1)} · ${entry.mode === 'practice' ? (hi ? 'अभ्यास' : 'Practice') : (hi ? 'पहला परिणाम' : 'First result')}</p></div>`).join('')}` : `<div class="support-empty">${hi ? 'आपका पहला परिणाम यहीं मिलेगा। आज मनपसंद खेल से शुरुआत करें।' : 'Your first result will appear here. Start with a game you enjoy.'}</div>`}
    <p class="support-muted" style="margin-top:20px">${hi ? 'मशाल का लेवल इस ब्राउज़र में सहेजा जाता है। रिफ़्रेश करने पर इस सत्र के परिणाम मिट जाएँगे और अगला डेमो संस्करण खुलेगा।' : 'Your Mashal level is saved in this browser. Refresh clears this visit’s results and opens the next demo edition.'}</p>`;
  container.querySelectorAll('[data-progress-game]').forEach(button => button.addEventListener('click', () => { closeModal(); navigate('/game/' + button.dataset.progressGame); }));
}
export function openProgress() {
  const content = document.createElement('div');
  progressContent(content);
  openModal({ title: getLang() === 'hi' ? 'मेरे खेल' : 'My play', content });
}
export function renderProfile(container) {
  container.classList.add('support-screen');
  container.innerHTML = `<header class="support-heading"><button class="support-action" type="button" id="progress-home" aria-label="${t('common.back')}">←</button><h1>${getLang() === 'hi' ? 'मेरे खेल' : 'My play'}</h1></header><div class="support-content"></div>`;
  container.querySelector('#progress-home').addEventListener('click', () => navigate('/'));
  progressContent(container.querySelector('.support-content'));
}
export default renderProfile;
