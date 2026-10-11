/* empty css                   */import{r as e,t}from"./game-family-Y3yzjIYT.js";(()=>{if(window.DBJamDemo)return;try{if(window.parent!==window&&window.parent.DBJamDemo){window.DBJamDemo=window.parent.DBJamDemo;return}}catch{}let e=0,t=new URL(window.location.href),n=t.searchParams.get(`day`),r=performance.getEntriesByType(`navigation`)[0]?.type===`reload`;/^d[123]$/.test(n||``)&&(e=(Number(n[1])-1+ +!!r)%3);let i=`d${e+1}`;t.searchParams.set(`day`,i);try{history.replaceState(history.state,``,t)}catch{}let a=new Date;a.setHours(12,0,0,0),a.setDate(a.getDate()+e);let o=new Map;window.DBJamDemo={day:i,index:e,date:a.toISOString(),priorStreak:12+e,getItem:e=>o.get(e)??null,setItem:(e,t)=>o.set(e,String(t)),removeItem:e=>o.delete(e)}})();var n={en:{"common.play":`Play`,"common.back":`Back`,"common.close":`Close`,"common.save":`Save`,"common.cancel":`Cancel`,"common.ok":`OK`,"common.loading":`Loading…`,"common.retry":`Retry`,"common.share":`Share`,"common.score":`Score`,"common.best":`Best`,"common.rank":`Rank`,"common.today":`Today`,"common.daily":`Daily`,"common.new":`New`,"common.coming_soon":`Coming Soon`,"common.rules":`Rules`,"hub.title":`Game Lab`,"hub.daily_tagline":`A little play, every day.`,"hub.torch_hint":`Play every day to keep your torch burning.`,"opening.brand":`Dainik Bhaskar Games`,"opening.slogan":`From news to play. From play to understanding.`,"opening.caption":`Five games. Five moods. Something new every day.`,"opening.start":`Choose a game`,"opening.replay":`Replay the opening animation`,"hub.greeting":`Pick a mood for today 👋`,"hub.daily_challenge":`Daily Challenge`,"hub.all_games":`All Games`,"hub.your_stats":`Your Stats`,"hub.view_all":`View All`,"hub.game_label":`GAME {num}`,"hub.done":`Done`,"hub.left":`Left to play`,"day.mon":`MON`,"day.tue":`TUE`,"day.wed":`WED`,"day.thu":`THU`,"day.fri":`FRI`,"day.sat":`SAT`,"day.sun":`SUN`,"mood.curiosity":`Curiosity`,"mood.excitement":`Excitement`,"mood.discovery":`Discovery`,"mood.thinking":`Strategy`,"mood.nostalgia":`Nostalgia`,"mood.wisdom":`Wisdom`,"mood.focus":`Focus`,"tag.word_puzzle":`WORD PUZZLE`,"tag.daily_thought":`DAILY THOUGHT`,"tag.cricket":`CRICKET`,"tag.carrom":`CARROM`,"tag.matching":`MATCH & CONNECT`,"tag.action_flick":`ACTION FLICK`,"tag.visual_quiz":`VISUAL QUIZ`,"tag.strategy":`STRATEGY`,"tag.seven_stones":`7 STONES`,"nav.home":`Home`,"nav.leaderboard":`Rankings`,"nav.profile":`Profile`,"nav.settings":`Settings`,"nav.news":`News`,"profile.preferences":`Your settings`,"lb.title":`Leaderboard`,"lb.daily":`Daily`,"lb.weekly":`Weekly`,"lb.alltime":`All Time`,"lb.your_rank":`Your Rank`,"lb.no_scores":`No scores yet. Play a game!`,"lb.points":`pts`,"profile.title":`Profile`,"profile.level":`Level`,"profile.xp":`XP`,"profile.streak":`Streak`,"profile.games_played":`Games Played`,"profile.total_score":`Total Score`,"profile.achievements":`Achievements`,"profile.days":`days`,"profile.no_achievements":`Play games to earn achievements!`,"settings.title":`Settings`,"settings.language":`Language`,"settings.sound":`Sound Effects`,"settings.music":`Music`,"settings.haptics":`Haptics`,"settings.reset":`Reset Progress`,"settings.reset_confirm":`This will erase all your progress. Are you sure?`,"settings.about":`About`,"settings.version":`Version`,"prog.streak_fire":`🔥 {count} day streak!`,"prog.streak_lost":`Streak lost! Start fresh today.`,"prog.level_up":`🎉 Level Up! You're now level {level}!`,"prog.xp_gained":`+{amount} XP`,"prog.daily_done":`✅ Daily challenge completed!`,"prog.next_daily":`Next daily in {time}`,"game1.title":`Aaj Ka Shabd`,"game1.desc":`Guess the secret daily word`,"game2.title":`Aaj Ki Niti`,"game2.desc":`Daily thoughtful reflection and contemplation`,"game3.title":`Super Over`,"game3.desc":`Super Over · 6 balls of high-octane drama`,"game4.title":`Carrom`,"game4.desc":`Precision trick shots & pocket puzzles`,"game5.title":`Jodo`,"game5.desc":`Connect matching items and knowledge nodes`,"game6.title":`Super Over`,"game6.desc":`Super Over · 6 balls of high-octane drama`,"gameover.title":`Game Over!`,"gameover.great":`Great job! 🎉`,"gameover.score":`Your Score`,"gameover.best_score":`Best Score`,"gameover.new_best":`🏆 New Best!`,"gameover.play_again":`Play Again`,"gameover.home":`Home`,"gameover.share_text":`I scored {score} in {game} on Dainik Bhaskar Game Lab! 🎮`},hi:{"common.play":`खेलें`,"common.back":`वापस`,"common.close":`बंद करें`,"common.save":`सहेजें`,"common.cancel":`रद्द करें`,"common.ok":`ठीक है`,"common.loading":`लोड हो रहा है…`,"common.retry":`पुनः प्रयास`,"common.share":`शेयर करें`,"common.score":`स्कोर`,"common.best":`सर्वश्रेष्ठ`,"common.rank":`रैंक`,"common.today":`आज`,"common.daily":`दैनिक`,"common.new":`नया`,"common.coming_soon":`जल्द आ रहा है`,"common.rules":`नियम`,"hub.title":`गेम लैब`,"hub.daily_tagline":`थोड़ा खेल, हर रोज़।`,"hub.torch_hint":`हर रोज़ खेलें, मशाल जलाए रखें।`,"opening.brand":`दैनिक भास्कर गेम्स`,"opening.slogan":`खबर से खेल तक, खेल से समझ तक।`,"opening.caption":`पाँच खेल। पाँच मूड। हर दिन कुछ नया।`,"opening.start":`खेल चुनें`,"opening.replay":`शुरुआती एनिमेशन फिर देखें`,"hub.greeting":`आज के लिए एक मूड चुनें 👋`,"hub.daily_challenge":`दैनिक चुनौती`,"hub.all_games":`सभी गेम्स`,"hub.your_stats":`आपके आँकड़े`,"hub.view_all":`सभी देखें`,"hub.game_label":`गेम {num}`,"hub.done":`पूर्ण`,"hub.left":`बाकी है`,"day.mon":`सोम`,"day.tue":`मंगल`,"day.wed":`बुध`,"day.thu":`गुरु`,"day.fri":`शुक्र`,"day.sat":`शनि`,"day.sun":`रवि`,"mood.curiosity":`जिज्ञासा`,"mood.excitement":`रोमांच`,"mood.discovery":`खोज`,"mood.thinking":`रणनीति`,"mood.nostalgia":`यादें`,"mood.wisdom":`चिंतन`,"mood.focus":`एकाग्रता`,"tag.word_puzzle":`शब्द पहेली`,"tag.daily_thought":`दैनिक विचार`,"tag.cricket":`क्रिकेट`,"tag.carrom":`कैरम पहेली`,"tag.matching":`जोड़ो`,"tag.action_flick":`एक्शन मुकाबला`,"tag.visual_quiz":`दृष्टि परख`,"tag.strategy":`रणनीति`,"tag.seven_stones":`सात पत्थर`,"nav.home":`होम`,"nav.leaderboard":`रैंकिंग`,"nav.profile":`प्रोफ़ाइल`,"nav.settings":`सेटिंग्स`,"nav.news":`समाचार`,"profile.preferences":`आपकी सेटिंग्स`,"lb.title":`लीडरबोर्ड`,"lb.daily":`दैनिक`,"lb.weekly":`साप्ताहिक`,"lb.alltime":`सभी समय`,"lb.your_rank":`आपकी रैंक`,"lb.no_scores":`अभी तक कोई स्कोर नहीं। खेलें!`,"lb.points":`अंक`,"profile.title":`प्रोफ़ाइल`,"profile.level":`लेवल`,"profile.xp":`एक्सपी`,"profile.streak":`स्ट्रीक`,"profile.games_played":`खेले गए गेम`,"profile.total_score":`कुल स्कोर`,"profile.achievements":`उपलब्धियाँ`,"profile.days":`दिन`,"profile.no_achievements":`उपलब्धियाँ अर्जित करने के लिए खेलें!`,"settings.title":`सेटिंग्स`,"settings.language":`भाषा`,"settings.sound":`ध्वनि प्रभाव`,"settings.music":`संगीत`,"settings.haptics":`हैप्टिक्स`,"settings.reset":`प्रगति रीसेट करें`,"settings.reset_confirm":`यह आपकी सारी प्रगति मिटा देगा। क्या आप सुनिश्चित हैं?`,"settings.about":`जानकारी`,"settings.version":`संस्करण`,"prog.streak_fire":`🔥 {count} दिन की स्ट्रीक!`,"prog.streak_lost":`स्ट्रीक टूट गई! आज से नई शुरुआत करें।`,"prog.level_up":`🎉 लेवल अप! अब आप लेवल {level} पर हैं!`,"prog.xp_gained":`+{amount} एक्सपी`,"prog.daily_done":`✅ दैनिक चुनौती पूरी!`,"prog.next_daily":`अगली दैनिक चुनौती {time} में`,"game1.title":`आज का शब्द`,"game1.desc":`दैनिक गुप्त शब्द का अनुमान लगाएँ`,"game2.title":`आज की नीति`,"game2.desc":`शांत दैनिक विचार पूर्ति और जीवन दर्शन`,"game3.title":`सुपर ओवर`,"game3.desc":`6 गेंदों का रोमांचक क्रिकेट मुकाबला`,"game4.title":`कैरम`,"game4.desc":`सटीक स्ट्राइक से सिक्के पॉकेट करें`,"game5.title":`जोड़ो`,"game5.desc":`तथ्यों और ज्ञान को आपस में जोड़ें`,"game6.title":`सुपर ओवर`,"game6.desc":`6 गेंदों का रोमांचक क्रिकेट मुकाबला`,"gameover.title":`गेम ओवर!`,"gameover.great":`बहुत बढ़िया! 🎉`,"gameover.score":`आपका स्कोर`,"gameover.best_score":`सर्वश्रेष्ठ स्कोर`,"gameover.new_best":`🏆 नया रिकॉर्ड!`,"gameover.play_again":`फिर से खेलें`,"gameover.home":`होम`,"gameover.share_text":`मैंने दैनिक भास्कर गेम लैब पर {game} में {score} स्कोर किए! 🎮`}},r=new class{constructor(){this._listeners=new Map}on(e,t){return this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),()=>this.off(e,t)}once(e,t){let n=(...r)=>{this.off(e,n),t(...r)};return this.on(e,n)}off(e,t){let n=this._listeners.get(e);n&&(n.delete(t),n.size===0&&this._listeners.delete(e))}emit(e,t){let n=this._listeners.get(e);if(n)for(let r of n)try{r(t)}catch(t){console.error(`[EventBus] Error in listener for "${e}":`,t)}}clear(){this._listeners.clear()}},i={LANG_CHANGED:`lang:changed`,NAVIGATE:`nav:navigate`,SCREEN_ENTERED:`nav:screen:entered`,SCREEN_EXITED:`nav:screen:exited`,GAME_LOADED:`game:loaded`,GAME_STARTED:`game:started`,GAME_PAUSED:`game:paused`,GAME_RESUMED:`game:resumed`,GAME_ENDED:`game:ended`,GAME_SCORE_UPDATE:`game:score:update`,STREAK_UPDATED:`progression:streak`,XP_GAINED:`progression:xp`,LEVEL_UP:`progression:levelup`,DAILY_COMPLETED:`progression:daily:complete`,LB_SCORE_SUBMITTED:`leaderboard:submitted`,LB_REFRESHED:`leaderboard:refreshed`,ACHIEVEMENT_UNLOCK:`engagement:achievement`,SHARE_RESULT:`engagement:share`,TOAST_SHOW:`ui:toast:show`,MODAL_OPEN:`ui:modal:open`,MODAL_CLOSE:`ui:modal:close`},a=new Map,o=e=>JSON.parse(JSON.stringify(e));function s(e,t=null){return a.has(e)?o(a.get(e)):t}function c(e,t){a.set(e,o(t))}function l(e){a.delete(e)}function u(e){return a.has(e)}function d(){return[...a.keys()]}function f(){a.clear()}function p(e,t){return u(e)||c(e,t),s(e)}function ee(e,t){let n={...s(e,{}),...t};return c(e,n),n}var m={get:s,set:c,remove:l,has:u,keys:d,clearAll:f,getOrInit:p,merge:ee},h=`lang`,g=[`en`,`hi`],_=`hi`,v=_;function te(){let e=m.get(h);e&&g.includes(e)&&(v=e),document.documentElement.lang=v}function y(){return v}function ne(e){if(!g.includes(e)){console.warn(`[i18n] Unsupported language: ${e}`);return}e!==v&&(v=e,m.set(h,e),document.documentElement.lang=e,r.emit(i.LANG_CHANGED,{lang:e}))}function re(){ne(v===`en`?`hi`:`en`)}function b(e,t={}){let r=(n[v]||n[_])[e];if(r===void 0&&(r=n.en[e],r===void 0))return console.warn(`[i18n] Missing key: "${e}"`),e;if(t&&typeof t==`object`)for(let[e,n]of Object.entries(t))r=r.replace(RegExp(`\\{${e}\\}`,`g`),String(n));return r}function ie(e=document){let t=e.querySelectorAll(`[data-i18n]`);for(let e of t){let t=e.getAttribute(`data-i18n`);t&&(e.textContent=b(t))}let n=e.querySelectorAll(`[data-i18n-placeholder]`);for(let e of n){let t=e.getAttribute(`data-i18n-placeholder`);t&&(e.placeholder=b(t))}let r=e.querySelectorAll(`[data-i18n-aria]`);for(let e of r){let t=e.getAttribute(`data-i18n-aria`);t&&e.setAttribute(`aria-label`,b(t))}}var x=`audio:sfx`,ae=`audio:music`,S=null,C=!0,w=!0,oe={tap:{freq:600,duration:.06,type:`sine`,gain:.15},success:{freq:880,duration:.15,type:`sine`,gain:.2,sweep:1200},error:{freq:200,duration:.2,type:`sawtooth`,gain:.1},levelup:{freq:523,duration:.3,type:`sine`,gain:.2,sweep:1046},score:{freq:700,duration:.08,type:`sine`,gain:.12},streak:{freq:440,duration:.25,type:`sine`,gain:.18,sweep:880},gameover:{freq:400,duration:.4,type:`triangle`,gain:.15,sweep:150},click:{freq:1e3,duration:.04,type:`square`,gain:.08}};function se(){C=m.get(x,!0),w=m.get(ae,!0)}function ce(){return S||=new(window.AudioContext||window.webkitAudioContext),S.state===`suspended`&&S.resume(),S}function T(e){if(!C)return;let t=oe[e];if(t)try{let e=ce(),n=e.createOscillator(),r=e.createGain();n.type=t.type,n.frequency.setValueAtTime(t.freq,e.currentTime),t.sweep&&n.frequency.linearRampToValueAtTime(t.sweep,e.currentTime+t.duration),r.gain.setValueAtTime(t.gain,e.currentTime),r.gain.exponentialRampToValueAtTime(.001,e.currentTime+t.duration),n.connect(r),r.connect(e.destination),n.start(e.currentTime),n.stop(e.currentTime+t.duration+.05)}catch{}}function le(){return C}function ue(){return w}function de(e){C=e,m.set(x,e)}function fe(e){w=e,m.set(ae,e)}var E=`leaderboard`;function pe(e){let t=[`Aarav`,`Priya`,`Rohan`,`Sneha`,`Vikram`,`Ananya`,`Arjun`,`Kavya`,`Rajesh`,`Meera`,`Siddharth`,`Pooja`,`Aditya`,`Nisha`,`Kiran`,`Rahul`,`Deepika`,`Amit`,`Sunita`,`Varun`];return t.map((n,r)=>({id:`dummy-${r}`,name:n,score:Math.floor(Math.random()*800+200)*(t.length-r),gameId:e,date:new Date().toISOString(),period:`daily`})).sort((e,t)=>t.score-e.score)}function me(e,t=`daily`,n=20){let r=m.get(E,{}),i=`${e}:${t}`,a=r[i];return(!a||a.length===0)&&(a=pe(e),r[i]=a,m.set(E,r)),a.slice(0,n)}function he(e,t,n){let a=m.get(E,{}),o=[`daily`,`weekly`,`alltime`],s=1/0,c=!1;for(let r of o){let i=`${e}:${r}`;a[i]||(a[i]=pe(e));let o=a[i].find(e=>e.id===`player`);(!o||n>o.score)&&(c=!0),a[i]=a[i].filter(e=>e.id!==`player`),a[i].push({id:`player`,name:t,score:n,gameId:e,date:new Date().toISOString(),period:r}),a[i].sort((e,t)=>t.score-e.score);let l=a[i].findIndex(e=>e.id===`player`)+1;s=Math.min(s,l)}return m.set(E,a),r.emit(i.LB_SCORE_SUBMITTED,{gameId:e,playerName:t,score:n,rank:s,isNewBest:c}),{rank:s,isNewBest:c}}function ge(e,t=`daily`){let n=me(e,t,100).findIndex(e=>e.id===`player`);return n>=0?n+1:null}function _e(e){let t=me(e,`alltime`,100).find(e=>e.id===`player`);return t?t.score:0}function ve(){let e=m.get(E,{});for(let t of Object.keys(e))t.endsWith(`:daily`)&&delete e[t];m.set(E,e)}function ye(){let e=m.get(`lb:last_daily_reset`,``),t=new Date().toISOString().split(`T`)[0];e!==t&&(ve(),m.set(`lb:last_daily_reset`,t))}var D=`progression`,O=[0,100,300,600,1e3,1500,2200,3e3,4e3,5200,6600,8200,1e4,12e3,14500,17500,21e3,25e3,3e4,36e3],k={GAME_PLAYED:10,GAME_COMPLETED:25,DAILY_COMPLETED:50,HIGH_SCORE:40,STREAK_BONUS_BASE:15};function be(){let e=window.DBJamDemo.priorStreak,t=new Date(window.DBJamDemo.date);t.setDate(t.getDate()-1);let n={};for(let r=0;r<e;r++){let e=new Date(t);e.setDate(e.getDate()-r),n[e.toISOString().split(`T`)[0]]=!0}return{xp:0,level:1,streak:e,longestStreak:e,lastPlayDate:t.toISOString().split(`T`)[0],gamesPlayed:0,totalScore:0,dailyCompleted:{},dailyHistory:n}}function A(){let e=m.getOrInit(D,be());if(e.dailyHistory||={},e.dailyCompleted||={},e.lastPlayDate&&e.streak>0&&Object.keys(e.dailyHistory).length===0){let t=new Date(e.lastPlayDate);for(let n=0;n<Math.min(e.streak,7);n++){let r=new Date(t);r.setDate(t.getDate()-n),e.dailyHistory[r.toISOString().split(`T`)[0]]=!0}}return e}function j(e){m.set(D,e)}function M(){return window.DBJamDemo.date.split(`T`)[0]}function xe(){let e=new Date(window.DBJamDemo.date);return e.setDate(e.getDate()-1),e.toISOString().split(`T`)[0]}function Se(){let e=A(),t=M();return e.lastPlayDate===t?(e.dailyHistory||={},e.dailyHistory[t]=!0,j(e),e.streak):(e.lastPlayDate===xe()?e.streak+=1:(e.lastPlayDate&&e.lastPlayDate!==t&&r.emit(i.STREAK_UPDATED,{streak:0,lost:!0}),e.streak=1),e.lastPlayDate=t,e.longestStreak=Math.max(e.longestStreak,e.streak),e.dailyHistory||={},e.dailyHistory[t]=!0,j(e),r.emit(i.STREAK_UPDATED,{streak:e.streak,lost:!1}),e.streak)}function N(e,t=``){let n=A();n.xp+=e;let a=n.level;for(let e=O.length-1;e>=0;e--)if(n.xp>=O[e]){n.level=e+1;break}return j(n),r.emit(i.XP_GAINED,{amount:e,total:n.xp,reason:t}),n.level>a&&r.emit(i.LEVEL_UP,{level:n.level,prevLevel:a}),{xp:n.xp,level:n.level,leveledUp:n.level>a}}function Ce(e){let t=A(),n=M();t.dailyHistory||={},t.dailyHistory[n]=!0,t.dailyCompleted||={},t.dailyCompleted[e]=!0,t.lastPlayDate=n,j(t),r.emit(i.DAILY_COMPLETED,{gameId:e})}function we(e,t,n=!0){let a=A(),o=M();a.gamesPlayed+=1,a.totalScore+=t,a.lastPlayDate=o,a.dailyHistory||={},a.dailyHistory[o]=!0,a.dailyCompleted||={},a.dailyCompleted[e]=!0,j(a),N(k.GAME_PLAYED,`game_played`),N(k.GAME_COMPLETED,`game_completed`),a.streak>1&&N(k.STREAK_BONUS_BASE*a.streak,`streak_bonus`),n&&(N(k.DAILY_COMPLETED,`daily_completed`),r.emit(i.DAILY_COMPLETED,{gameId:e}))}function Te(e){let t=A();return!!(t.dailyCompleted&&t.dailyCompleted[e])}function Ee(){let e=A(),t=O[e.level-1]||0,n=O[e.level]||O[O.length-1]+5e3,r=(e.xp-t)/(n-t);return{current:e.xp-t,next:n-t,progress:Math.min(Math.max(r,0),1)}}function De(){let e=A(),t=M();m.get(`prog:last_daily_reset`,``)!==t&&(e.dailyCompleted={},j(e),m.set(`prog:last_daily_reset`,t))}function Oe(){m.set(D,be())}var P=null;function ke(){P=document.createElement(`div`),P.className=`toast-container`,document.body.appendChild(P),r.on(i.TOAST_SHOW,Ae)}function Ae({message:e,icon:t=`ℹ️`,duration:n=3e3}){if(!P)return;let r=document.createElement(`div`);r.className=`toast`,r.innerHTML=`
    <span class="toast__icon">${t}</span>
    <span class="toast__message">${e}</span>
  `,P.appendChild(r),T(`tap`),setTimeout(()=>{r.classList.add(`exit`),r.addEventListener(`animationend`,()=>r.remove())},n)}var F=null,I=null;function je(){F=document.createElement(`div`),F.className=`modal-overlay`,F.innerHTML=`
    <div class="modal" id="global-modal">
      <div class="modal__handle"></div>
      <div class="modal__header">
        <h3 class="modal__title" id="modal-title"></h3>
        <button class="modal__close" id="modal-close-btn">✕</button>
      </div>
      <div class="modal__body" id="modal-body"></div>
    </div>
  `,document.body.appendChild(F),F.addEventListener(`click`,e=>{e.target===F&&R()}),F.querySelector(`#modal-close-btn`).addEventListener(`click`,R),r.on(i.MODAL_OPEN,L),r.on(i.MODAL_CLOSE,R)}function L({title:e,content:t,onClose:n,theme:r}){if(!F)return;let i=F.querySelector(`#global-modal`);r?i.dataset.gameTheme=r:delete i.dataset.gameTheme,document.getElementById(`modal-title`).textContent=e;let a=document.getElementById(`modal-body`);a.innerHTML=``,typeof t==`string`?a.innerHTML=t:t instanceof HTMLElement&&a.appendChild(t),I=n||null,F.classList.add(`open`),T(`tap`)}function R(){F&&(F.classList.remove(`open`),I&&=(I(),null))}function z({title:e,showBack:t=!1,onBack:n,action:r}){return`
    <div class="screen-header">
      ${t?`<button class="screen-header__back" data-action="back">←</button>`:``}
      <h1 class="screen-header__title">${e}</h1>
      ${r?`<button class="screen-header__action" data-action="header-action">${r.label}</button>`:``}
    </div>
  `}function B(e,{onBack:t,action:n}){let r=e.querySelector(`[data-action="back"]`);r&&t&&r.addEventListener(`click`,()=>{T(`tap`),t()});let i=e.querySelector(`[data-action="header-action"]`);i&&n?.onClick&&i.addEventListener(`click`,()=>{T(`tap`),n.onClick()})}function V(e=`home`){let t={home:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,leaderboard:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,profile:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,settings:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`};return`<nav class="bottom-nav">${[{id:`home`,icon:t.home,labelKey:`nav.home`,route:`/`},{id:`leaderboard`,icon:t.leaderboard,labelKey:`nav.leaderboard`,route:`/leaderboard`},{id:`profile`,icon:t.profile,labelKey:`nav.profile`,route:`/profile`},{id:`news`,icon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 7h10M7 11h4v5H7zM14 11h3M14 15h3M7 19h10"/></svg>`,labelKey:`nav.news`,route:`./news.html`}].map(t=>`
    <button class="bottom-nav__item ${t.id===e?`active`:``}"
            data-nav-route="${t.route}" data-nav-id="${t.id}">
      <span class="bottom-nav__icon">${t.icon}</span>
      <span data-i18n="${t.labelKey}">${b(t.labelKey)}</span>
    </button>
  `).join(``)}</nav>`}function H(e,t){let n=e.querySelectorAll(`[data-nav-route]`);for(let e of n)e.addEventListener(`click`,()=>{T(`click`),e.dataset.navId===`news`?window.location.assign(`./news.html?day=${window.DBJamDemo?.day||`d1`}`):t(e.dataset.navRoute)})}function Me({score:e,bestScore:t,isNewBest:n,rank:r,gameTitle:i,theme:a,onPlayAgain:o,onHome:s,onShare:c}){let l=document.createElement(`div`);l.style.textAlign=`center`,l.innerHTML=`
    <div style="font-size: 3rem; margin-bottom: var(--space-4);">
      ${n?`🏆`:`🎉`}
    </div>
    <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-black); margin-bottom: var(--space-2);">
      ${b(`gameover.title`)}
    </h2>
    <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">${b(`gameover.great`)}</p>

    <div class="stats-row" style="margin-bottom: var(--space-6);">
      <div class="stat-item">
        <div class="stat-item__value text-gradient-warm">${e}</div>
        <div class="stat-item__label">${b(`gameover.score`)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-item__value text-gradient">${t}</div>
        <div class="stat-item__label">${b(`gameover.best_score`)}</div>
      </div>
      ${r?`
      <div class="stat-item">
        <div class="stat-item__value" style="color: var(--color-accent-warm);">#${r}</div>
        <div class="stat-item__label">${b(`common.rank`)}</div>
      </div>
      `:``}
    </div>

    ${n?`
    <div class="badge badge--warning" style="margin-bottom: var(--space-4); padding: var(--space-2) var(--space-4); font-size: var(--text-base);">
      ${b(`gameover.new_best`)}
    </div>
    `:``}

    <div style="display: flex; flex-direction: column; gap: var(--space-3);">
      <button class="btn btn--primary btn--full btn--lg" id="go-play-again">${b(`gameover.play_again`)}</button>
      <div style="display: flex; gap: var(--space-3);">
        <button class="btn btn--secondary" style="flex:1;" id="go-home">${b(`gameover.home`)}</button>
        <button class="btn btn--secondary" style="flex:1;" id="go-share">📤 ${b(`common.share`)}</button>
      </div>
    </div>
  `,L({title:``,content:l,theme:a}),l.querySelector(`#go-play-again`)?.addEventListener(`click`,()=>{R(),o?.()}),l.querySelector(`#go-home`)?.addEventListener(`click`,()=>{R(),s?.()}),l.querySelector(`#go-share`)?.addEventListener(`click`,()=>{c?.()})}var Ne=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="शब्द की टाइलें खुलती हैं">\r
  <style>.tile{transform-box:fill-box;transform-origin:center;animation:flip 2.4s ease both}.wordalB{animation-delay:.16s}.wordalC{animation-delay:.32s}@keyframes flip{0%,15%{transform:scaleY(.12);opacity:.25}35%,100%{transform:scaleY(1);opacity:1}}@media(prefers-reduced-motion:reduce){.tile{animation:none}}</style>\r
  <rect x="5" y="5" width="90" height="90" rx="24" fill="#eef0ff"/>\r
  <g class="tile"><rect x="14" y="30" width="22" height="34" rx="6" fill="#4f46e5"/><text x="25" y="54" text-anchor="middle" fill="white" font-size="19" font-family="Nirmala UI,sans-serif">ख</text></g>\r
  <g class="tile wordalB"><rect x="39" y="30" width="22" height="34" rx="6" fill="#6366f1"/><text x="50" y="54" text-anchor="middle" fill="white" font-size="19" font-family="Nirmala UI,sans-serif">ब</text></g>\r
  <g class="tile wordalC"><rect x="64" y="30" width="22" height="34" rx="6" fill="#27ae60"/><text x="75" y="54" text-anchor="middle" fill="white" font-size="19" font-family="Nirmala UI,sans-serif">र</text></g>\r
  <path d="m42 76 6 6 12-13" fill="none" stroke="#27ae60" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>\r
</svg>\r
`,Pe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 150" aria-hidden="true" fill="none">
<path d="M27 150 Q27 120 55 117 H89 Q119 126 120 150" fill="#bd7846"/><path d="M60 103 H82 L88 126 Q72 139 53 124Z" fill="#b78556"/>
<path d="M39 61 Q32 24 70 23 Q105 26 103 59 L96 86 L46 88Z" fill="#493c30"/><path d="M79 29 Q107 4 120 22 Q109 24 109 37 Q109 54 94 55" fill="#493c30"/><ellipse cx="70" cy="77" rx="30" ry="38" fill="#cf9e68"/><path d="M43 64 Q45 38 69 38 Q90 38 98 61 L97 50 Q90 26 65 32 Q40 34 39 61Z" fill="#493c30"/>
<path d="M51 73 L59 72 M80 72 L88 73" stroke="#493c30" stroke-width="3" stroke-linecap="round"/><path d="M69 76 L65 89 L73 89 M60 100 Q70 104 79 99" stroke="#886044" stroke-width="2" stroke-linecap="round"/><path d="M65 49 L75 49 M65 54 L75 54" stroke="#a54c36" stroke-width="2"/></svg>
`,Fe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="बल्ले से गेंद उड़ती है">\r
  <style>.bat{transform-origin:49px 59px;animation:swing 2.4s ease both}.ball{animation:flight 2.4s ease both}@keyframes swing{0%,20%{transform:rotate(-20deg)}42%,65%{transform:rotate(28deg)}100%{transform:rotate(0)}}@keyframes flight{0%,24%{transform:translate(-25px,20px);opacity:0}30%{opacity:1}50%,100%{transform:translate(20px,-30px);opacity:1}}@media(prefers-reduced-motion:reduce){.bat,.ball{animation:none}}</style>\r
  <rect x="5" y="5" width="90" height="90" rx="24" fill="#e5f6ee"/><path d="M18 78h64" stroke="#a7d9bf" stroke-width="4" stroke-linecap="round"/>\r
  <g class="bat" transform="rotate(25 49 59)"><rect x="44" y="17" width="9" height="25" rx="3" fill="#065f46"/><rect x="37" y="38" width="23" height="40" rx="5" fill="#e7b57c"/><path d="M43 44v27" stroke="#fff0cf" stroke-width="3"/></g>\r
  <g class="ball"><circle cx="60" cy="48" r="8" fill="#e23a28"/><path d="M58 41q6 7 0 14" fill="none" stroke="#fff" stroke-width="1.5"/></g>\r
</svg>\r
`,Ie=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="कैरम की गोटी पॉकेट में जाती है">\r
  <style>.coin{animation:pocket 2.4s ease both}.striker{animation:shot 2.4s ease both}@keyframes pocket{0%,30%{transform:translate(0,0)}65%,100%{transform:translate(27px,-27px);opacity:.15}}@keyframes shot{0%,20%{transform:translate(0,0)}50%,100%{transform:translate(21px,-21px)}}@media(prefers-reduced-motion:reduce){.coin,.striker{animation:none}}</style>\r
  <rect x="5" y="5" width="90" height="90" rx="24" fill="#fff0f3"/><rect x="17" y="17" width="66" height="66" rx="9" fill="#f3d6af" stroke="#9f1239" stroke-width="5"/>\r
  <g fill="#4b2830"><circle cx="24" cy="24" r="5"/><circle cx="76" cy="24" r="5"/><circle cx="24" cy="76" r="5"/><circle cx="76" cy="76" r="5"/></g>\r
  <circle cx="50" cy="50" r="12" fill="none" stroke="#c18b62" stroke-width="1.5"/><circle class="coin" cx="49" cy="51" r="5" fill="#e23a28"/><circle class="striker" cx="30" cy="69" r="7" fill="#fffdf5" stroke="#9f1239" stroke-width="2"/>\r
</svg>\r
`,Le=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="दो कार्डों के बीच जोड़ी जुड़ती है">\r
  <style>.link{stroke-dasharray:45;stroke-dashoffset:45;animation:join 2.4s ease both}.jodoB{animation-delay:.3s}@keyframes join{0%,20%{stroke-dashoffset:45}65%,100%{stroke-dashoffset:0}}@media(prefers-reduced-motion:reduce){.link{animation:none;stroke-dashoffset:0}}</style>\r
  <rect x="5" y="5" width="90" height="90" rx="24" fill="#eaf1ff"/>\r
  <g fill="white" stroke="#2563eb" stroke-width="2"><rect x="17" y="25" width="25" height="20" rx="6"/><rect x="17" y="55" width="25" height="20" rx="6"/><rect x="58" y="25" width="25" height="20" rx="6"/><rect x="58" y="55" width="25" height="20" rx="6"/></g>\r
  <path class="link" d="M42 35C55 35 45 65 58 65" fill="none" stroke="#2563eb" stroke-width="3"/><path class="link jodoB" d="M42 65C55 65 45 35 58 35" fill="none" stroke="#27ae60" stroke-width="3"/>\r
  <g fill="#2563eb"><circle cx="29" cy="35" r="4"/><circle cx="70" cy="65" r="4"/></g><g fill="#27ae60"><circle cx="29" cy="65" r="4"/><circle cx="70" cy="35" r="4"/></g>\r
</svg>\r
`;function Re(){let e=[Ne,Pe,Fe,Ie,Le];return`<h1 class="opening-brand">${b(`opening.brand`)}</h1>
    <div class="opening-games" aria-hidden="true">${e.map((e,t)=>`<div class="opening-game" style="--intro-order:${t}">${e}</div>`).join(``)}</div>
    <p class="opening-caption">${b(`opening.caption`)}</p>`}function ze(e,t){if(!e){t();return}let n=!1,r;e.classList.add(`opening-screen`),e.innerHTML=`<div class="opening-content">${Re()}</div>`,r=setTimeout(()=>{n||(n=!0,clearTimeout(r),e.classList.add(`fade-out`),setTimeout(()=>e.remove(),350),t())},window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?800:2600)}var U=new Map,Be=null,W=null,G=[];function K(e,t){U.set(e,t)}function Ve(e){W=e,window.addEventListener(`hashchange`,()=>{Ue(He())}),Ue(He())}function q(e,t={}){J=t,window.location.hash=`#${e}`}var J={};function He(){return window.location.hash.slice(1)||`/`}function Ue(e){if(!W)return;let t=U.get(e),n={...J};if(!t)for(let[r,i]of U){let a=We(r,e);if(a){t=i,n={...n,...a};break}}if(!t){if(console.warn(`[Router] No route registered for: ${e}`),t=U.get(`/`),!t)return;e=`/`}let a=Be;Be=e,G[G.length-1]!==e&&(G.push(e),G.length>20&&G.shift()),a&&r.emit(i.SCREEN_EXITED,{route:a});let o=W.querySelectorAll(`.screen.active`);for(let e of o)e.classList.remove(`active`),e.classList.add(`exit-left`),e.addEventListener(`transitionend`,()=>{e.classList.contains(`active`)||e.remove()},{once:!0}),setTimeout(()=>{e.classList.contains(`active`)||e.remove()},400);let s=document.createElement(`div`);s.className=`screen`,s.id=`screen-${e.replace(/\//g,`-`).replace(/^-/,``)}`,W.appendChild(s);try{t(s,n)}catch(t){console.error(`[Router] Error rendering route "${e}":`,t),s.innerHTML=`<div class="screen-body"><div class="empty-state"><div class="empty-state__icon">⚠️</div><div class="empty-state__title">Something went wrong</div></div></div>`}requestAnimationFrame(()=>{requestAnimationFrame(()=>{s.classList.add(`active`)})}),J={},r.emit(i.SCREEN_ENTERED,{route:e,params:n}),r.emit(i.NAVIGATE,{route:e,params:n,prevRoute:a})}function We(e,t){let n=e.split(`/`),r=t.split(`/`);if(n.length!==r.length)return null;let i={};for(let e=0;e<n.length;e++)if(n[e].startsWith(`:`))i[n[e].slice(1)]=r[e];else if(n[e]!==r[e])return null;return i}var Y=new Map;function X(e){Y.set(e.id,e)}function Ge(e){return Y.get(e)}function Ke(){return[...Y.values()]}function qe(e){return`/${e}?day=${encodeURIComponent(window.DBJamDemo.day)}`}var Je=new Set;function Ye(e){if(!e||navigator.connection?.saveData)return;let t=qe(e);if(Je.has(t))return;Je.add(t);let n=document.createElement(`link`);n.rel=`prefetch`,n.as=`document`,n.href=t,document.head.appendChild(n)}function Xe(e){e.classList.add(`screen--no-scroll`,`hub-screen`);let t=A(),n=y(),r=(e,t=`0 0 140 140`)=>`<svg viewBox="`+t+`" fill="none" aria-hidden="true">`+e+`</svg>`,i=r(`<g transform="rotate(-12 70 70)"><rect x="20" y="35" width="49" height="49" rx="6" fill="#faf8f1" stroke="#827391" stroke-width="2"/><rect x="76" y="35" width="49" height="49" rx="6" fill="#c1b3d1" stroke="#827391" stroke-width="2"/><rect x="20" y="91" width="49" height="49" rx="6" fill="#c1b3d1" stroke="#827391" stroke-width="2"/><rect x="76" y="91" width="49" height="49" rx="6" fill="#faf8f1" stroke="#827391" stroke-width="2"/><g fill="#51415e" font-family="Noto Sans Devanagari, sans-serif" font-size="30" text-anchor="middle"><text x="44" y="72">अ</text><text x="100" y="72">क</text><text x="44" y="129">र</text><text x="100" y="129">म</text></g></g>`),a=Pe,o=r(`<path d="M19 110 Q37 43 117 33" stroke="#849d7c" stroke-width="2" stroke-dasharray="5 6"/><g transform="rotate(35 75 77)"><rect x="66" y="14" width="13" height="44" rx="3" fill="#526f5c"/><rect x="57" y="51" width="31" height="71" rx="6" fill="#d9bb83" stroke="#846d48" stroke-width="2"/><path d="M63 58 L63 110 M82 58 L82 110" stroke="#baa071" stroke-width="2"/><rect x="61" y="70" width="23" height="15" fill="#526f5c"/></g><circle cx="109" cy="107" r="24" fill="#a94b3f" stroke="#733e36" stroke-width="2"/><path d="M96 87 Q95 109 120 127 M100 85 Q100 109 124 123" stroke="#f0d6bc" stroke-width="2" stroke-dasharray="3 3"/>`),s=r(`<g transform="rotate(-12 75 80)"><rect x="15" y="15" width="132" height="132" rx="8" fill="#ae7f59" stroke="#795c43" stroke-width="3"/><rect x="25" y="25" width="112" height="112" rx="3" fill="#f4e4c2"/><circle cx="35" cy="35" r="10" fill="#473c32"/><circle cx="127" cy="35" r="10" fill="#473c32"/><circle cx="35" cy="127" r="10" fill="#473c32"/><path d="M48 42 L114 42 M42 48 L42 114" stroke="#9c604b" stroke-width="2"/><circle cx="81" cy="81" r="20" stroke="#9c604b" stroke-width="2"/><circle cx="81" cy="81" r="8" fill="#b95c4c"/><circle cx="55" cy="104" r="12" fill="#fff9e9" stroke="#a8906d" stroke-width="2"/><circle cx="110" cy="91" r="8" fill="#473c32"/><circle cx="104" cy="112" r="8" fill="#b95c4c"/></g>`),c=r(`<g transform="rotate(-8 70 70)"><path d="M44 49 C91 49 49 105 96 105" stroke="#597762" stroke-width="5"/><path d="M44 105 C91 105 49 49 96 49" stroke="#647e9e" stroke-width="5"/><g fill="#faf8f1" stroke="#8394aa" stroke-width="2"><rect x="7" y="30" width="37" height="38" rx="8"/><rect x="96" y="30" width="37" height="38" rx="8"/><rect x="7" y="86" width="37" height="38" rx="8"/><rect x="96" y="86" width="37" height="38" rx="8"/></g><path d="m25 40 9 9-9 9-9-9Z" fill="#597762"/><path d="m114 96 9 9-9 9-9-9Z" fill="#597762"/><circle cx="25" cy="105" r="9" fill="#647e9e"/><circle cx="114" cy="49" r="9" fill="#647e9e"/></g>`),l=[{num:1,id:`wordal`,titleKey:`game1.title`,moodKey:`mood.curiosity`,cardClass:`card-game-1`,artIcon:i},{num:2,id:`niti`,titleKey:`game2.title`,moodKey:`mood.wisdom`,cardClass:`card-game-2`,artIcon:a},{num:3,id:`cricket`,titleKey:`game3.title`,moodKey:`mood.excitement`,cardClass:`card-game-3`,artIcon:o},{num:4,id:`carrom`,titleKey:`game4.title`,moodKey:`mood.focus`,cardClass:`card-game-4`,artIcon:s},{num:5,id:`jodo`,titleKey:`game5.title`,moodKey:`mood.discovery`,cardClass:`card-game-5`,artIcon:c}],u=[{key:`day.mon`,en:`MON`,hi:`सोम`},{key:`day.tue`,en:`TUE`,hi:`मंगल`},{key:`day.wed`,en:`WED`,hi:`बुध`},{key:`day.thu`,en:`THU`,hi:`गुरु`},{key:`day.fri`,en:`FRI`,hi:`शुक्र`},{key:`day.sat`,en:`SAT`,hi:`शनि`},{key:`day.sun`,en:`SUN`,hi:`रवि`}],d=new Date(window.DBJamDemo.date),f=(d.getDay()+6)%7,p=new Date(d);p.setDate(d.getDate()-f);let ee=u.map((e,r)=>{let i=new Date(p);i.setDate(p.getDate()+r);let a=i.toISOString().split(`T`)[0],o=r===f,s=r<f,c=!!(t.dailyHistory&&t.dailyHistory[a]);o?(t.dailyCompleted&&Object.values(t.dailyCompleted).some(Boolean)||t.lastPlayDate===a)&&(c=!0):s&&!c&&t.streak>0&&Math.floor((d-i)/864e5)<=t.streak&&(c=!0);let l=n===`hi`?e.hi:e.en;return`
      <div class="weekly-day-col ${o?`is-today`:``}">
        <span class="weekly-day-label">${l}</span>
        <div class="weekly-day-dot ${c?`done`:``} ${o?`today-dot`:``}">
          ${c?`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`:``}
        </div>
      </div>
    `}).join(``),m=n===`hi`?[`शब्द पहचानें`,`सोचें और चुनें`,`छह गेंदों का रोमांच`,`निशाना लगाएं`,`कड़ियां खोजें`]:[`Find the word`,`Think and choose`,`Six balls. Your shot.`,`Aim your striker`,`Find the connections`];function h(e){let t=Te(e.id);return`
      <button type="button" class="game-bento-card ${e.cardClass}" data-game-id="${e.id}" aria-label="${b(e.titleKey)}${t?` — `+b(`hub.done`):``}">
        <span class="card-bottom-info">
          <span class="card-game-title">${b(e.titleKey)}</span>
          <span class="card-description">${m[e.num-1]}</span>
        </span>
        <span class="card-art-float">${e.artIcon}</span>
        ${t?`<span class="game-status-dot" title="`+b(`hub.done`)+`"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg></span>`:``}
      </button>
    `}let g=h,_=l.find(e=>e.num===1),v=l.find(e=>e.num===2),te=l.find(e=>e.num===3),ne=l.find(e=>e.num===4),ie=l.find(e=>e.num===5);e.innerHTML=`
    <div class="bento-container">
      <div class="bento-header">
        <h1 class="hub-tagline">${b(`hub.daily_tagline`)}</h1>
        <div class="hub-header-pill" title="${b(`hub.torch_hint`)}" aria-label="${n===`hi`?t.streak+` दिन की स्ट्रीक। `:t.streak+` day streak. `}${b(`hub.torch_hint`)}">
          <svg viewBox="0 0 24 36" fill="none" aria-hidden="true"><path d="M13 1 C18 8 10 9 18 12 C23 17 19 23 12 23 C4 23 1 16 6 11 C6 17 12 12 13 1Z" fill="#bc6238"/><path d="M12 12 C14 16 17 16 15 20 C13 23 8 21 9 18Z" fill="#f1c773"/><path d="M6 23 H18 L15 27 H9Z" fill="#8a7150"/><path d="M9 27 H15 L14 35 H10Z" fill="#62533f"/></svg>
          ${t.streak}
        </div>
        <button type="button" class="hub-replay" id="hub-replay" aria-label="${b(`opening.replay`)}" title="${b(`opening.replay`)}">↻</button>
        <button type="button" class="hub-icon-circle-btn" id="hub-lang-toggle" aria-label="${n===`hi`?`Switch to English`:`हिन्दी में बदलें`}">${n===`hi`?`EN`:`हिं`}</button>
      </div>

      <!-- Weekly Day Tracker (MON - SON) -->
      <div class="weekly-tracker-wrap">
        <div class="weekly-tracker-card">
          ${ee}
        </div>
      </div>

      <!-- 5 Games Bento Grid Area -->
      <div class="bento-games-area">
        <!-- Top Section (Left: Game 1 & Game 3 stacked, Right: Game 2 tall) -->
        <div class="bento-row-top">
          <div class="bento-col-left">
            ${h(_)}
            ${h(te)}
          </div>
          ${g(v)}
        </div>

        <!-- Bottom Section (Left: Game 4 wide, Right: Game 5) -->
        <div class="bento-row-bottom">
          ${h(ne)}
          ${h(ie)}
        </div>
      </div>
    </div>
    ${V(`home`)}
  `,e.querySelectorAll(`.game-bento-card`).forEach(e=>{let t=()=>Ye(Ge(e.dataset.gameId)?.htmlFile);e.addEventListener(`pointerenter`,t,{once:!0}),e.addEventListener(`pointerdown`,t,{once:!0,passive:!0}),e.addEventListener(`click`,()=>{T(`tap`),q(`/game/`+e.dataset.gameId)})});let x=e.querySelector(`#hub-lang-toggle`);x&&x.addEventListener(`click`,()=>{re(),T(`tap`),Xe(e)}),e.querySelector(`#hub-replay`).addEventListener(`click`,()=>{let t=document.createElement(`div`);t.className=`loading-screen`,e.appendChild(t),ze(t,()=>e.querySelector(`#hub-replay`)?.focus())}),H(e,q)}function Ze(e){let t=Ke(),n=t[0]?.id||``,r=`daily`,i=me(n,r),a=ge(n,r);e.innerHTML=`
    ${z({title:b(`lb.title`)})}
    
    <div class="screen-body" style="padding-top: var(--space-2); display: flex; flex-direction: column;">
      
      <!-- Period Selector -->
      <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
        <button class="btn btn--primary btn--sm" style="flex: 1;">${b(`lb.daily`)}</button>
        <button class="btn btn--secondary btn--sm" style="flex: 1;">${b(`lb.weekly`)}</button>
        <button class="btn btn--secondary btn--sm" style="flex: 1;">${b(`lb.alltime`)}</button>
      </div>

      <!-- Game Selector (Placeholder) -->
      <div style="margin-bottom: var(--space-4);">
        <select class="btn btn--secondary" style="width: 100%; text-align: left; padding: var(--space-3); border-radius: var(--radius-md);">
          ${t.map(e=>`<option value="${e.id}">${b(e.titleKey)}</option>`).join(``)}
        </select>
      </div>

      <!-- Player Rank Banner -->
      ${a?`
      <div style="margin-bottom: var(--space-4); padding: var(--space-3); background: var(--gradient-brand); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: var(--weight-bold);">${b(`lb.your_rank`)}</span>
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
              <div class="lb-item__score">${e.score} <span style="font-size: var(--text-xs); color: var(--text-tertiary);">${b(`lb.points`)}</span></div>
            </div>
          `}).join(``):`
          <div class="empty-state">
            <div class="empty-state__icon">🏆</div>
            <div class="empty-state__title">${b(`lb.no_scores`)}</div>
          </div>
        `}
      </div>
      
      <div style="height: var(--space-8);"></div>
    </div>

    ${V(`leaderboard`)}
  `,B(e,{}),H(e,q)}var Z=`achievements`,Qe=[{id:`first_game`,icon:`🎮`,titleKey:`ach.first_game`,descKey:`ach.first_game_desc`,check:e=>e.gamesPlayed>=1},{id:`streak_3`,icon:`🔥`,titleKey:`ach.streak_3`,descKey:`ach.streak_3_desc`,check:e=>e.longestStreak>=3},{id:`streak_7`,icon:`⚡`,titleKey:`ach.streak_7`,descKey:`ach.streak_7_desc`,check:e=>e.longestStreak>=7},{id:`streak_30`,icon:`👑`,titleKey:`ach.streak_30`,descKey:`ach.streak_30_desc`,check:e=>e.longestStreak>=30},{id:`level_5`,icon:`⭐`,titleKey:`ach.level_5`,descKey:`ach.level_5_desc`,check:e=>e.level>=5},{id:`level_10`,icon:`🌟`,titleKey:`ach.level_10`,descKey:`ach.level_10_desc`,check:e=>e.level>=10},{id:`games_10`,icon:`🏅`,titleKey:`ach.games_10`,descKey:`ach.games_10_desc`,check:e=>e.gamesPlayed>=10},{id:`games_50`,icon:`🏆`,titleKey:`ach.games_50`,descKey:`ach.games_50_desc`,check:e=>e.gamesPlayed>=50},{id:`score_1000`,icon:`💎`,titleKey:`ach.score_1000`,descKey:`ach.score_1000_desc`,check:e=>e.totalScore>=1e3},{id:`score_10000`,icon:`💰`,titleKey:`ach.score_10000`,descKey:`ach.score_10000_desc`,check:e=>e.totalScore>=1e4},{id:`all_daily`,icon:`✨`,titleKey:`ach.all_daily`,descKey:`ach.all_daily_desc`,check:e=>Object.keys(e.dailyCompleted||{}).length>=5}];function $e(){return Qe}function et(){let e=m.get(Z,[]);return new Set(e)}function tt(e){let t=et(),n=[];for(let a of Qe)!t.has(a.id)&&a.check(e)&&(t.add(a.id),n.push(a),r.emit(i.ACHIEVEMENT_UNLOCK,{achievement:a}));return n.length>0&&m.set(Z,[...t]),n}async function nt({gameTitle:e,score:t,url:n=window.location.href}){let a=b(`gameover.share_text`,{score:t,game:e});if(navigator.share)try{return await navigator.share({title:`Dainik Bhaskar Game Lab`,text:a,url:n}),r.emit(i.SHARE_RESULT,{gameTitle:e,score:t,method:`native`}),!0}catch{}try{return await navigator.clipboard.writeText(`${a}\n${n}`),r.emit(i.SHARE_RESULT,{gameTitle:e,score:t,method:`clipboard`}),r.emit(i.TOAST_SHOW,{message:`Copied to clipboard! 📋`,icon:`📋`}),!0}catch{return!1}}function rt(){m.set(Z,[])}function it(e,{embedded:t=!1,onChange:n}={}){let r=y();e.innerHTML=`
    ${t?``:z({title:b(`settings.title`)})}
    
    <div class="screen-body" style="padding-top: var(--space-4);">
      
      <!-- Language -->
      <div class="card" style="margin-bottom: var(--space-4);">
        <div class="card__body" style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: var(--text-base); font-weight: var(--weight-semibold);">${b(`settings.language`)}</div>
          </div>
          <div class="lang-switch">
            <button class="lang-switch__option ${r===`en`?`active`:``}" data-lang="en">English</button>
            <button class="lang-switch__option ${r===`hi`?`active`:``}" data-lang="hi">हिंदी</button>
          </div>
        </div>
      </div>

      <!-- Audio -->
      <div class="card" style="margin-bottom: var(--space-4);">
        <div class="card__body" style="display: flex; flex-direction: column; gap: var(--space-4);">
          
          <div class="toggle" id="toggle-sfx">
            <div style="flex: 1;">
              <div class="toggle__label">${b(`settings.sound`)}</div>
            </div>
            <div class="toggle__track ${le()?`active`:``}">
              <div class="toggle__thumb"></div>
            </div>
          </div>
          
          <div class="divider" style="margin: 0;"></div>
          
          <div class="toggle" id="toggle-music">
            <div style="flex: 1;">
              <div class="toggle__label">${b(`settings.music`)}</div>
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
            ⚠️ ${b(`settings.reset`)}
          </button>
        </div>
      </div>

      <!-- About -->
      <div style="text-align: center; color: var(--text-tertiary); font-size: var(--text-xs);">
        <p>${b(`hub.title`)} - ${b(`settings.about`)}</p>
        <p>${b(`settings.version`)} 1.0.0</p>
      </div>

    </div>

    ${t?``:V(`profile`)}
  `,B(e,{}),H(e,q),e.querySelectorAll(`.lang-switch__option`).forEach(r=>{r.addEventListener(`click`,()=>{r.dataset.lang!==y()&&(re(),T(`tap`),n?n():it(e,{embedded:t}))})});let i=e.querySelector(`#toggle-sfx`);i.addEventListener(`click`,()=>{let e=i.querySelector(`.toggle__track`),t=!e.classList.contains(`active`);de(t),t?e.classList.add(`active`):e.classList.remove(`active`),t&&T(`tap`)});let a=e.querySelector(`#toggle-music`);a.addEventListener(`click`,()=>{let e=a.querySelector(`.toggle__track`),t=!e.classList.contains(`active`);fe(t),t?e.classList.add(`active`):e.classList.remove(`active`),T(`tap`)}),e.querySelector(`#btn-reset`).addEventListener(`click`,()=>{T(`click`),L({title:`Warning`,content:`
        <div style="text-align: center;">
          <p style="margin-bottom: var(--space-6);">${b(`settings.reset_confirm`)}</p>
          <div style="display: flex; gap: var(--space-3);">
            <button class="btn btn--secondary" style="flex:1;" id="reset-cancel">${b(`common.cancel`)}</button>
            <button class="btn btn--danger" style="flex:1;" id="reset-confirm">${b(`settings.reset`)}</button>
          </div>
        </div>
      `}),setTimeout(()=>{document.getElementById(`reset-cancel`)?.addEventListener(`click`,()=>{R()}),document.getElementById(`reset-confirm`)?.addEventListener(`click`,()=>{Oe(),rt(),R(),Ae({message:`Progress reset`,icon:`🗑️`}),setTimeout(()=>q(`/`),1e3)})},100)})}function at(e){let t=A();Ee();let n=$e(),r=et();e.innerHTML=`
    ${z({title:b(`profile.title`)})}
    
    <div class="screen-body" style="padding-top: var(--space-4); display: flex; flex-direction: column;">
      
      <!-- User Profile Header -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-3); margin-bottom: var(--space-8);">
        <div class="avatar avatar--xl" style="box-shadow: var(--shadow-glow);">P</div>
        <div style="text-align: center;">
          <h2 style="font-size: var(--text-2xl); font-weight: var(--weight-bold);">Player</h2>
          <div class="badge badge--primary" style="margin-top: var(--space-1);">${b(`profile.level`)} ${t.level}</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-8);">
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-accent-warm);">${t.longestStreak}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">Max Streak (${b(`profile.days`)})</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-primary-light);">${t.gamesPlayed}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">${b(`profile.games_played`)}</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-success);">${t.xp}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">Total ${b(`profile.xp`)}</div>
          </div>
        </div>
        <div class="card card--glass">
          <div class="card__body" style="text-align: center; padding: var(--space-4) var(--space-2);">
            <div style="font-size: var(--text-2xl); font-weight: var(--weight-extrabold); color: var(--color-info);">${t.totalScore}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">${b(`profile.total_score`)}</div>
          </div>
        </div>
      </div>

      <section aria-labelledby="profile-settings-title" style="margin-bottom:var(--space-6)">
        <h3 id="profile-settings-title" class="section-header__title">${b(`profile.preferences`)}</h3>
        <div id="profile-settings"></div>
      </section>

      <!-- Achievements -->
      <div class="section-header">
        <h3 class="section-header__title">${b(`profile.achievements`)} <span style="font-size: var(--text-base); color: var(--text-secondary); font-weight: normal;">(${r.size}/${n.length})</span></h3>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        ${n.map(e=>{let t=r.has(e.id);return`
            <div style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3) var(--space-4); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); opacity: ${t?`1`:`0.4`}; filter: ${t?`none`:`grayscale(1)`};">
              <div style="font-size: 2rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface-raised); border-radius: var(--radius-full); flex-shrink: 0;">
                ${e.icon}
              </div>
              <div>
                <div style="font-size: var(--text-base); font-weight: var(--weight-bold);">${b(e.titleKey)}</div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary);">${b(e.descKey)}</div>
              </div>
            </div>
          `}).join(``)}
      </div>

      <div style="height: var(--space-8);"></div>
    </div>

    ${V(`profile`)}
  `,B(e,{}),H(e,q),it(e.querySelector(`#profile-settings`),{embedded:!0,onChange:()=>at(e)})}var Q=null;function ot(e,t){let n=t.id,r=Ge(n);if(!r){e.innerHTML=`
      <div class="screen-body empty-state">
        <div class="empty-state__icon">⚠️</div>
        <div class="empty-state__title">Game Not Found</div>
        <button class="btn btn--primary" id="gp-back" style="margin-top: var(--space-4);">${b(`common.back`)}</button>
      </div>
    `,e.querySelector(`#gp-back`).addEventListener(`click`,()=>q(`/`));return}e.innerHTML=``;try{Q=r.create(e),Q.init()}catch(t){console.error(`[GamePlayer] Error starting game ${n}:`,t),e.innerHTML=`<div class="screen-body empty-state">Error loading game.</div>`}}r.on(i.SCREEN_EXITED,({route:e})=>{e.startsWith(`/game/`)&&Q&&(Q.destroy(),Q=null)});var st=class{constructor(e,t){this.container=e,this.config=t,this.id=t.id,this.titleKey=t.titleKey,this.icon=t.icon,this.score=0,this.isRunning=!1,this.isPaused=!1,this.startTime=null,this._gameArea=document.createElement(`div`),this._gameArea.className=`game-area`,this._gameArea.style.cssText=`
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    `,this._cleanupFns=[]}async init(){let e={neeti:`niti`,superover:`cricket`,carrom_puzzles:`carrom`};this.theme=e[this.id]||this.id,this.container.classList.add(`game-player`),this.container.dataset.gameTheme=this.theme;let t=y()===`hi`;this.container.innerHTML=`
      <header class="family-header">
        <button type="button" class="family-header__back" id="game-back-btn" aria-label="${b(`common.back`)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12"/></svg>
        </button>
        <div class="family-header__identity">
          <span class="family-header__brand">${t?`भास्कर खेल`:`Bhaskar Games`}</span>
          <h1 class="family-header__title">${b(this.titleKey)}</h1>
        </div>
        <button type="button" class="family-header__help" id="game-rules-btn" aria-label="${t?`कैसे खेलें`:`How to play`}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.3 2.3 0 0 1 4.5.8c0 1.5-2.3 1.5-2.3 3M12 16h.01"/></svg>
          ${t?`कैसे खेलें`:`How to play`}
        </button>
      </header>
    `,this.container.appendChild(this._gameArea),this.container.querySelector(`#game-back-btn`).addEventListener(`click`,()=>{this.destroy(),q(`/`)});let n=this.container.querySelector(`#game-rules-btn`);n&&n.addEventListener(`click`,()=>{this.showRules()});let a=()=>{document.hidden&&this.isRunning&&!this.isPaused?this.pause():!document.hidden&&this.isRunning&&this.isPaused&&this.resume()};document.addEventListener(`visibilitychange`,a),this._cleanupFns.push(()=>document.removeEventListener(`visibilitychange`,a)),r.emit(i.GAME_LOADED,{gameId:this.id})}showRules(){typeof this.onRulesClick==`function`&&this.onRulesClick()}start(){this.score=0,this.isRunning=!0,this.isPaused=!1,this.startTime=Date.now(),this._updateScoreDisplay(),Se(),Ce(this.id),r.emit(i.GAME_STARTED,{gameId:this.id}),T(`success`)}pause(){this.isRunning&&!this.isPaused&&(this.isPaused=!0,r.emit(i.GAME_PAUSED,{gameId:this.id}))}resume(){this.isRunning&&this.isPaused&&(this.isPaused=!1,r.emit(i.GAME_RESUMED,{gameId:this.id}))}end(e){if(!this.isRunning)return;let t=e??this.score;this.isRunning=!1,this.isPaused=!1;let n=_e(this.id),{rank:a,isNewBest:o}=he(this.id,`Player`,t);we(this.id,t,!0),tt(A()),this.config.ownsResultScreen||T(o?`levelup`:`gameover`),r.emit(i.GAME_ENDED,{gameId:this.id,score:t,rank:a,isNewBest:o}),!this.config.ownsResultScreen&&Me({score:t,bestScore:o?t:n,isNewBest:o,rank:a,gameTitle:b(this.titleKey),theme:this.theme,onPlayAgain:()=>{this._gameArea.innerHTML=``,this.start(),this.onStart()},onHome:()=>{this.destroy(),q(`/`)},onShare:()=>{nt({gameTitle:b(this.titleKey),score:t})}})}addScore(e){this.score+=e,this._updateScoreDisplay(),r.emit(i.GAME_SCORE_UPDATE,{gameId:this.id,score:this.score}),T(`score`)}_updateScoreDisplay(){let e=this.container.querySelector(`#game-score-value`);e&&(e.textContent=this.score)}getGameArea(){return this._gameArea}destroy(){this.isRunning=!1,this.isPaused=!1;for(let e of this._cleanupFns)try{e()}catch{}this._cleanupFns=[]}onStart(){}},$=class extends st{constructor(e,t){super(e,{ownsResultScreen:!0,...t})}async init(){await super.init();let n=()=>{this._introCleanup?.(),this._introCleanup=null,this.start(),this.onStart()};t(this.id)?(this._introCleanup=e(this.getGameArea(),this.id,{onPlay:n,lang:y()}),this._cleanupFns.push(()=>this._introCleanup?.())):n()}onStart(){let e=this.getGameArea();e.innerHTML=`
      <iframe src="${qe(this.config.htmlFile)}" style="width: 100%; height: 100%; border: none;" id="game-iframe-${this.id}"></iframe>
    `;let t={startGame:()=>{this.isRunning||this.start()},addScore:e=>this.addScore(e),endGame:e=>this.end(e)};window.DBGameLab=t;let n=e.querySelector(`iframe`);n.onload=()=>{try{n.contentWindow&&(n.contentWindow.DBGameLab=t)}catch(e){console.warn(`Could not inject DBGameLab object into iframe:`,e)}};let r=e=>{if(e.data){if(e.data.type===`GAME_COMPLETE`||e.data.type===`GAME_OVER`){let t=typeof e.data.score==`number`?e.data.score:100;this.end(t)}else e.data.type===`ADD_SCORE`&&this.addScore(e.data.points||10)}};window.addEventListener(`message`,r),this._cleanupFns.push(()=>{window.removeEventListener(`message`,r),window.DBGameLab===t&&delete window.DBGameLab})}onRulesClick(){let e=this.getGameArea();if(this._introCleanup){e.querySelector(`.gi-play`)?.focus();return}let t=e.querySelector(`iframe`);if(t)try{t.contentWindow&&(typeof t.contentWindow.openHelpModal==`function`?t.contentWindow.openHelpModal():t.contentWindow.postMessage({type:`OPEN_RULES`},window.location.origin))}catch(e){console.warn(`Could not trigger rules in iframe:`,e)}}};X({id:`wordal`,titleKey:`game1.title`,descKey:`game1.desc`,icon:`🔤`,color:`#6aaa64`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`wordal.html`,create:e=>new $(e,{id:`wordal`,titleKey:`game1.title`,icon:`🔤`,htmlFile:`wordal.html`})}),X({id:`niti`,titleKey:`game2.title`,descKey:`game2.desc`,icon:`📜`,color:`#D35400`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`niti.html`,create:e=>new $(e,{id:`niti`,titleKey:`game2.title`,icon:`📜`,htmlFile:`niti.html`})}),X({id:`neeti`,titleKey:`game2.title`,descKey:`game2.desc`,icon:`📜`,color:`#D35400`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`niti.html`,create:e=>new $(e,{id:`neeti`,titleKey:`game2.title`,icon:`📜`,htmlFile:`niti.html`})}),X({id:`cricket`,titleKey:`game3.title`,descKey:`game3.desc`,icon:`🏏`,color:`#059669`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`Superover.html`,create:e=>new $(e,{id:`cricket`,titleKey:`game3.title`,icon:`🏏`,htmlFile:`Superover.html`,ownsResultScreen:!0})}),X({id:`superover`,titleKey:`game3.title`,descKey:`game3.desc`,icon:`🏏`,color:`#059669`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`Superover.html`,create:e=>new $(e,{id:`superover`,titleKey:`game3.title`,icon:`🏏`,htmlFile:`Superover.html`,ownsResultScreen:!0})}),X({id:`carrom`,titleKey:`game4.title`,descKey:`game4.desc`,icon:`🎯`,color:`#BE123C`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`Carrom_Puzzles.html`,create:e=>new $(e,{id:`carrom`,titleKey:`game4.title`,icon:`🎯`,htmlFile:`Carrom_Puzzles.html`,ownsResultScreen:!0})}),X({id:`carrom_puzzles`,titleKey:`game4.title`,descKey:`game4.desc`,icon:`🎯`,color:`#BE123C`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`Carrom_Puzzles.html`,create:e=>new $(e,{id:`carrom_puzzles`,titleKey:`game4.title`,icon:`🎯`,htmlFile:`Carrom_Puzzles.html`,ownsResultScreen:!0})}),X({id:`jodo`,titleKey:`game5.title`,descKey:`game5.desc`,icon:`🧩`,color:`#2563EB`,hasDailyChallenge:!0,comingSoon:!1,htmlFile:`jodo.html`,create:e=>new $(e,{id:`jodo`,titleKey:`game5.title`,icon:`🧩`,htmlFile:`jodo.html`,ownsResultScreen:!0})});async function ct(){te(),se(),ye(),De(),ke(),je(),K(`/`,Xe),K(`/leaderboard`,Ze),K(`/profile`,at),K(`/settings`,at),K(`/game/:id`,ot);let e=document.getElementById(`loading-screen`),t=document.getElementById(`app-root`);ze(e,()=>{Ve(t),ie()})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,ct):ct();