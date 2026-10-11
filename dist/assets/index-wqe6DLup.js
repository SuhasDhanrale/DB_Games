/* empty css                   */(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),(()=>{if(window.DBJamDemo)return;try{if(window.parent!==window&&window.parent.DBJamDemo){window.DBJamDemo=window.parent.DBJamDemo;return}}catch{}let e=0,t=new URL(window.location.href),n=t.searchParams.get(`day`),r=performance.getEntriesByType(`navigation`)[0]?.type===`reload`;/^d[123]$/.test(n||``)&&(e=(Number(n[1])-1+ +!!r)%3);let i=`d${e+1}`;t.searchParams.set(`day`,i);try{history.replaceState(history.state,``,t)}catch{}let a=new Date;a.setHours(12,0,0,0),a.setDate(a.getDate()+e);let o=new Map;window.DBJamDemo={day:i,index:e,date:a.toISOString(),priorStreak:12+e,getItem:e=>o.get(e)??null,setItem:(e,t)=>o.set(e,String(t)),removeItem:e=>o.delete(e)}})();var e={en:{"common.play":`Play`,"common.back":`Back`,"common.close":`Close`,"common.save":`Save`,"common.cancel":`Cancel`,"common.ok":`OK`,"common.loading":`Loading…`,"common.retry":`Retry`,"common.share":`Share`,"common.score":`Score`,"common.best":`Best`,"common.rank":`Rank`,"common.today":`Today`,"common.daily":`Daily`,"common.new":`New`,"common.coming_soon":`Coming Soon`,"common.rules":`Rules`,"hub.title":`Game Lab`,"hub.greeting":`Pick a mood for today 👋`,"hub.daily_challenge":`Daily Challenge`,"hub.all_games":`All Games`,"hub.your_stats":`Your Stats`,"hub.view_all":`View All`,"hub.game_label":`GAME {num}`,"hub.done":`Done`,"hub.left":`Left to play`,"day.mon":`MON`,"day.tue":`TUE`,"day.wed":`WED`,"day.thu":`THU`,"day.fri":`FRI`,"day.sat":`SAT`,"day.sun":`SUN`,"mood.curiosity":`Curiosity`,"mood.excitement":`Excitement`,"mood.discovery":`Discovery`,"mood.thinking":`Strategy`,"mood.nostalgia":`Nostalgia`,"mood.wisdom":`Wisdom`,"mood.focus":`Focus`,"tag.word_puzzle":`WORD PUZZLE`,"tag.daily_thought":`DAILY THOUGHT`,"tag.cricket":`CRICKET`,"tag.carrom":`CARROM`,"tag.matching":`MATCH & CONNECT`,"tag.action_flick":`ACTION FLICK`,"tag.visual_quiz":`VISUAL QUIZ`,"tag.strategy":`STRATEGY`,"tag.seven_stones":`7 STONES`,"nav.home":`Home`,"nav.leaderboard":`Rankings`,"nav.profile":`Profile`,"nav.settings":`Settings`,"lb.title":`Leaderboard`,"lb.daily":`Daily`,"lb.weekly":`Weekly`,"lb.alltime":`All Time`,"lb.your_rank":`Your Rank`,"lb.no_scores":`No scores yet. Play a game!`,"lb.points":`pts`,"profile.title":`Profile`,"profile.level":`Level`,"profile.xp":`XP`,"profile.streak":`Streak`,"profile.games_played":`Games Played`,"profile.total_score":`Total Score`,"profile.achievements":`Achievements`,"profile.days":`days`,"profile.no_achievements":`Play games to earn achievements!`,"settings.title":`Settings`,"settings.language":`Language`,"settings.sound":`Sound Effects`,"settings.music":`Music`,"settings.haptics":`Haptics`,"settings.reset":`Reset Progress`,"settings.reset_confirm":`This will erase all your progress. Are you sure?`,"settings.about":`About`,"settings.version":`Version`,"prog.streak_fire":`🔥 {count} day streak!`,"prog.streak_lost":`Streak lost! Start fresh today.`,"prog.level_up":`🎉 Level Up! You're now level {level}!`,"prog.xp_gained":`+{amount} XP`,"prog.daily_done":`✅ Daily challenge completed!`,"prog.next_daily":`Next daily in {time}`,"game1.title":`Aaj Ka Shabd`,"game1.desc":`Guess the secret daily word`,"game2.title":`Aaj Ki Niti`,"game2.desc":`Daily thoughtful reflection and contemplation`,"game3.title":`Super Over`,"game3.desc":`Super Over · 6 balls of high-octane drama`,"game4.title":`Carrom`,"game4.desc":`Precision trick shots & pocket puzzles`,"game5.title":`Jodo`,"game5.desc":`Connect matching items and knowledge nodes`,"game6.title":`Super Over`,"game6.desc":`Super Over · 6 balls of high-octane drama`,"gameover.title":`Game Over!`,"gameover.great":`Great job! 🎉`,"gameover.score":`Your Score`,"gameover.best_score":`Best Score`,"gameover.new_best":`🏆 New Best!`,"gameover.play_again":`Play Again`,"gameover.home":`Home`,"gameover.share_text":`I scored {score} in {game} on Dainik Bhaskar Game Lab! 🎮`},hi:{"common.play":`खेलें`,"common.back":`वापस`,"common.close":`बंद करें`,"common.save":`सहेजें`,"common.cancel":`रद्द करें`,"common.ok":`ठीक है`,"common.loading":`लोड हो रहा है…`,"common.retry":`पुनः प्रयास`,"common.share":`शेयर करें`,"common.score":`स्कोर`,"common.best":`सर्वश्रेष्ठ`,"common.rank":`रैंक`,"common.today":`आज`,"common.daily":`दैनिक`,"common.new":`नया`,"common.coming_soon":`जल्द आ रहा है`,"common.rules":`नियम`,"hub.title":`गेम लैब`,"hub.greeting":`आज के लिए एक मूड चुनें 👋`,"hub.daily_challenge":`दैनिक चुनौती`,"hub.all_games":`सभी गेम्स`,"hub.your_stats":`आपके आँकड़े`,"hub.view_all":`सभी देखें`,"hub.game_label":`गेम {num}`,"hub.done":`पूर्ण`,"hub.left":`बाकी है`,"day.mon":`सोम`,"day.tue":`मंगल`,"day.wed":`बुध`,"day.thu":`गुरु`,"day.fri":`शुक्र`,"day.sat":`शनि`,"day.sun":`रवि`,"mood.curiosity":`जिज्ञासा`,"mood.excitement":`रोमांच`,"mood.discovery":`खोज`,"mood.thinking":`रणनीति`,"mood.nostalgia":`यादें`,"mood.wisdom":`चिंतन`,"mood.focus":`एकाग्रता`,"tag.word_puzzle":`शब्द पहेली`,"tag.daily_thought":`दैनिक विचार`,"tag.cricket":`क्रिकेट`,"tag.carrom":`कैरम पहेली`,"tag.matching":`जोड़ो`,"tag.action_flick":`एक्शन मुकाबला`,"tag.visual_quiz":`दृष्टि परख`,"tag.strategy":`रणनीति`,"tag.seven_stones":`सात पत्थर`,"nav.home":`होम`,"nav.leaderboard":`रैंकिंग`,"nav.profile":`प्रोफ़ाइल`,"nav.settings":`सेटिंग्स`,"lb.title":`लीडरबोर्ड`,"lb.daily":`दैनिक`,"lb.weekly":`साप्ताहिक`,"lb.alltime":`सभी समय`,"lb.your_rank":`आपकी रैंक`,"lb.no_scores":`अभी तक कोई स्कोर नहीं। खेलें!`,"lb.points":`अंक`,"profile.title":`प्रोफ़ाइल`,"profile.level":`लेवल`,"profile.xp":`एक्सपी`,"profile.streak":`स्ट्रीक`,"profile.games_played":`खेले गए गेम`,"profile.total_score":`कुल स्कोर`,"profile.achievements":`उपलब्धियाँ`,"profile.days":`दिन`,"profile.no_achievements":`उपलब्धियाँ अर्जित करने के लिए खेलें!`,"settings.title":`सेटिंग्स`,"settings.language":`भाषा`,"settings.sound":`ध्वनि प्रभाव`,"settings.music":`संगीत`,"settings.haptics":`हैप्टिक्स`,"settings.reset":`प्रगति रीसेट करें`,"settings.reset_confirm":`यह आपकी सारी प्रगति मिटा देगा। क्या आप सुनिश्चित हैं?`,"settings.about":`जानकारी`,"settings.version":`संस्करण`,"prog.streak_fire":`🔥 {count} दिन की स्ट्रीक!`,"prog.streak_lost":`स्ट्रीक टूट गई! आज से नई शुरुआत करें।`,"prog.level_up":`🎉 लेवल अप! अब आप लेवल {level} पर हैं!`,"prog.xp_gained":`+{amount} एक्सपी`,"prog.daily_done":`✅ दैनिक चुनौती पूरी!`,"prog.next_daily":`अगली दैनिक चुनौती {time} में`,"game1.title":`आज का शब्द`,"game1.desc":`दैनिक गुप्त शब्द का अनुमान लगाएँ`,"game2.title":`आज की नीति`,"game2.desc":`शांत दैनिक विचार पूर्ति और जीवन दर्शन`,"game3.title":`सुपर ओवर`,"game3.desc":`6 गेंदों का रोमांचक क्रिकेट मुकाबला`,"game4.title":`कैरम`,"game4.desc":`सटीक स्ट्राइक से सिक्के पॉकेट करें`,"game5.title":`जोड़ो`,"game5.desc":`तथ्यों और ज्ञान को आपस में जोड़ें`,"game6.title":`सुपर ओवर`,"game6.desc":`6 गेंदों का रोमांचक क्रिकेट मुकाबला`,"gameover.title":`गेम ओवर!`,"gameover.great":`बहुत बढ़िया! 🎉`,"gameover.score":`आपका स्कोर`,"gameover.best_score":`सर्वश्रेष्ठ स्कोर`,"gameover.new_best":`🏆 नया रिकॉर्ड!`,"gameover.play_again":`फिर से खेलें`,"gameover.home":`होम`,"gameover.share_text":`मैंने दैनिक भास्कर गेम लैब पर {game} में {score} स्कोर किए! 🎮`}},t=new class{constructor(){this._listeners=new Map}on(e,t){return this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),()=>this.off(e,t)}once(e,t){let n=(...r)=>{this.off(e,n),t(...r)};return this.on(e,n)}off(e,t){let n=this._listeners.get(e);n&&(n.delete(t),n.size===0&&this._listeners.delete(e))}emit(e,t){let n=this._listeners.get(e);if(n)for(let r of n)try{r(t)}catch(t){console.error(`[EventBus] Error in listener for "${e}":`,t)}}clear(){this._listeners.clear()}},n={LANG_CHANGED:`lang:changed`,NAVIGATE:`nav:navigate`,SCREEN_ENTERED:`nav:screen:entered`,SCREEN_EXITED:`nav:screen:exited`,GAME_LOADED:`game:loaded`,GAME_STARTED:`game:started`,GAME_PAUSED:`game:paused`,GAME_RESUMED:`game:resumed`,GAME_ENDED:`game:ended`,GAME_SCORE_UPDATE:`game:score:update`,STREAK_UPDATED:`progression:streak`,XP_GAINED:`progression:xp`,LEVEL_UP:`progression:levelup`,DAILY_COMPLETED:`progression:daily:complete`,LB_SCORE_SUBMITTED:`leaderboard:submitted`,LB_REFRESHED:`leaderboard:refreshed`,ACHIEVEMENT_UNLOCK:`engagement:achievement`,SHARE_RESULT:`engagement:share`,TOAST_SHOW:`ui:toast:show`,MODAL_OPEN:`ui:modal:open`,MODAL_CLOSE:`ui:modal:close`},r=new Map,i=e=>JSON.parse(JSON.stringify(e));function a(e,t=null){return r.has(e)?i(r.get(e)):t}function o(e,t){r.set(e,i(t))}function s(e){r.delete(e)}function c(e){return r.has(e)}function l(){return[...r.keys()]}function u(){r.clear()}function d(e,t){return c(e)||o(e,t),a(e)}function f(e,t){let n={...a(e,{}),...t};return o(e,n),n}var p={get:a,set:o,remove:s,has:c,keys:l,clearAll:u,getOrInit:d,merge:f},m=`lang`,h=[`en`,`hi`],g=`hi`,_=g;function ee(){let e=p.get(m);e&&h.includes(e)&&(_=e),document.documentElement.lang=_}function v(){return _}function te(e){if(!h.includes(e)){console.warn(`[i18n] Unsupported language: ${e}`);return}e!==_&&(_=e,p.set(m,e),document.documentElement.lang=e,t.emit(n.LANG_CHANGED,{lang:e}))}function ne(){te(_===`en`?`hi`:`en`)}function y(t,n={}){let r=(e[_]||e[g])[t];if(r===void 0&&(r=e.en[t],r===void 0))return console.warn(`[i18n] Missing key: "${t}"`),t;if(n&&typeof n==`object`)for(let[e,t]of Object.entries(n))r=r.replace(RegExp(`\\{${e}\\}`,`g`),String(t));return r}function re(e=document){let t=e.querySelectorAll(`[data-i18n]`);for(let e of t){let t=e.getAttribute(`data-i18n`);t&&(e.textContent=y(t))}let n=e.querySelectorAll(`[data-i18n-placeholder]`);for(let e of n){let t=e.getAttribute(`data-i18n-placeholder`);t&&(e.placeholder=y(t))}let r=e.querySelectorAll(`[data-i18n-aria]`);for(let e of r){let t=e.getAttribute(`data-i18n-aria`);t&&e.setAttribute(`aria-label`,y(t))}}var ie=`audio:sfx`,ae=`audio:music`,b=null,x=!0,S=!0,oe={tap:{freq:600,duration:.06,type:`sine`,gain:.15},success:{freq:880,duration:.15,type:`sine`,gain:.2,sweep:1200},error:{freq:200,duration:.2,type:`sawtooth`,gain:.1},levelup:{freq:523,duration:.3,type:`sine`,gain:.2,sweep:1046},score:{freq:700,duration:.08,type:`sine`,gain:.12},streak:{freq:440,duration:.25,type:`sine`,gain:.18,sweep:880},gameover:{freq:400,duration:.4,type:`triangle`,gain:.15,sweep:150},click:{freq:1e3,duration:.04,type:`square`,gain:.08}};function se(){x=p.get(ie,!0),S=p.get(ae,!0)}function ce(){return b||=new(window.AudioContext||window.webkitAudioContext),b.state===`suspended`&&b.resume(),b}function C(e){if(!x)return;let t=oe[e];if(t)try{let e=ce(),n=e.createOscillator(),r=e.createGain();n.type=t.type,n.frequency.setValueAtTime(t.freq,e.currentTime),t.sweep&&n.frequency.linearRampToValueAtTime(t.sweep,e.currentTime+t.duration),r.gain.setValueAtTime(t.gain,e.currentTime),r.gain.exponentialRampToValueAtTime(.001,e.currentTime+t.duration),n.connect(r),r.connect(e.destination),n.start(e.currentTime),n.stop(e.currentTime+t.duration+.05)}catch{}}function le(){return x}function ue(){return S}function de(e){x=e,p.set(ie,e)}function fe(e){S=e,p.set(ae,e)}var w=`leaderboard`;function pe(e){let t=[`Aarav`,`Priya`,`Rohan`,`Sneha`,`Vikram`,`Ananya`,`Arjun`,`Kavya`,`Rajesh`,`Meera`,`Siddharth`,`Pooja`,`Aditya`,`Nisha`,`Kiran`,`Rahul`,`Deepika`,`Amit`,`Sunita`,`Varun`];return t.map((n,r)=>({id:`dummy-${r}`,name:n,score:Math.floor(Math.random()*800+200)*(t.length-r),gameId:e,date:new Date().toISOString(),period:`daily`})).sort((e,t)=>t.score-e.score)}function T(e,t=`daily`,n=20){let r=p.get(w,{}),i=`${e}:${t}`,a=r[i];return(!a||a.length===0)&&(a=pe(e),r[i]=a,p.set(w,r)),a.slice(0,n)}function me(e,r,i){let a=p.get(w,{}),o=[`daily`,`weekly`,`alltime`],s=1/0,c=!1;for(let t of o){let n=`${e}:${t}`;a[n]||(a[n]=pe(e));let o=a[n].find(e=>e.id===`player`);(!o||i>o.score)&&(c=!0),a[n]=a[n].filter(e=>e.id!==`player`),a[n].push({id:`player`,name:r,score:i,gameId:e,date:new Date().toISOString(),period:t}),a[n].sort((e,t)=>t.score-e.score);let l=a[n].findIndex(e=>e.id===`player`)+1;s=Math.min(s,l)}return p.set(w,a),t.emit(n.LB_SCORE_SUBMITTED,{gameId:e,playerName:r,score:i,rank:s,isNewBest:c}),{rank:s,isNewBest:c}}function he(e,t=`daily`){let n=T(e,t,100).findIndex(e=>e.id===`player`);return n>=0?n+1:null}function ge(e){let t=T(e,`alltime`,100).find(e=>e.id===`player`);return t?t.score:0}function _e(){let e=p.get(w,{});for(let t of Object.keys(e))t.endsWith(`:daily`)&&delete e[t];p.set(w,e)}function ve(){let e=p.get(`lb:last_daily_reset`,``),t=new Date().toISOString().split(`T`)[0];e!==t&&(_e(),p.set(`lb:last_daily_reset`,t))}var E=`progression`,D=[0,100,300,600,1e3,1500,2200,3e3,4e3,5200,6600,8200,1e4,12e3,14500,17500,21e3,25e3,3e4,36e3],O={GAME_PLAYED:10,GAME_COMPLETED:25,DAILY_COMPLETED:50,HIGH_SCORE:40,STREAK_BONUS_BASE:15};function ye(){let e=window.DBJamDemo.priorStreak,t=new Date(window.DBJamDemo.date);t.setDate(t.getDate()-1);let n={};for(let r=0;r<e;r++){let e=new Date(t);e.setDate(e.getDate()-r),n[e.toISOString().split(`T`)[0]]=!0}return{xp:0,level:1,streak:e,longestStreak:e,lastPlayDate:t.toISOString().split(`T`)[0],gamesPlayed:0,totalScore:0,dailyCompleted:{},dailyHistory:n}}function k(){let e=p.getOrInit(E,ye());if(e.dailyHistory||={},e.dailyCompleted||={},e.lastPlayDate&&e.streak>0&&Object.keys(e.dailyHistory).length===0){let t=new Date(e.lastPlayDate);for(let n=0;n<Math.min(e.streak,7);n++){let r=new Date(t);r.setDate(t.getDate()-n),e.dailyHistory[r.toISOString().split(`T`)[0]]=!0}}return e}function A(e){p.set(E,e)}function j(){return window.DBJamDemo.date.split(`T`)[0]}function be(){let e=new Date(window.DBJamDemo.date);return e.setDate(e.getDate()-1),e.toISOString().split(`T`)[0]}function xe(){let e=k(),r=j();return e.lastPlayDate===r?(e.dailyHistory||={},e.dailyHistory[r]=!0,A(e),e.streak):(e.lastPlayDate===be()?e.streak+=1:(e.lastPlayDate&&e.lastPlayDate!==r&&t.emit(n.STREAK_UPDATED,{streak:0,lost:!0}),e.streak=1),e.lastPlayDate=r,e.longestStreak=Math.max(e.longestStreak,e.streak),e.dailyHistory||={},e.dailyHistory[r]=!0,A(e),t.emit(n.STREAK_UPDATED,{streak:e.streak,lost:!1}),e.streak)}function M(e,r=``){let i=k();i.xp+=e;let a=i.level;for(let e=D.length-1;e>=0;e--)if(i.xp>=D[e]){i.level=e+1;break}return A(i),t.emit(n.XP_GAINED,{amount:e,total:i.xp,reason:r}),i.level>a&&t.emit(n.LEVEL_UP,{level:i.level,prevLevel:a}),{xp:i.xp,level:i.level,leveledUp:i.level>a}}function Se(e){let r=k(),i=j();r.dailyHistory||={},r.dailyHistory[i]=!0,r.dailyCompleted||={},r.dailyCompleted[e]=!0,r.lastPlayDate=i,A(r),t.emit(n.DAILY_COMPLETED,{gameId:e})}function Ce(e,r,i=!0){let a=k(),o=j();a.gamesPlayed+=1,a.totalScore+=r,a.lastPlayDate=o,a.dailyHistory||={},a.dailyHistory[o]=!0,a.dailyCompleted||={},a.dailyCompleted[e]=!0,A(a),M(O.GAME_PLAYED,`game_played`),M(O.GAME_COMPLETED,`game_completed`),a.streak>1&&M(O.STREAK_BONUS_BASE*a.streak,`streak_bonus`),i&&(M(O.DAILY_COMPLETED,`daily_completed`),t.emit(n.DAILY_COMPLETED,{gameId:e}))}function we(e){let t=k();return!!(t.dailyCompleted&&t.dailyCompleted[e])}function Te(){let e=k(),t=D[e.level-1]||0,n=D[e.level]||D[D.length-1]+5e3,r=(e.xp-t)/(n-t);return{current:e.xp-t,next:n-t,progress:Math.min(Math.max(r,0),1)}}function Ee(){let e=k(),t=j();p.get(`prog:last_daily_reset`,``)!==t&&(e.dailyCompleted={},A(e),p.set(`prog:last_daily_reset`,t))}function De(){p.set(E,ye())}var N=null;function Oe(){N=document.createElement(`div`),N.className=`toast-container`,document.body.appendChild(N),t.on(n.TOAST_SHOW,ke)}function ke({message:e,icon:t=`ℹ️`,duration:n=3e3}){if(!N)return;let r=document.createElement(`div`);r.className=`toast`,r.innerHTML=`
    <span class="toast__icon">${t}</span>
    <span class="toast__message">${e}</span>
  `,N.appendChild(r),C(`tap`),setTimeout(()=>{r.classList.add(`exit`),r.addEventListener(`animationend`,()=>r.remove())},n)}var P=null,F=null;function Ae(){P=document.createElement(`div`),P.className=`modal-overlay`,P.innerHTML=`
    <div class="modal" id="global-modal">
      <div class="modal__handle"></div>
      <div class="modal__header">
        <h3 class="modal__title" id="modal-title"></h3>
        <button class="modal__close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal__body" id="modal-body"></div>
    </div>
  `,document.body.appendChild(P),P.addEventListener(`click`,e=>{e.target===P&&L()}),P.querySelector(`#modal-close-btn`).addEventListener(`click`,L),t.on(n.MODAL_OPEN,I),t.on(n.MODAL_CLOSE,L)}function I({title:e,content:t,onClose:n}){if(!P)return;document.getElementById(`modal-title`).textContent=e;let r=document.getElementById(`modal-body`);r.innerHTML=``,typeof t==`string`?r.innerHTML=t:t instanceof HTMLElement&&r.appendChild(t),F=n||null,P.classList.add(`open`),C(`tap`)}function L(){P&&(P.classList.remove(`open`),F&&=(F(),null))}function R({title:e,showBack:t=!1,onBack:n,action:r}){return`
    <div class="screen-header">
      ${t?`<button class="screen-header__back" data-action="back">←</button>`:``}
      <h1 class="screen-header__title">${e}</h1>
      ${r?`<button class="screen-header__action" data-action="header-action">${r.label}</button>`:``}
    </div>
  `}function z(e,{onBack:t,action:n}){let r=e.querySelector(`[data-action="back"]`);r&&t&&r.addEventListener(`click`,()=>{C(`tap`),t()});let i=e.querySelector(`[data-action="header-action"]`);i&&n?.onClick&&i.addEventListener(`click`,()=>{C(`tap`),n.onClick()})}function B(e=`home`){let t={home:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,leaderboard:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,profile:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,settings:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`};return`<nav class="bottom-nav">${[{id:`home`,icon:t.home,labelKey:`nav.home`,route:`/`},{id:`leaderboard`,icon:t.leaderboard,labelKey:`nav.leaderboard`,route:`/leaderboard`},{id:`profile`,icon:t.profile,labelKey:`nav.profile`,route:`/profile`},{id:`settings`,icon:t.settings,labelKey:`nav.settings`,route:`/settings`}].map(t=>`
    <button class="bottom-nav__item ${t.id===e?`active`:``}"
            data-nav-route="${t.route}" data-nav-id="${t.id}">
      <span class="bottom-nav__icon">${t.icon}</span>
      <span data-i18n="${t.labelKey}">${y(t.labelKey)}</span>
    </button>
  `).join(``)}</nav>`}function V(e,t){let n=e.querySelectorAll(`[data-nav-route]`);for(let e of n)e.addEventListener(`click`,()=>{C(`click`),t(e.dataset.navRoute)})}function je({score:e,bestScore:t,isNewBest:n,rank:r,gameTitle:i,onPlayAgain:a,onHome:o,onShare:s}){let c=document.createElement(`div`);c.style.textAlign=`center`,c.innerHTML=`
    <div style="font-size: 3rem; margin-bottom: var(--space-4);">
      ${n?`🏆`:`🎉`}
    </div>
    <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-black); margin-bottom: var(--space-2);">
      ${y(`gameover.title`)}
    </h2>
    <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">${y(`gameover.great`)}</p>

    <div class="stats-row" style="margin-bottom: var(--space-6);">
      <div class="stat-item">
        <div class="stat-item__value text-gradient-warm">${e}</div>
        <div class="stat-item__label">${y(`gameover.score`)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-item__value text-gradient">${t}</div>
        <div class="stat-item__label">${y(`gameover.best_score`)}</div>
      </div>
      ${r?`
      <div class="stat-item">
        <div class="stat-item__value" style="color: var(--color-accent-warm);">#${r}</div>
        <div class="stat-item__label">${y(`common.rank`)}</div>
      </div>
      `:``}
    </div>

    ${n?`
    <div class="badge badge--warning" style="margin-bottom: var(--space-4); padding: var(--space-2) var(--space-4); font-size: var(--text-base);">
      ${y(`gameover.new_best`)}
    </div>
    `:``}

    <div style="display: flex; flex-direction: column; gap: var(--space-3);">
      <button class="btn btn--primary btn--full btn--lg" id="go-play-again">${y(`gameover.play_again`)}</button>
      <div style="display: flex; gap: var(--space-3);">
        <button class="btn btn--secondary" style="flex:1;" id="go-home">${y(`gameover.home`)}</button>
        <button class="btn btn--secondary" style="flex:1;" id="go-share">📤 ${y(`common.share`)}</button>
      </div>
    </div>
  `,I({title:``,content:c}),c.querySelector(`#go-play-again`)?.addEventListener(`click`,()=>{L(),a?.()}),c.querySelector(`#go-home`)?.addEventListener(`click`,()=>{L(),o?.()}),c.querySelector(`#go-share`)?.addEventListener(`click`,()=>{s?.()})}var H=new Map,Me=null,U=null,W=[];function G(e,t){H.set(e,t)}function Ne(e){U=e,window.addEventListener(`hashchange`,()=>{Fe(Pe())}),Fe(Pe())}function K(e,t={}){q=t,window.location.hash=`#${e}`}var q={};function Pe(){return window.location.hash.slice(1)||`/`}function Fe(e){if(!U)return;let r=H.get(e),i={...q};if(!r)for(let[t,n]of H){let a=Ie(t,e);if(a){r=n,i={...i,...a};break}}if(!r){if(console.warn(`[Router] No route registered for: ${e}`),r=H.get(`/`),!r)return;e=`/`}let a=Me;Me=e,W[W.length-1]!==e&&(W.push(e),W.length>20&&W.shift()),a&&t.emit(n.SCREEN_EXITED,{route:a});let o=U.querySelectorAll(`.screen.active`);for(let e of o)e.classList.remove(`active`),e.classList.add(`exit-left`),e.addEventListener(`transitionend`,()=>{e.classList.contains(`active`)||e.remove()},{once:!0}),setTimeout(()=>{e.classList.contains(`active`)||e.remove()},400);let s=document.createElement(`div`);s.className=`screen`,s.id=`screen-${e.replace(/\//g,`-`).replace(/^-/,``)}`,U.appendChild(s);try{r(s,i)}catch(t){console.error(`[Router] Error rendering route "${e}":`,t),s.innerHTML=`<div class="screen-body"><div class="empty-state"><div class="empty-state__icon">⚠️</div><div class="empty-state__title">Something went wrong</div></div></div>`}requestAnimationFrame(()=>{requestAnimationFrame(()=>{s.classList.add(`active`)})}),q={},t.emit(n.SCREEN_ENTERED,{route:e,params:i}),t.emit(n.NAVIGATE,{route:e,params:i,prevRoute:a})}function Ie(e,t){let n=e.split(`/`),r=t.split(`/`);if(n.length!==r.length)return null;let i={};for(let e=0;e<n.length;e++)if(n[e].startsWith(`:`))i[n[e].slice(1)]=r[e];else if(n[e]!==r[e])return null;return i}var J=new Map;function Y(e){J.set(e.id,e)}function Le(e){return J.get(e)}function Re(){return[...J.values()]}function X(e){return`/${e}?day=${encodeURIComponent(window.DBJamDemo.day)}`}var ze=new Set;function Be(e){if(!e||navigator.connection?.saveData)return;let t=X(e);if(ze.has(t))return;ze.add(t);let n=document.createElement(`link`);n.rel=`prefetch`,n.as=`document`,n.href=t,document.head.appendChild(n)}function Ve(e){e.classList.add(`screen--no-scroll`);let t=k(),n=v(),r=[{num:1,id:`wordal`,titleKey:`game1.title`,moodKey:`mood.curiosity`,cardClass:`card-game-1`,bgPattern:`
    <svg class="card-bg-pattern" viewBox="0 0 200 200" fill="none" preserveAspectRatio="none">
      <rect x="18" y="22" width="22" height="22" rx="5" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <rect x="44" y="22" width="22" height="22" rx="5" fill="rgba(255,255,255,0.14)"/>
      <rect x="70" y="22" width="22" height="22" rx="5" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <rect x="18" y="48" width="22" height="22" rx="5" fill="rgba(255,255,255,0.14)"/>
      <circle cx="160" cy="35" r="2.5" fill="rgba(255,255,255,0.25)"/>
      <path d="M140 22 L143 30 L151 33 L143 36 L140 44 L137 36 L129 33 L137 30 Z" fill="rgba(255,255,255,0.18)"/>
      <text x="185" y="130" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="38" fill="rgba(255,255,255,0.08)" text-anchor="end">शब्द</text>
    </svg>
  `,artIcon:`
    <svg width="44" height="44" viewBox="0 0 54 54" fill="none">
      <rect x="6" y="8" width="42" height="38" rx="8" fill="rgba(255,255,255,0.18)" stroke="#FFFFFF" stroke-width="2.5"/>
      <rect x="13" y="15" width="12" height="10" rx="3" fill="#FFFFFF"/>
      <rect x="29" y="15" width="12" height="10" rx="3" fill="rgba(255,255,255,0.45)"/>
      <rect x="13" y="29" width="12" height="10" rx="3" fill="rgba(255,255,255,0.45)"/>
      <rect x="29" y="29" width="12" height="10" rx="3" fill="#FFFFFF"/>
    </svg>
  `},{num:2,id:`niti`,titleKey:`game2.title`,moodKey:`mood.wisdom`,cardClass:`card-game-2`,bgPattern:`
    <svg class="card-bg-pattern" viewBox="0 0 200 350" fill="none" preserveAspectRatio="none">
      <circle cx="100" cy="110" r="90" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" stroke-dasharray="4 4"/>
      <circle cx="100" cy="110" r="60" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
      <circle cx="100" cy="110" r="30" fill="rgba(255,255,255,0.06)"/>
      <path d="M30 290 Q 100 240 170 290" stroke="rgba(255,255,255,0.14)" stroke-width="2" fill="none"/>
      <path d="M15 320 Q 100 260 185 320" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" fill="none"/>
      <text x="100" y="280" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="44" fill="rgba(255,255,255,0.09)" text-anchor="middle" letter-spacing="4">नीति</text>
    </svg>
  `,artIcon:`
    <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
      <circle cx="38" cy="38" r="32" fill="rgba(255,255,255,0.12)" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 4"/>
      <circle cx="38" cy="38" r="23" fill="rgba(254,240,138,0.2)"/>
      <path d="M18 48 C 24 44, 32 46, 38 48 C 44 46, 52 44, 58 48 L 56 55 C 50 51, 44 53, 38 55 C 32 53, 26 51, 20 55 Z" fill="#FFFFFF"/>
      <path d="M25 43 C 25 39, 31 35, 38 35 C 45 35, 51 39, 51 43 C 51 47, 43 50, 38 50 C 33 50, 25 47, 25 43 Z" fill="#FEF08A"/>
      <path d="M38 21 C 35 27, 33 30, 33 34 C 33 37, 35 39, 38 39 C 41 39, 43 37, 43 34 C 43 30, 41 27, 38 21 Z" fill="#FFFFFF"/>
      <path d="M38 25 C 36.5 29, 35.5 31, 35.5 34 C 35.5 36, 36.5 37.5, 38 37.5 C 39.5 37.5, 40.5 36, 40.5 34 C 40.5 31, 39.5 29, 38 25 Z" fill="#F59E0B"/>
      <path d="M49 16 Q 43 28 35 40 L 37 42 Q 47 30 53 18 Z" fill="#FFFFFF" opacity="0.95"/>
    </svg>
  `},{num:3,id:`cricket`,titleKey:`game3.title`,moodKey:`mood.excitement`,cardClass:`card-game-3`,bgPattern:`
    <svg class="card-bg-pattern" viewBox="0 0 200 200" fill="none" preserveAspectRatio="none">
      <line x1="20" y1="140" x2="180" y2="140" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="50" y1="125" x2="50" y2="155" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="150" y1="125" x2="150" y2="155" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <path d="M-10 60 Q 90 10 210 90" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-dasharray="5 5" fill="none"/>
      <circle cx="100" cy="190" r="85" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <text x="180" y="70" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="34" fill="rgba(255,255,255,0.08)" text-anchor="end">सुपर</text>
    </svg>
  `,artIcon:`
    <svg width="48" height="48" viewBox="0 0 54 54" fill="none">
      <path d="M12 44 L 28 28 L 33 33 L 17 49 Z" fill="#FFFFFF"/>
      <path d="M28 28 L 34 22 L 36 24 L 30 30 Z" fill="#FDE68A"/>
      <line x1="33" y1="23" x2="42" y2="14" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      <circle cx="38" cy="38" r="10" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M31 38 Q 38 31 45 38" stroke="#FFFFFF" stroke-width="1.8" stroke-dasharray="2 2" fill="none"/>
      <path d="M22 24 L 24 18 L 26 24 L 32 26 L 26 28 L 24 34 L 22 28 L 16 26 Z" fill="#FEF08A"/>
    </svg>
  `},{num:4,id:`carrom`,titleKey:`game4.title`,moodKey:`mood.focus`,cardClass:`card-game-4`,bgPattern:`
    <svg class="card-bg-pattern" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none">
      <circle cx="150" cy="100" r="55" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <circle cx="150" cy="100" r="30" stroke="rgba(255,255,255,0.2)" stroke-width="1.8"/>
      <circle cx="150" cy="100" r="10" fill="rgba(255,255,255,0.18)"/>
      <line x1="40" y1="30" x2="260" y2="30" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <line x1="40" y1="170" x2="260" y2="170" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <circle cx="30" cy="30" r="14" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <circle cx="270" cy="30" r="14" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      <text x="240" y="140" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="34" fill="rgba(255,255,255,0.08)" letter-spacing="4">कैरम</text>
    </svg>
  `,artIcon:`
    <svg width="48" height="48" viewBox="0 0 54 54" fill="none">
      <circle cx="23" cy="31" r="15" fill="#FFFFFF" stroke="#FDE047" stroke-width="2.5"/>
      <circle cx="23" cy="31" r="8" fill="rgba(225,29,72,0.18)" stroke="#E11D48" stroke-width="1.5"/>
      <circle cx="38" cy="19" r="9" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="38" cy="19" r="4" fill="#FEF08A"/>
      <circle cx="17" cy="16" r="6" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5"/>
      <path d="M29 26 L 33 22" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `},{num:5,id:`jodo`,titleKey:`game5.title`,moodKey:`mood.discovery`,cardClass:`card-game-5`,bgPattern:`
    <svg class="card-bg-pattern" viewBox="0 0 200 200" fill="none" preserveAspectRatio="none">
      <line x1="30" y1="40" x2="110" y2="70" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="110" y1="70" x2="170" y2="40" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="110" y1="70" x2="90" y2="150" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
      <line x1="90" y1="150" x2="160" y2="140" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <circle cx="30" cy="40" r="6" fill="rgba(255,255,255,0.25)"/>
      <circle cx="110" cy="70" r="8" fill="rgba(255,255,255,0.3)"/>
      <circle cx="170" cy="40" r="5" fill="rgba(255,255,255,0.25)"/>
      <circle cx="90" cy="150" r="7" fill="rgba(255,255,255,0.25)"/>
      <circle cx="160" cy="140" r="6" fill="rgba(255,255,255,0.3)"/>
      <text x="180" y="180" font-family="'Noto Sans Devanagari', 'Inter', sans-serif" font-weight="900" font-size="34" fill="rgba(255,255,255,0.07)" text-anchor="end">जोड़ो</text>
    </svg>
  `,artIcon:`
    <svg width="46" height="46" viewBox="0 0 54 54" fill="none">
      <circle cx="16" cy="27" r="10" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2.5"/>
      <circle cx="16" cy="27" r="4" fill="#2563EB"/>
      <circle cx="38" cy="27" r="10" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2.5"/>
      <circle cx="38" cy="27" r="4" fill="#2563EB"/>
      <line x1="24" y1="27" x2="30" y2="27" stroke="#FEF08A" stroke-width="4" stroke-linecap="round"/>
      <path d="M27 21 L 28 25 L 32 27 L 28 29 L 27 33 L 26 29 L 22 27 L 26 25 Z" fill="#FEF08A"/>
    </svg>
  `}],i=[{key:`day.mon`,en:`MON`,hi:`सोम`},{key:`day.tue`,en:`TUS`,hi:`मंगल`},{key:`day.wed`,en:`WED`,hi:`बुध`},{key:`day.thu`,en:`THR`,hi:`गुरु`},{key:`day.fri`,en:`FRI`,hi:`शुक्र`},{key:`day.sat`,en:`SAT`,hi:`शनि`},{key:`day.sun`,en:`SON`,hi:`रवि`}],a=new Date(window.DBJamDemo.date),o=(a.getDay()+6)%7,s=new Date(a);s.setDate(a.getDate()-o);let c=i.map((e,r)=>{let i=new Date(s);i.setDate(s.getDate()+r);let c=i.toISOString().split(`T`)[0],l=r===o,u=r<o,d=!!(t.dailyHistory&&t.dailyHistory[c]);l?(t.dailyCompleted&&Object.values(t.dailyCompleted).some(Boolean)||t.lastPlayDate===c)&&(d=!0):u&&!d&&t.streak>0&&Math.floor((a-i)/864e5)<=t.streak&&(d=!0);let f=n===`hi`?e.hi:e.en;return`
      <div class="weekly-day-col ${l?`is-today`:``}">
        <span class="weekly-day-label">${f}</span>
        <div class="weekly-day-dot ${d?`done`:``} ${l?`today-dot`:``}">
          ${d?`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`:``}
        </div>
      </div>
    `}).join(``);function l(e){let t=we(e.id),n=t?`dot-done`:`dot-left`;return`
      <div class="game-bento-card ${e.cardClass}" data-game-id="${e.id}">
        ${e.bgPattern}

        <!-- Top Bar inside Card: Status dot & Subtag Pill -->
        <div class="card-top-bar">
          <div class="game-status-dot ${n}" title="${y(t?`hub.done`:`hub.left`)}">
            ${t?`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`:``}
          </div>
          <div class="card-genre-pill">${y(e.moodKey)}</div>
        </div>

        <!-- Floating Art at bottom-right -->
        <div class="card-art-float">
          ${e.artIcon}
        </div>

        <!-- Bottom Labels: Clean Hero Game Title Only -->
        <div class="card-bottom-info">
          <div class="card-game-title">${y(e.titleKey)}</div>
        </div>
      </div>
    `}function u(e){let t=we(e.id),n=t?`dot-done`:`dot-left`;return`
      <div class="game-bento-card ${e.cardClass}" data-game-id="${e.id}">
        ${e.bgPattern}

        <!-- Top Bar inside Card: Status dot & Subtag Pill -->
        <div class="card-top-bar">
          <div class="game-status-dot ${n}" title="${y(t?`hub.done`:`hub.left`)}">
            ${t?`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`:``}
          </div>
          <div class="card-genre-pill">${y(e.moodKey)}</div>
        </div>

        <!-- Center Arena Graphic -->
        <div class="card-game-2-center-art">
          ${e.artIcon}
        </div>

        <!-- Bottom Labels: Clean Hero Game Title Only -->
        <div class="card-bottom-info">
          <div class="card-game-title">${y(e.titleKey)}</div>
        </div>
      </div>
    `}let d=r.find(e=>e.num===1),f=r.find(e=>e.num===2),p=r.find(e=>e.num===3),m=r.find(e=>e.num===4),h=r.find(e=>e.num===5);e.innerHTML=`
    
    <style>
      .bento-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        min-height: 0;
        overflow: hidden;
        background: #F8F9FA;
      }

      .bento-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: clamp(8px, 1.4vh, 14px) clamp(14px, 3.5vw, 18px) clamp(4px, 0.8vh, 8px) clamp(14px, 3.5vw, 18px);
        flex-shrink: 0;
      }

      .hub-header-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #FFFFFF;
        padding: clamp(5px, 0.8vh, 7px) clamp(12px, 2.5vw, 16px);
        border-radius: 9999px;
        font-weight: 800;
        font-size: clamp(0.92rem, 1.8vh, 1.05rem);
        color: #EA580C;
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }

      .hub-icon-circle-btn {
        width: clamp(38px, 4.8vh, 44px);
        height: clamp(38px, 4.8vh, 44px);
        border-radius: 50%;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        font-weight: 800;
        font-size: clamp(0.78rem, 1.4vh, 0.85rem);
        color: #0F172A;
        cursor: pointer;
        transition: transform 0.15s, background 0.15s;
      }
      .hub-icon-circle-btn:active {
        transform: scale(0.92);
      }

      /* Weekly Day Tracker Strip */
      .weekly-tracker-wrap {
        padding: 0 clamp(12px, 3vw, 16px) clamp(6px, 1.1vh, 10px) clamp(12px, 3vw, 16px);
        flex-shrink: 0;
      }

      .weekly-tracker-card {
        background: #FFFFFF;
        border-radius: clamp(14px, 1.8vh, 18px);
        padding: clamp(6px, 0.9vh, 10px) clamp(10px, 2.5vw, 14px);
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .weekly-day-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp(3px, 0.5vh, 6px);
        flex: 1;
        cursor: default;
      }

      .weekly-day-label {
        font-size: clamp(0.6rem, 0.95vh, 0.68rem);
        font-weight: 800;
        letter-spacing: 0.04em;
        color: #94A3B8;
        text-transform: uppercase;
        transition: color 0.2s;
      }

      .weekly-day-col.is-today .weekly-day-label {
        color: #0F172A;
        font-weight: 900;
      }

      .weekly-day-dot {
        width: clamp(22px, 3.2vh, 28px);
        height: clamp(22px, 3.2vh, 28px);
        border-radius: 50%;
        background: #E2E8F0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
        position: relative;
      }

      .weekly-day-dot.done {
        background: #16A34A;
        box-shadow: 0 3px 8px rgba(22, 163, 74, 0.4);
      }

      .weekly-day-dot.today-dot {
        background: #FFFFFF;
        border: 2px solid #0F172A;
        box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.15);
      }

      .weekly-day-dot.today-dot::after {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #0F172A;
      }

      .weekly-day-dot.done.today-dot {
        background: #16A34A;
        border: none;
        box-shadow: 0 0 0 2px #FFFFFF, 0 0 0 4px #0F172A, 0 3px 8px rgba(22, 163, 74, 0.4);
      }
      .weekly-day-dot.done.today-dot::after {
        display: none;
      }

      /* 5-Game Bento Grid — Flexible, Responsive & Completely No-Scroll */
      .bento-games-area {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 1.2vh, 14px);
        padding: 0 clamp(12px, 3vw, 16px) clamp(8px, 1.2vh, 14px) clamp(12px, 3vw, 16px);
        flex: 1;
        min-height: 0;
      }

      .bento-row-top {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(8px, 1.3vw, 14px);
        flex: 1.6;
        min-height: 0;
      }

      .bento-col-left {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 1.2vh, 14px);
        height: 100%;
        min-height: 0;
      }

      .bento-row-bottom {
        display: grid;
        grid-template-columns: 1.35fr 1fr;
        gap: clamp(8px, 1.3vw, 14px);
        flex: 1;
        min-height: 0;
      }

      /* Base Game Bento Card */
      .game-bento-card {
        position: relative;
        border-radius: clamp(16px, 2.2vh, 22px);
        overflow: hidden;
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: clamp(10px, 1.5vh, 16px);
        transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s;
        user-select: none;
        -webkit-user-select: none;
        min-height: 0;
      }

      .game-bento-card:hover {
        transform: translateY(-2px);
      }

      .game-bento-card:active {
        transform: scale(0.97);
      }

      .card-game-1 {
        flex: 1;
        min-height: 0;
        background: linear-gradient(140deg, #4F46E5 0%, #3730A3 100%);
        box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.35);
      }

      .card-game-2 {
        height: 100%;
        min-height: 0;
        background: linear-gradient(145deg, #F97316 0%, #EA580C 50%, #C2410C 100%);
        box-shadow: 0 8px 20px -4px rgba(234, 88, 12, 0.38);
      }

      .card-game-3 {
        flex: 1;
        min-height: 0;
        background: linear-gradient(140deg, #059669 0%, #047857 50%, #065F46 100%);
        box-shadow: 0 8px 20px -4px rgba(5, 150, 105, 0.35);
      }

      .card-game-4 {
        height: 100%;
        min-height: 0;
        background: linear-gradient(140deg, #E11D48 0%, #BE123C 50%, #9F1239 100%);
        box-shadow: 0 8px 20px -4px rgba(225, 29, 72, 0.35);
      }

      .card-game-5 {
        height: 100%;
        min-height: 0;
        background: linear-gradient(140deg, #2563EB 0%, #1D4ED8 100%);
        box-shadow: 0 8px 20px -4px rgba(37, 99, 235, 0.35);
      }

      /* Card Top Bar (Status Dot + Subtag Pill) */
      .card-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 3;
        position: relative;
        flex-shrink: 0;
      }

      /* Status Dot in top-left */
      .game-status-dot {
        width: clamp(18px, 2.3vh, 22px);
        height: clamp(18px, 2.3vh, 22px);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s, background 0.2s;
        flex-shrink: 0;
      }

      .game-status-dot.dot-done {
        background: #22C55E;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.95), 0 3px 8px rgba(34, 197, 94, 0.5);
      }

      .game-status-dot.dot-left {
        background: rgba(0, 0, 0, 0.25);
        border: 2px solid rgba(255, 255, 255, 0.7);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }
      .game-status-dot.dot-left::after {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.85);
      }

      /* Subtag Pill Tag in top-right */
      .card-genre-pill {
        background: rgba(255, 255, 255, 0.22);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.35);
        border-radius: 9999px;
        padding: clamp(2px, 0.35vh, 4px) clamp(8px, 1.5vw, 11px);
        font-size: clamp(0.58rem, 1vh, 0.68rem);
        font-weight: 800;
        letter-spacing: 0.03em;
        color: #FFFFFF;
        line-height: 1.1;
        flex-shrink: 0;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      }

      /* Background Pattern Overlay */
      .card-bg-pattern {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }

      /* Floating Accent Art */
      .card-art-float {
        position: absolute;
        right: clamp(10px, 1.8vw, 14px);
        bottom: clamp(6px, 1.2vh, 12px);
        z-index: 2;
        pointer-events: none;
        opacity: 0.92;
        transition: transform 0.2s;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
      }

      .card-art-float svg {
        width: clamp(34px, 4.6vh, 46px);
        height: clamp(34px, 4.6vh, 46px);
      }

      .game-bento-card:hover .card-art-float {
        transform: scale(1.08);
      }

      /* Game 2 (Tall Card) Center Art */
      .card-game-2-center-art {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        min-height: 0;
        z-index: 2;
        pointer-events: none;
        margin: clamp(4px, 1vh, 10px) 0;
        transition: transform 0.2s;
      }

      .card-game-2-center-art svg {
        width: clamp(52px, 8.5vh, 76px);
        height: clamp(52px, 8.5vh, 76px);
      }

      .card-game-2:hover .card-game-2-center-art {
        transform: scale(1.08);
      }

      /* Bottom Labels */
      .card-bottom-info {
        display: flex;
        flex-direction: column;
        z-index: 3;
        position: relative;
        max-width: 82%;
        flex-shrink: 0;
      }

      .card-game-2 .card-bottom-info {
        max-width: 100%;
      }

      .card-game-title {
        font-family: 'Noto Sans Devanagari', 'Inter', system-ui, sans-serif;
        font-size: clamp(0.94rem, 2.1vh, 1.24rem);
        font-weight: 900;
        letter-spacing: -0.01em;
        color: #FFFFFF;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.22);
      }
    </style>
  
    <div class="bento-container">
      <!-- Top Bar (Profile avatar, streak, language switch) -->
      <div class="bento-header">
        <!-- Profile Avatar -->
        <div id="hub-profile-btn" style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Hanna" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        
        <!-- Streak Pill -->
        <div class="hub-header-pill">
          ${t.streak} 🔥
        </div>

        <!-- Language Toggle -->
        <button class="hub-icon-circle-btn" id="hub-lang-toggle">
          ${n===`hi`?`EN`:`हिं`}
        </button>
      </div>

      <!-- Weekly Day Tracker (MON - SON) -->
      <div class="weekly-tracker-wrap">
        <div class="weekly-tracker-card">
          ${c}
        </div>
      </div>

      <!-- 5 Games Bento Grid Area -->
      <div class="bento-games-area">
        <!-- Top Section (Left: Game 1 & Game 3 stacked, Right: Game 2 tall) -->
        <div class="bento-row-top">
          <div class="bento-col-left">
            ${l(d)}
            ${l(p)}
          </div>
          ${u(f)}
        </div>

        <!-- Bottom Section (Left: Game 4 wide, Right: Game 5) -->
        <div class="bento-row-bottom">
          ${l(m)}
          ${l(h)}
        </div>
      </div>
    </div>
    ${B(`home`)}
  `,e.querySelectorAll(`.game-bento-card`).forEach(e=>{let t=()=>Be(Le(e.dataset.gameId)?.htmlFile);e.addEventListener(`pointerenter`,t,{once:!0}),e.addEventListener(`pointerdown`,t,{once:!0,passive:!0}),e.addEventListener(`click`,()=>{C(`tap`),K(`/game/`+e.dataset.gameId)})});let g=e.querySelector(`#hub-profile-btn`);g&&g.addEventListener(`click`,()=>{C(`click`),K(`/profile`)});let _=e.querySelector(`#hub-lang-toggle`);_&&_.addEventListener(`click`,()=>{ne(),C(`tap`),Ve(e)}),V(e,K)}function He(e){let t=Re(),n=t[0]?.id||``,r=`daily`,i=T(n,r),a=he(n,r);e.innerHTML=`
    ${R({title:y(`lb.title`)})}
    
    <div class="screen-body" style="padding-top: var(--space-2); display: flex; flex-direction: column;">
      
      <!-- Period Selector -->
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
        <button class="btn btn--primary btn--sm" style="flex: 1;">${y(`lb.daily`)}</button>
        <button class="btn btn--secondary btn--sm" style="flex: 1;">${y(`lb.weekly`)}</button>
        <button class="btn btn--secondary btn--sm" style="flex: 1;">${y(`lb.alltime`)}</button>
      </div>

      <!-- Game Selector (Placeholder) -->
      <div style="margin-bottom: var(--space-4);">
        <select class="btn btn--secondary" style="width: 100%; text-align: left; padding: var(--space-3); border-radius: var(--radius-md);">
          ${t.map(e=>`<option value="${e.id}">${y(e.titleKey)}</option>`).join(``)}
        </select>
      </div>

      <!-- Player Rank Banner -->
      ${a?`
      <div style="margin-bottom: var(--space-4); padding: var(--space-3); background: var(--gradient-brand); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: var(--weight-bold);">${y(`lb.your_rank`)}</span>
        <span style="font-size: var(--text-xl); font-weight: var(--weight-black);">#${a}</span>
      </div>
      `:``}

      <!-- List -->
      <div class="lb-list" style="flex: 1; overflow-y: auto;">
        ${i.length>0?i.map((e,t)=>{let n=t+1,r=``;n===1?r=`lb-item__rank--gold`:n===2?r=`lb-item__rank--silver`:n===3&&(r=`lb-item__rank--bronze`);let i=e.id===`player`;return`
            <div class="lb-item ${i?`lb-item--you`:``}">
              <div class="lb-item__rank ${r}">${n}</div>
              <div class="lb-item__avatar">${e.name.charAt(0)}</div>
              <div class="lb-item__name">${e.name} ${i?`(You)`:``}</div>
              <div class="lb-item__score">${e.score} <span style="font-size: var(--text-xs); color: var(--text-tertiary);">${y(`lb.points`)}</span></div>
            </div>
          `}).join(``):`
          <div class="empty-state">
            <div class="empty-state__icon">🏆</div>
            <div class="empty-state__title">${y(`lb.no_scores`)}</div>
          </div>
        `}
      </div>
      
      <div style="height: var(--space-8);"></div>
    </div>

    ${B(`leaderboard`)}
  `,z(e,{}),V(e,K)}var Z=`achievements`,Ue=[{id:`first_game`,icon:`🎮`,titleKey:`ach.first_game`,descKey:`ach.first_game_desc`,check:e=>e.gamesPlayed>=1},{id:`streak_3`,icon:`🔥`,titleKey:`ach.streak_3`,descKey:`ach.streak_3_desc`,check:e=>e.longestStreak>=3},{id:`streak_7`,icon:`⚡`,titleKey:`ach.streak_7`,descKey:`ach.streak_7_desc`,check:e=>e.longestStreak>=7},{id:`streak_30`,icon:`👑`,titleKey:`ach.streak_30`,descKey:`ach.streak_30_desc`,check:e=>e.longestStreak>=30},{id:`level_5`,icon:`⭐`,titleKey:`ach.level_5`,descKey:`ach.level_5_desc`,check:e=>e.level>=5},{id:`level_10`,icon:`🌟`,titleKey:`ach.level_10`,descKey:`ach.level_10_desc`,check:e=>e.level>=10},{id:`games_10`,icon:`🏅`,titleKey:`ach.games_10`,descKey:`ach.games_10_desc`,check:e=>e.gamesPlayed>=10},{id:`games_50`,icon:`🏆`,titleKey:`ach.games_50`,descKey:`ach.games_50_desc`,check:e=>e.gamesPlayed>=50},{id:`score_1000`,icon:`💎`,titleKey:`ach.score_1000`,descKey:`ach.score_1000_desc`,check:e=>e.totalScore>=1e3},{id:`score_10000`,icon:`💰`,titleKey:`ach.score_10000`,descKey:`ach.score_10000_desc`,check:e=>e.totalScore>=1e4},{id:`all_daily`,icon:`✨`,titleKey:`ach.all_daily`,descKey:`ach.all_daily_desc`,check:e=>Object.keys(e.dailyCompleted||{}).length>=5}];function We(){return Ue}function Ge(){let e=p.get(Z,[]);return new Set(e)}function Ke(e){let r=Ge(),i=[];for(let a of Ue)!r.has(a.id)&&a.check(e)&&(r.add(a.id),i.push(a),t.emit(n.ACHIEVEMENT_UNLOCK,{achievement:a}));return i.length>0&&p.set(Z,[...r]),i}async function qe({gameTitle:e,score:r,url:i=window.location.href}){let a=y(`gameover.share_text`,{score:r,game:e});if(navigator.share)try{return await navigator.share({title:`Dainik Bhaskar Game Lab`,text:a,url:i}),t.emit(n.SHARE_RESULT,{gameTitle:e,score:r,method:`native`}),!0}catch{}try{return await navigator.clipboard.writeText(`${a}\n${i}`),t.emit(n.SHARE_RESULT,{gameTitle:e,score:r,method:`clipboard`}),t.emit(n.TOAST_SHOW,{message:`Copied to clipboard! 📋`,icon:`📋`}),!0}catch{return!1}}function Je(){p.set(Z,[])}function Ye(e){let t=k();Te();let n=We(),r=Ge();e.innerHTML=`
    ${R({title:y(`profile.title`)})}
    
    <div class="screen-body" style="padding-top: var(--space-4); display: flex; flex-direction: column;">
      
      <!-- User Profile Header -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-3); margin-bottom: var(--space-8);">
        <div class="avatar avatar--xl" style="box-shadow: var(--shadow-glow);">P</div>
        <div style="text-align: center;">
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold);">Player</h2>
          <div class="badge badge--primary" style="margin-top: var(--space-1);">${y(`profile.level`)} ${t.level}</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-8);">
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-accent-warm);">${t.longestStreak}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">Max Streak (${y(`profile.days`)})</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-primary-light);">${t.gamesPlayed}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">${y(`profile.games_played`)}</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-success);">${t.xp}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">Total ${y(`profile.xp`)}</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-info);">${t.totalScore}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">${y(`profile.total_score`)}</div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="section-header">
        <h3 class="section-header__title">${y(`profile.achievements`)} <span style="font-size: var(--text-base); color: var(--text-secondary); font-weight: normal;">(${r.size}/${n.length})</span></h3>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        ${n.map(e=>{let t=r.has(e.id);return`
            <div style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3) var(--space-4); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); opacity: ${t?`1`:`0.4`}; filter: ${t?`none`:`grayscale(1)`};">
              <div style="font-size: 2rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-raised); border-radius: var(--radius-full); flex-shrink: 0;">
                ${e.icon}
              </div>
              <div>
                <div style="font-size: var(--text-base); font-weight: var(--weight-bold);">${y(e.titleKey)}</div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary);">${y(e.descKey)}</div>
              </div>
            </div>
          `}).join(``)}
      </div>

      <div style="height: var(--space-8);"></div>
    </div>

    ${B(`profile`)}
  `,z(e,{}),V(e,K)}function Xe(e){let t=v();e.innerHTML=`
    ${R({title:y(`settings.title`)})}
    
    <div class="screen-body" style="padding-top: var(--space-4);">
      
      <!-- Language -->
      <div class="card" style="margin-bottom: var(--space-4);">
        <div class="card__body" style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: var(--text-base); font-weight: var(--weight-semibold);">${y(`settings.language`)}</div>
          </div>
          <div class="lang-switch">
            <button class="lang-switch__option ${t===`en`?`active`:``}" data-lang="en">English</button>
            <button class="lang-switch__option ${t===`hi`?`active`:``}" data-lang="hi">हिंदी</button>
          </div>
        </div>
      </div>

      <!-- Audio -->
      <div class="card" style="margin-bottom: var(--space-4);">
        <div class="card__body" style="display: flex; flex-direction: column; gap: var(--space-4);">
          
          <div class="toggle" id="toggle-sfx">
            <div style="flex: 1;">
              <div class="toggle__label">${y(`settings.sound`)}</div>
            </div>
            <div class="toggle__track ${le()?`active`:``}">
              <div class="toggle__thumb"></div>
            </div>
          </div>
          
          <div class="divider" style="margin: 0;"></div>
          
          <div class="toggle" id="toggle-music">
            <div style="flex: 1;">
              <div class="toggle__label">${y(`settings.music`)}</div>
            </div>
            <div class="toggle__track ${ue()?`active`:``}">
              <div class="toggle__thumb"></div>
            </div>
          </div>
          
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card" style="margin-bottom: var(--space-6); border-color: rgba(255,107,107,0.3);">
        <div class="card__body">
          <button class="btn btn--danger btn--full" id="btn-reset">
            ⚠️ ${y(`settings.reset`)}
          </button>
        </div>
      </div>

      <!-- About -->
      <div style="text-align: center; color: var(--text-tertiary); font-size: var(--text-xs);">
        <p>${y(`hub.title`)} - ${y(`settings.about`)}</p>
        <p>${y(`settings.version`)} 1.0.0</p>
      </div>

    </div>

    ${B(`settings`)}
  `,z(e,{}),V(e,K),e.querySelectorAll(`.lang-switch__option`).forEach(t=>{t.addEventListener(`click`,()=>{t.dataset.lang!==v()&&(ne(),C(`tap`),Xe(e))})});let n=e.querySelector(`#toggle-sfx`);n.addEventListener(`click`,()=>{let e=n.querySelector(`.toggle__track`),t=!e.classList.contains(`active`);de(t),t?e.classList.add(`active`):e.classList.remove(`active`),t&&C(`tap`)});let r=e.querySelector(`#toggle-music`);r.addEventListener(`click`,()=>{let e=r.querySelector(`.toggle__track`),t=!e.classList.contains(`active`);fe(t),t?e.classList.add(`active`):e.classList.remove(`active`),C(`tap`)}),e.querySelector(`#btn-reset`).addEventListener(`click`,()=>{C(`click`),I({title:`Warning`,content:`
        <div style="text-align: center;">
          <p style="margin-bottom: var(--space-6);">${y(`settings.reset_confirm`)}</p>
          <div style="display: flex; gap: var(--space-3);">
            <button class="btn btn--secondary" style="flex:1;" id="reset-cancel">${y(`common.cancel`)}</button>
            <button class="btn btn--danger" style="flex:1;" id="reset-confirm">${y(`settings.reset`)}</button>
          </div>
        </div>
      `}),setTimeout(()=>{document.getElementById(`reset-cancel`)?.addEventListener(`click`,()=>{L()}),document.getElementById(`reset-confirm`)?.addEventListener(`click`,()=>{De(),Je(),L(),ke({message:`Progress reset`,icon:`🗑️`}),setTimeout(()=>K(`/`),1e3)})},100)})}var Q=null;function Ze(e,t){let n=t.id,r=Le(n);if(!r){e.innerHTML=`
      <div class="screen-body empty-state">
        <div class="empty-state__icon">⚠️</div>
        <div class="empty-state__title">Game Not Found</div>
        <button class="btn btn--primary" id="gp-back" style="margin-top: var(--space-4);">${y(`common.back`)}</button>
      </div>
    `,e.querySelector(`#gp-back`).addEventListener(`click`,()=>K(`/`));return}e.innerHTML=``;try{Q=r.create(e),Q.init()}catch(t){console.error(`[GamePlayer] Error starting game ${n}:`,t),e.innerHTML=`<div class="screen-body empty-state">Error loading game.</div>`}}t.on(n.SCREEN_EXITED,({route:e})=>{e.startsWith(`/game/`)&&Q&&(Q.destroy(),Q=null)});var Qe=class{constructor(e,t){this.container=e,this.config=t,this.id=t.id,this.titleKey=t.titleKey,this.icon=t.icon,this.score=0,this.isRunning=!1,this.isPaused=!1,this.startTime=null,this._gameArea=document.createElement(`div`),this._gameArea.className=`game-area`,this._gameArea.style.cssText=`
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    `,this._cleanupFns=[]}async init(){this.container.innerHTML=`
      <div class="screen-header">
        <button class="screen-header__back" id="game-back-btn" title="वापस">←</button>
        <h1 class="screen-header__title">${this.icon} ${y(this.titleKey)}</h1>
        <div class="screen-header__right">
          <button type="button" class="screen-header__help-btn" id="game-rules-btn" title="${y(`common.rules`)}">ℹ️ ${y(`common.rules`)}</button>
          <div class="screen-header__action" id="game-score-display">
            ${y(`common.score`)}: <strong id="game-score-value">0</strong>
          </div>
        </div>
      </div>
    `,this.container.appendChild(this._gameArea),this.container.querySelector(`#game-back-btn`).addEventListener(`click`,()=>{this.destroy(),K(`/`)});let e=this.container.querySelector(`#game-rules-btn`);e&&e.addEventListener(`click`,()=>{this.showRules()});let r=()=>{document.hidden&&this.isRunning&&!this.isPaused?this.pause():!document.hidden&&this.isRunning&&this.isPaused&&this.resume()};document.addEventListener(`visibilitychange`,r),this._cleanupFns.push(()=>document.removeEventListener(`visibilitychange`,r)),t.emit(n.GAME_LOADED,{gameId:this.id})}showRules(){typeof this.onRulesClick==`function`&&this.onRulesClick()}start(){this.score=0,this.isRunning=!0,this.isPaused=!1,this.startTime=Date.now(),this._updateScoreDisplay(),xe(),Se(this.id),t.emit(n.GAME_STARTED,{gameId:this.id}),C(`success`)}pause(){this.isRunning&&!this.isPaused&&(this.isPaused=!0,t.emit(n.GAME_PAUSED,{gameId:this.id}))}resume(){this.isRunning&&this.isPaused&&(this.isPaused=!1,t.emit(n.GAME_RESUMED,{gameId:this.id}))}end(e){if(!this.isRunning)return;let r=e??this.score;this.isRunning=!1,this.isPaused=!1;let i=ge(this.id),{rank:a,isNewBest:o}=me(this.id,`Player`,r);Ce(this.id,r,!0),Ke(k()),this.config.ownsResultScreen||C(o?`levelup`:`gameover`),t.emit(n.GAME_ENDED,{gameId:this.id,score:r,rank:a,isNewBest:o}),!this.config.ownsResultScreen&&je({score:r,bestScore:o?r:i,isNewBest:o,rank:a,gameTitle:y(this.titleKey),onPlayAgain:()=>{this._gameArea.innerHTML=``,this.start(),this.onStart()},onHome:()=>{this.destroy(),K(`/`)},onShare:()=>{qe({gameTitle:y(this.titleKey),score:r})}})}addScore(e){this.score+=e,this._updateScoreDisplay(),t.emit(n.GAME_SCORE_UPDATE,{gameId:this.id,score:this.score}),C(`score`)}_updateScoreDisplay(){let e=this.container.querySelector(`#game-score-value`);e&&(e.textContent=this.score)}getGameArea(){return this._gameArea}destroy(){this.isRunning=!1,this.isPaused=!1;for(let e of this._cleanupFns)try{e()}catch{}this._cleanupFns=[]}onStart(){}},$=class extends Qe{constructor(e,t){super(e,t)}async init(){await super.init(),this.start(),this.onStart()}onStart(){let e=this.getGameArea();e.innerHTML=`
      <iframe src="${X(this.config.htmlFile)}" style="width: 100%; height: 100%; border: none;" id="game-iframe-${this.id}"></iframe>
    `;let t={startGame:()=>{this.isRunning||this.start()},addScore:e=>this.addScore(e),endGame:e=>this.end(e)};window.DBGameLab=t;let n=e.querySelector(`iframe`);n.onload=()=>{try{n.contentWindow&&(n.contentWindow.DBGameLab=t)}catch(e){console.warn(`Could not inject DBGameLab object into iframe:`,e)}};let r=e=>{if(e.data){if(e.data.type===`GAME_COMPLETE`||e.data.type===`GAME_OVER`){let t=typeof e.data.score==`number`?e.data.score:100;this.end(t)}else e.data.type===`ADD_SCORE`&&this.addScore(e.data.points||10)}};window.addEventListener(`message`,r),this._cleanupFns.push(()=>{window.removeEventListener(`message`,r),window.DBGameLab===t&&delete window.DBGameLab})}onRulesClick(){let e=this.getGameArea().querySelector(`iframe`);if(e)try{e.contentWindow&&(e.contentWindow.postMessage({type:`OPEN_RULES`},`*`),typeof e.contentWindow.openHelpModal==`function`&&e.contentWindow.openHelpModal())}catch(e){console.warn(`Could not trigger rules in iframe:`,e)}}};Y({id:`wordal`,titleKey:`game1.title`,descKey:`game1.desc`,icon:`🔤`,color:`#6aaa64`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`wordal.html`,create:e=>new $(e,{id:`wordal`,titleKey:`game1.title`,icon:`🔤`,htmlFile:`wordal.html`})}),Y({id:`niti`,titleKey:`game2.title`,descKey:`game2.desc`,icon:`📜`,color:`#D35400`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`niti.html`,create:e=>new $(e,{id:`niti`,titleKey:`game2.title`,icon:`📜`,htmlFile:`niti.html`})}),Y({id:`neeti`,titleKey:`game2.title`,descKey:`game2.desc`,icon:`📜`,color:`#D35400`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`niti.html`,create:e=>new $(e,{id:`neeti`,titleKey:`game2.title`,icon:`📜`,htmlFile:`niti.html`})}),Y({id:`cricket`,titleKey:`game3.title`,descKey:`game3.desc`,icon:`🏏`,color:`#059669`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`Superover.html`,create:e=>new $(e,{id:`cricket`,titleKey:`game3.title`,icon:`🏏`,htmlFile:`Superover.html`,ownsResultScreen:!0})}),Y({id:`superover`,titleKey:`game3.title`,descKey:`game3.desc`,icon:`🏏`,color:`#059669`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`Superover.html`,create:e=>new $(e,{id:`superover`,titleKey:`game3.title`,icon:`🏏`,htmlFile:`Superover.html`,ownsResultScreen:!0})}),Y({id:`carrom`,titleKey:`game4.title`,descKey:`game4.desc`,icon:`🎯`,color:`#BE123C`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`Carrom_Puzzles.html`,create:e=>new $(e,{id:`carrom`,titleKey:`game4.title`,icon:`🎯`,htmlFile:`Carrom_Puzzles.html`})}),Y({id:`carrom_puzzles`,titleKey:`game4.title`,descKey:`game4.desc`,icon:`🎯`,color:`#BE123C`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`Carrom_Puzzles.html`,create:e=>new $(e,{id:`carrom_puzzles`,titleKey:`game4.title`,icon:`🎯`,htmlFile:`Carrom_Puzzles.html`})}),Y({id:`jodo`,titleKey:`game5.title`,descKey:`game5.desc`,icon:`🧩`,color:`#2563EB`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`jodo.html`,create:e=>new $(e,{id:`jodo`,titleKey:`game5.title`,icon:`🧩`,htmlFile:`jodo.html`})});async function $e(){ee(),se(),ve(),Ee(),Oe(),Ae(),G(`/`,Ve),G(`/leaderboard`,He),G(`/profile`,Ye),G(`/settings`,Xe),G(`/game/:id`,Ze);let e=document.getElementById(`loading-screen`),t=document.getElementById(`app-root`);e&&(e.classList.add(`fade-out`),setTimeout(()=>e.remove(),500)),Ne(t),re()}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,$e):$e();