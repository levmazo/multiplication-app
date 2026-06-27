// === Тренажёр таблицы умножения ===
// Числа 0..12, оба множителя (169 примеров). 3×5 и 5×3 — разные задачи.
//
// Уровни:
//   1. ×0 и ×1   2. ×2 и ×3   3. ×4 и ×5   4. ×6 и ×7
//   5. ×8 и ×9   6. ×10, ×11, ×12
//   +  Свой выбор (засчитывается в прогресс)
//   +  Случайный набор (2 случайные таблицы; засчитывается в прогресс)
//   +  Диктант (открыт, когда выучен хотя бы один уровень)
//
// Выучено = 3 правильных ПОДРЯД. Неправильный ответ сбрасывает счётчик в 0.
// Таймера нет — вместо него в конце показывается потраченное и среднее время.
// Интерфейс на 3 языках: RU / NL / EN (кнопка ⚙ Язык в главном меню).

const MIN = 0;
const MAX = 12;
const NEED_STREAK = 3;
const REDO_COOLDOWN = 5 * 60 * 1000;

// =================== ПЕРЕВОДЫ ===================
const STR = {
  ru: {
    langBtn: '⚙ Language', menuTitle: '✖️ Таблица умножения', learnedTotal: 'Выучено всего:',
    of: 'из', chooseLevel: 'Выбери уровень:', resetAll: 'Сбросить весь прогресс',
    backMenu: '← В меню', back: '← Назад',
    optionsHint: '…но можете сделать ещё раз.', optNoRepeat: 'Не повторять',
    optViewAnswers: 'Посмотреть ответы', optRedo: 'Сделать заново',
    customTitle: 'Свой выбор', customHint: 'Отметь, что хочешь тренировать:', start: 'Начать',
    randomTitle: '🎲 Случайный набор', randomHint: 'Будешь умножать на эти числа:',
    reroll: '🎲 Другие две цифры', learned: 'Выучено:', correctLbl: 'Верно:', wrongLbl: 'Ошибок:',
    answerBtn: 'Ответить', pause: '⏸ Пауза', resume: '▶ Начать снова', menuBtn: 'В меню',
    winCorrectLbl: 'Верных ответов:',
    levelSub: 'Уровень {n}', levelTitlePrefix: 'Уровень {n}: ', done: '✓ готово',
    learnedX: 'выучено {d}/{t}', dictName: 'Диктант', dictControl: 'контрольная',
    dictLocked: 'Пройди уровень', randName: 'Случайный набор', randTap: 'нажми',
    chooseAtLeastOne: 'Отметь хотя бы одно!',
    fbMastered: '✅ Верно! Выучено! ({a}×{b}={r})',
    fbStreak: '✅ Верно! Подряд: {s}/{n} (осталось {left})',
    fbWrong: '❌ Неверно. {a}×{b}={r}. Счётчик сброшен.',
    dictCorrect: '✅ Верно!', dictRemember: '❌ Запомнил: {a}×{b}={r}',
    finishLevel: '🎉 Уровень пройден!', finishRandom: '🎉 Набор пройден!', finishRedo: '🎉 Повтор пройден!',
    allLearnedHere: 'Здесь уже всё выучено! 🎉', progressReset: 'Прогресс сброшен. Начинаем заново!',
    dictNeedLevel: 'Сначала выучи хотя бы один уровень целиком — тогда откроется диктант.',
    dictNeedLevelShort: 'Сначала выучи хотя бы один уровень.',
    resultsCount: '✅ Правильных: {c}   ❌ Неправильных: {w}',
    timeLine: '⏱ Потрачено ~{tot} сек · в среднем ~{avg} сек на пример',
    redoCooldown: 'Ты смотрел ответы — подожди ещё ~{min} мин, потом можно заново.',
    viewAnswersTitle: 'Ответы — уровень {n}', optionsAlreadyDone: 'Уровень {n} уже пройден',
    yourAnswers: 'Твои ответы', dictTitle: 'Диктант', dictRedoTitle: 'Диктант: повтор по ошибкам',
    dictLearnTitle: 'Учим ошибки диктанта (3 подряд)', randomSessionTitle: 'Случайный набор: ×{list}',
    winDictTitle: '🎉 Диктант сдан!', winDictText: 'Ты прошёл диктант без ошибок!',
    rightAns: 'верно: {r}',
  },
  nl: {
    langBtn: '⚙ Language', menuTitle: '✖️ vermenigvuldigen', learnedTotal: 'In totaal geleerd:',
    of: 'van', chooseLevel: 'Kies een niveau:', resetAll: 'Alle voortgang wissen',
    backMenu: '← Naar menu', back: '← Terug',
    optionsHint: '…maar je kunt het nog een keer doen.', optNoRepeat: 'Niet herhalen',
    optViewAnswers: 'Antwoorden bekijken', optRedo: 'Opnieuw doen',
    customTitle: 'Eigen keuze', customHint: 'Vink aan wat je wilt oefenen:', start: 'Starten',
    randomTitle: '🎲 Willekeurige set', randomHint: 'Je gaat met deze getallen vermenigvuldigen:',
    reroll: '🎲 Twee andere getallen', learned: 'Geleerd:', correctLbl: 'Goed:', wrongLbl: 'Fout:',
    answerBtn: 'Antwoorden', pause: '⏸ Pauze', resume: '▶ Verdergaan', menuBtn: 'Naar menu',
    winCorrectLbl: 'Goede antwoorden:',
    levelSub: 'Niveau {n}', levelTitlePrefix: 'Niveau {n}: ', done: '✓ klaar',
    learnedX: 'geleerd {d}/{t}', dictName: 'Dictee', dictControl: 'toets',
    dictLocked: 'Doe een niveau', randName: 'Willekeurige set', randTap: 'klik',
    chooseAtLeastOne: 'Kies er minstens één!',
    fbMastered: '✅ Goed! Geleerd! ({a}×{b}={r})',
    fbStreak: '✅ Goed! Op rij: {s}/{n} (nog {left})',
    fbWrong: '❌ Fout. {a}×{b}={r}. Teller terug naar nul.',
    dictCorrect: '✅ Goed!', dictRemember: '❌ Onthouden: {a}×{b}={r}',
    finishLevel: '🎉 Niveau gehaald!', finishRandom: '🎉 Set gehaald!', finishRedo: '🎉 Herhaling gehaald!',
    allLearnedHere: 'Hier is alles al geleerd! 🎉', progressReset: 'Voortgang gewist. We beginnen opnieuw!',
    dictNeedLevel: 'Leer eerst minstens één heel niveau — dan gaat het dictee open.',
    dictNeedLevelShort: 'Leer eerst minstens één niveau.',
    resultsCount: '✅ Goed: {c}   ❌ Fout: {w}',
    timeLine: '⏱ Gebruikt ~{tot} sec · gemiddeld ~{avg} sec per som',
    redoCooldown: 'Je hebt de antwoorden bekeken — wacht nog ~{min} min, dan kan het opnieuw.',
    viewAnswersTitle: 'Antwoorden — niveau {n}', optionsAlreadyDone: 'Niveau {n} is al gehaald',
    yourAnswers: 'Jouw antwoorden', dictTitle: 'Dictee', dictRedoTitle: 'Dictee: fouten herhalen',
    dictLearnTitle: 'Fouten van het dictee leren (3 op rij)', randomSessionTitle: 'Willekeurige set: ×{list}',
    winDictTitle: '🎉 Dictee gehaald!', winDictText: 'Je hebt het dictee zonder fouten gedaan!',
    rightAns: 'goed: {r}',
  },
  en: {
    langBtn: '⚙ Language', menuTitle: '✖️ Multiplication table', learnedTotal: 'Learned in total:',
    of: 'of', chooseLevel: 'Choose a level:', resetAll: 'Reset all progress',
    backMenu: '← To menu', back: '← Back',
    optionsHint: '…but you can do it again.', optNoRepeat: "Don't repeat",
    optViewAnswers: 'View answers', optRedo: 'Do again',
    customTitle: 'Your choice', customHint: 'Check what you want to practice:', start: 'Start',
    randomTitle: '🎲 Random set', randomHint: "You'll multiply by these numbers:",
    reroll: '🎲 Two other numbers', learned: 'Learned:', correctLbl: 'Correct:', wrongLbl: 'Mistakes:',
    answerBtn: 'Answer', pause: '⏸ Pause', resume: '▶ Resume', menuBtn: 'To menu',
    winCorrectLbl: 'Correct answers:',
    levelSub: 'Level {n}', levelTitlePrefix: 'Level {n}: ', done: '✓ done',
    learnedX: 'learned {d}/{t}', dictName: 'Dictation', dictControl: 'test',
    dictLocked: 'Finish a level', randName: 'Random set', randTap: 'click',
    chooseAtLeastOne: 'Pick at least one!',
    fbMastered: '✅ Correct! Learned! ({a}×{b}={r})',
    fbStreak: '✅ Correct! In a row: {s}/{n} ({left} left)',
    fbWrong: '❌ Wrong. {a}×{b}={r}. Counter reset.',
    dictCorrect: '✅ Correct!', dictRemember: '❌ Noted: {a}×{b}={r}',
    finishLevel: '🎉 Level complete!', finishRandom: '🎉 Set complete!', finishRedo: '🎉 Replay complete!',
    allLearnedHere: 'Everything here is already learned! 🎉', progressReset: 'Progress reset. Starting over!',
    dictNeedLevel: 'First learn at least one full level — then the dictation opens.',
    dictNeedLevelShort: 'First learn at least one level.',
    resultsCount: '✅ Correct: {c}   ❌ Wrong: {w}',
    timeLine: '⏱ Spent ~{tot} sec · about ~{avg} sec per problem',
    redoCooldown: 'You looked at the answers — wait ~{min} more min, then you can redo.',
    viewAnswersTitle: 'Answers — level {n}', optionsAlreadyDone: 'Level {n} is already done',
    yourAnswers: 'Your answers', dictTitle: 'Dictation', dictRedoTitle: 'Dictation: redo mistakes',
    dictLearnTitle: 'Learning dictation mistakes (3 in a row)', randomSessionTitle: 'Random set: ×{list}',
    winDictTitle: '🎉 Dictation passed!', winDictText: 'You passed the dictation with no mistakes!',
    rightAns: 'correct: {r}',
  },
};
let lang = 'ru';
function t(k, p) {
  let s = (STR[lang] && STR[lang][k]) != null ? STR[lang][k] : (STR.ru[k] != null ? STR.ru[k] : k);
  if (p) for (const key in p) s = s.split('{' + key + '}').join(p[key]);
  return s;
}

// --- Все задачи ---
const facts = [];
const factByKey = {};
function key(a, b) { return a + 'x' + b; }
for (let a = MIN; a <= MAX; a++) {
  for (let b = MIN; b <= MAX; b++) {
    const f = { a, b, streak: 0, mastered: false };
    facts.push(f);
    factByKey[key(a, b)] = f;
  }
}
function twin(f) { return factByKey[key(f.b, f.a)]; }

// --- Уровни (по множителям) ---
const LEVELS = [
  { factors: [0, 1] },
  { factors: [2, 3] },
  { factors: [4, 5] },
  { factors: [6, 7] },
  { factors: [8, 9] },
  { factors: [10, 11, 12] },
];
function factorLabel(factors) { return '×' + factors.join(', ×'); }

// --- Состояние ---
let correctCount = 0;
let wrongCount = 0;
let mode = null;          // 'session' | 'dictTest' | null
let session = null;
let dict = null;
let current = null;
let answering = false;
let paused = false;
let qStartTime = 0;
let pendingLevel = null;
let randomChosen = [];
let msgTimer = null;      // таймер авто-скрытия сообщения внизу меню

let lastResults = {};
let answersViewedAt = {};

// --- Элементы ---
const el = {
  menuScreen: document.getElementById('menu-screen'),
  langBtn: document.getElementById('langBtn'),
  langMenu: document.getElementById('langMenu'),
  overallMastered: document.getElementById('overallMastered'),
  overallTotal: document.getElementById('overallTotal'),
  levelMessage: document.getElementById('levelMessage'),
  levelButtons: document.getElementById('levelButtons'),
  resetAllBtn: document.getElementById('resetAllBtn'),
  optionsScreen: document.getElementById('options-screen'),
  optionsTitle: document.getElementById('optionsTitle'),
  optionsMessage: document.getElementById('optionsMessage'),
  optionsBackBtn: document.getElementById('optionsBackBtn'),
  optNoRepeat: document.getElementById('optNoRepeat'),
  optViewAnswers: document.getElementById('optViewAnswers'),
  optRedo: document.getElementById('optRedo'),
  customScreen: document.getElementById('custom-screen'),
  customChecks: document.getElementById('customChecks'),
  customStartBtn: document.getElementById('customStartBtn'),
  customBackBtn: document.getElementById('customBackBtn'),
  randomScreen: document.getElementById('random-screen'),
  randomNumbers: document.getElementById('randomNumbers'),
  randomRerollBtn: document.getElementById('randomRerollBtn'),
  randomStartBtn: document.getElementById('randomStartBtn'),
  randomBackBtn: document.getElementById('randomBackBtn'),
  gameScreen: document.getElementById('game-screen'),
  backBtn: document.getElementById('backBtn'),
  levelTitle: document.getElementById('levelTitle'),
  mastered: document.getElementById('mastered'),
  total: document.getElementById('total'),
  correct: document.getElementById('correct'),
  wrong: document.getElementById('wrong'),
  question: document.getElementById('question'),
  answer: document.getElementById('answer'),
  form: document.getElementById('answerForm'),
  submitBtn: document.getElementById('submitBtn'),
  feedback: document.getElementById('feedback'),
  pauseBtn: document.getElementById('pauseBtn'),
  resultsScreen: document.getElementById('results-screen'),
  resultsTitle: document.getElementById('resultsTitle'),
  resultsSummary: document.getElementById('resultsSummary'),
  resultsTime: document.getElementById('resultsTime'),
  resultsList: document.getElementById('resultsList'),
  resultsMenuBtn: document.getElementById('resultsMenuBtn'),
  winScreen: document.getElementById('win-screen'),
  winTitle: document.getElementById('winTitle'),
  winText: document.getElementById('winText'),
  winCorrect: document.getElementById('winCorrect'),
  winWrong: document.getElementById('winWrong'),
  winTime: document.getElementById('winTime'),
  winMenuBtn: document.getElementById('winMenuBtn'),
};

el.overallTotal.textContent = facts.length;

// =================== ЯЗЫК ===================
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(elm => {
    elm.textContent = t(elm.getAttribute('data-i18n'));
  });
  if (!paused) el.pauseBtn.textContent = t('pause');
  renderMenu();
}
function setLang(l) {
  lang = l;
  try { localStorage.setItem('mult_lang', l); } catch (e) { /* нет доступа */ }
  el.langMenu.classList.add('hidden');
  if (msgTimer) { clearTimeout(msgTimer); msgTimer = null; }
  el.levelMessage.textContent = '';
  applyLang();
}
function loadLang() {
  try { lang = localStorage.getItem('mult_lang') || 'ru'; } catch (e) { lang = 'ru'; }
  if (!STR[lang]) lang = 'ru';
}

// --- Кнопка «Ответить» активна только если введена хотя бы одна цифра ---
function updateSubmitState() {
  el.submitBtn.disabled = el.answer.disabled || el.answer.value.trim() === '';
}
el.answer.addEventListener('input', updateSubmitState);

// --- Сохранение прогресса ---
const SAVE_KEY = 'mult_progress';
function saveState() {
  const data = { facts: {}, results: lastResults, viewed: answersViewedAt };
  facts.forEach(f => { data.facts[key(f.a, f.b)] = { s: f.streak, m: f.mastered }; });
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { /* нет доступа */ }
}
function loadState() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { data = null; }
  if (!data) return;
  lastResults = data.results || {};
  answersViewedAt = data.viewed || {};
  if (data.facts) {
    facts.forEach(f => {
      const s = data.facts[key(f.a, f.b)];
      if (s) { f.streak = s.s || 0; f.mastered = !!s.m; }
    });
  }
}

// --- Утилиты ---
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function factsByFactors(factors) { return facts.filter(f => factors.includes(f.a)); }
function masteredByFactors(factors) { return factsByFactors(factors).filter(f => f.mastered).length; }
function overallMastered() { return facts.filter(f => f.mastered).length; }
function masteredFacts() { return facts.filter(f => f.mastered); }
function levelComplete(lvl) { return masteredByFactors(lvl.factors) === factsByFactors(lvl.factors).length; }
function anyLevelComplete() { return LEVELS.some(levelComplete); }

function fmtTotal(ms) { return Math.round(ms / 1000); }
function fmtAvg(ms, n) { return n ? (Math.round((ms / n) / 100) / 10) : 0; }
function timeLine(ms, n) {
  if (!n) return '';
  return t('timeLine', { tot: fmtTotal(ms), avg: fmtAvg(ms, n) });
}

// --- Меню ---
function renderMenu() {
  el.overallMastered.textContent = overallMastered();
  el.levelButtons.innerHTML = '';

  LEVELS.forEach((lvl, i) => {
    const id = 'l' + i;
    const num = i + 1;
    const done = masteredByFactors(lvl.factors);
    const tot = factsByFactors(lvl.factors).length;
    const complete = done === tot;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'level-btn' + (complete ? ' complete' : '');
    btn.innerHTML = `<span class="lvl-name">${factorLabel(lvl.factors)}</span>` +
      `<span class="lvl-sub">${t('levelSub', { n: num })}</span>` +
      `<span class="lvl-progress">${complete ? t('done') : done + '/' + tot}</span>`;
    btn.addEventListener('click', () => {
      if (complete) showOptions(lvl, num, id);
      else startLevel(lvl, num, id);
    });
    el.levelButtons.appendChild(btn);
  });

  // свой выбор
  const customBtn = document.createElement('button');
  customBtn.type = 'button';
  const cDone = overallMastered();
  const cTot = facts.length;
  const cComplete = cDone === cTot;
  customBtn.className = 'level-btn' + (cComplete ? ' complete' : '');
  customBtn.innerHTML = `<span class="lvl-name">✎</span><span class="lvl-sub">${t('customTitle')}</span>` +
    `<span class="lvl-progress">${cComplete ? t('done') : t('learnedX', { d: cDone, t: cTot })}</span>`;
  customBtn.addEventListener('click', showCustom);
  el.levelButtons.appendChild(customBtn);

  // случайный набор
  const randBtn = document.createElement('button');
  randBtn.type = 'button';
  randBtn.className = 'level-btn';
  randBtn.innerHTML = `<span class="lvl-name">🎲</span><span class="lvl-sub">${t('randName')}</span>` +
    `<span class="lvl-progress">${t('randTap')}</span>`;
  randBtn.addEventListener('click', showRandom);
  el.levelButtons.appendChild(randBtn);

  // диктант
  const dictBtn = document.createElement('button');
  dictBtn.type = 'button';
  dictBtn.className = 'level-btn';
  if (anyLevelComplete()) {
    dictBtn.innerHTML = `<span class="lvl-name">📝</span><span class="lvl-sub">${t('dictName')}</span>` +
      `<span class="lvl-progress">${t('dictControl')}</span>`;
    dictBtn.addEventListener('click', startDictation);
  } else {
    dictBtn.classList.add('locked');
    dictBtn.innerHTML = `<span class="lvl-name">🔒</span><span class="lvl-sub">${t('dictName')}</span>` +
      `<span class="lvl-progress">${t('dictLocked')}</span>`;
    dictBtn.addEventListener('click', () => showMenu(t('dictNeedLevel')));
  }
  el.levelButtons.appendChild(dictBtn);
}

function hideAllScreens() {
  el.menuScreen.classList.add('hidden');
  el.optionsScreen.classList.add('hidden');
  el.customScreen.classList.add('hidden');
  el.randomScreen.classList.add('hidden');
  el.gameScreen.classList.add('hidden');
  el.resultsScreen.classList.add('hidden');
  el.winScreen.classList.add('hidden');
}

function showMenu(message) {
  mode = null;
  paused = false;
  if (msgTimer) { clearTimeout(msgTimer); msgTimer = null; }
  el.levelMessage.textContent = message || '';
  if (message) {
    // подсказка внизу меню сама исчезает через пару секунд
    msgTimer = setTimeout(() => { el.levelMessage.textContent = ''; msgTimer = null; }, 2500);
  }
  renderMenu();
  hideAllScreens();
  el.menuScreen.classList.remove('hidden');
}

// --- Экран повтора пройденного уровня ---
function showOptions(lvl, num, id) {
  pendingLevel = { lvl, num, id };
  mode = null;
  el.optionsTitle.textContent = t('optionsAlreadyDone', { n: num });
  el.optionsMessage.textContent = '';
  hideAllScreens();
  el.optionsScreen.classList.remove('hidden');
}

// --- Экран результатов ---
function showResults(title, log, timeMs, answers) {
  mode = null;
  paused = false;
  const correct = log.filter(e => e.correct).length;
  const wrong = log.filter(e => !e.correct).length;
  el.resultsTitle.textContent = title;
  el.resultsSummary.textContent = t('resultsCount', { c: correct, w: wrong });
  el.resultsTime.textContent = (timeMs != null) ? timeLine(timeMs, answers) : '';
  el.resultsList.innerHTML = '';
  log.forEach(e => {
    const item = document.createElement('div');
    item.className = 'result-item ' + (e.correct ? 'ok' : 'bad');
    if (e.correct) {
      item.textContent = `${e.a} × ${e.b} = ${e.answer}`;
    } else {
      item.innerHTML = `<span>${e.a} × ${e.b} = ${e.answer}</span>` +
        `<span class="right-ans">${t('rightAns', { r: e.a * e.b })}</span>`;
    }
    el.resultsList.appendChild(item);
  });
  hideAllScreens();
  el.resultsScreen.classList.remove('hidden');
}

// --- Экран «свой выбор» ---
function showCustom() {
  el.customChecks.innerHTML = '';
  for (let k = MIN; k <= MAX; k++) {
    const wrap = document.createElement('label');
    wrap.className = 'check-item';
    wrap.innerHTML = `<input type="checkbox" value="${k}"><span>×${k}</span>`;
    el.customChecks.appendChild(wrap);
  }
  hideAllScreens();
  el.customScreen.classList.remove('hidden');
}
function startCustom() {
  const chosen = [];
  el.customChecks.querySelectorAll('input:checked').forEach(c => chosen.push(parseInt(c.value, 10)));
  if (chosen.length === 0) {
    el.customStartBtn.textContent = t('chooseAtLeastOne');
    setTimeout(() => { el.customStartBtn.textContent = t('start'); }, 1200);
    return;
  }
  startSession({ kind: 'level', targets: factsByFactors(chosen), temp: false, title: t('customTitle'), finishTitle: t('finishLevel') });
}

// --- Случайный набор ---
function rollRandom() {
  const all = [];
  for (let k = MIN; k <= MAX; k++) all.push(k);
  randomChosen = shuffle(all).slice(0, 2).sort((a, b) => a - b);
  el.randomNumbers.textContent = '×' + randomChosen.join('   ×');
}
function showRandom() {
  rollRandom();
  hideAllScreens();
  el.randomScreen.classList.remove('hidden');
}
function startRandomSet() {
  startSession({
    kind: 'random', temp: true, progress: true,
    targets: factsByFactors(randomChosen),
    title: t('randomSessionTitle', { list: randomChosen.join(', ×') }),
    finishTitle: t('finishRandom'),
  });
}

// =================== СЕАНС ОБУЧЕНИЯ ===================
function startSession(opts) {
  session = {
    kind: opts.kind, targets: opts.targets, temp: !!opts.temp, progress: !!opts.progress,
    need: opts.need || NEED_STREAK, title: opts.title,
    finishTitle: opts.finishTitle || t('finishLevel'), id: opts.id || null,
    streak: {}, log: [], timeMs: 0, answers: 0,
  };
  if (opts.kind !== 'dictLearn') { correctCount = 0; wrongCount = 0; }
  mode = 'session';
  paused = false;
  current = null;
  el.pauseBtn.textContent = t('pause');
  el.pauseBtn.classList.remove('is-paused');
  el.answer.disabled = false;
  el.levelTitle.textContent = session.title;
  el.feedback.textContent = ' ';
  el.feedback.className = '';
  hideAllScreens();
  el.gameScreen.classList.remove('hidden');
  updateSessionStats();
  nextSessionQuestion();
}

function startLevel(lvl, num, id) {
  startSession({
    kind: 'level', id: id, temp: false,
    targets: factsByFactors(lvl.factors),
    title: t('levelTitlePrefix', { n: num }) + factorLabel(lvl.factors),
    finishTitle: t('finishLevel'),
  });
}

function sessionDone(f) {
  return session.temp ? (session.streak[key(f.a, f.b)] || 0) >= session.need : f.mastered;
}
function streakOf(f) {
  return session.temp ? (session.streak[key(f.a, f.b)] || 0) : f.streak;
}
function sessionPool() { return session.targets.filter(f => !sessionDone(f)); }

function updateSessionStats() {
  el.mastered.textContent = session.targets.filter(sessionDone).length;
  el.total.textContent = session.targets.length;
  el.correct.textContent = correctCount;
  el.wrong.textContent = wrongCount;
}

function nextSessionQuestion() {
  if (paused) return;
  const pool = sessionPool();
  if (pool.length === 0) { finishSession(); return; }
  let choice = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1 && choice === current) {
    while (choice === current) choice = pool[Math.floor(Math.random() * pool.length)];
  }
  current = choice;
  renderQuestion();
}

function submitSession() {
  if (!answering) return;
  const raw = el.answer.value.trim();
  if (raw === '') return;
  answering = false;
  session.timeMs += Date.now() - qStartTime;
  session.answers++;

  const value = parseInt(raw, 10);
  const right = current.a * current.b;
  const isCorrect = value === right;
  session.log.push({ a: current.a, b: current.b, answer: value, correct: isCorrect });

  if (isCorrect) {
    correctCount++;
    if (session.temp) session.streak[key(current.a, current.b)] = (session.streak[key(current.a, current.b)] || 0) + 1;
    else { current.streak++; if (current.streak >= session.need) current.mastered = true; }
    if (session.progress && !current.mastered) {
      current.streak++;
      if (current.streak >= NEED_STREAK) current.mastered = true;
    }
    const s = streakOf(current);
    if (s >= session.need) flash(t('fbMastered', { a: current.a, b: current.b, r: right }), 'ok');
    else flash(t('fbStreak', { s: s, n: session.need, left: session.need - s }), 'ok');
  } else {
    wrongCount++;
    if (session.temp) session.streak[key(current.a, current.b)] = 0;
    else current.streak = 0;
    if (session.progress && !current.mastered) current.streak = 0;
    flash(t('fbWrong', { a: current.a, b: current.b, r: right }), 'bad');
  }
  updateSessionStats();
  saveState();
}

function finishSession() {
  if (session.kind === 'dictLearn') {
    dict.roundList = session.targets.slice();
    beginDictRound(t('dictRedoTitle'));
    return;
  }
  if (session.log.length === 0) { showMenu(t('allLearnedHere')); return; }
  if (session.kind === 'level' && session.id) {
    lastResults[session.id] = { log: session.log.slice(), timeMs: session.timeMs, answers: session.answers };
    saveState();
  }
  showResults(session.finishTitle, session.log, session.timeMs, session.answers);
}

// =================== ДИКТАНТ ===================
function startDictation() {
  correctCount = 0; wrongCount = 0;
  dict = { roundList: masteredFacts(), timeMs: 0, answers: 0 };
  if (dict.roundList.length === 0) { showMenu(t('dictNeedLevelShort')); return; }
  beginDictRound(t('dictTitle'));
}

function beginDictRound(title) {
  mode = 'dictTest';
  paused = false;
  current = null;
  dict.queue = shuffle(dict.roundList);
  dict.roundTotal = dict.queue.length;
  dict.answered = 0;
  dict.mistakes = new Set();
  el.pauseBtn.textContent = t('pause');
  el.pauseBtn.classList.remove('is-paused');
  el.answer.disabled = false;
  el.levelTitle.textContent = title;
  el.feedback.textContent = ' ';
  el.feedback.className = '';
  hideAllScreens();
  el.gameScreen.classList.remove('hidden');
  updateDictStats();
  nextDict();
}

function updateDictStats() {
  el.mastered.textContent = dict.answered;
  el.total.textContent = dict.roundTotal;
  el.correct.textContent = correctCount;
  el.wrong.textContent = wrongCount;
}

function nextDict() {
  if (paused) return;
  if (dict.queue.length === 0) { endDictRound(); return; }
  current = dict.queue.shift();
  renderQuestion();
}

function submitDict() {
  if (!answering) return;
  const raw = el.answer.value.trim();
  if (raw === '') return;
  answering = false;
  dict.timeMs += Date.now() - qStartTime;
  dict.answers++;
  dict.answered++;

  const value = parseInt(raw, 10);
  const right = current.a * current.b;
  if (value === right) {
    correctCount++;
    flash(t('dictCorrect'), 'ok', 500);
  } else {
    wrongCount++;
    dict.mistakes.add(key(current.a, current.b));
    const tw = twin(current);
    if (tw) dict.mistakes.add(key(tw.a, tw.b));
    flash(t('dictRemember', { a: current.a, b: current.b, r: right }), 'bad');
  }
  updateDictStats();
  saveState();
}

function endDictRound() {
  if (dict.mistakes.size === 0) { winDictation(); return; }
  const targets = [...dict.mistakes].map(k => factByKey[k]);
  startSession({ kind: 'dictLearn', temp: true, targets: targets, title: t('dictLearnTitle') });
}

function winDictation() {
  mode = null;
  el.winTitle.textContent = t('winDictTitle');
  el.winText.textContent = t('winDictText');
  el.winCorrect.textContent = correctCount;
  el.winWrong.textContent = wrongCount;
  el.winTime.textContent = timeLine(dict.timeMs, dict.answers);
  hideAllScreens();
  el.winScreen.classList.remove('hidden');
}

// =================== ОБЩЕЕ ===================
function renderQuestion() {
  answering = true;
  el.question.textContent = `${current.a} × ${current.b}`;
  el.question.classList.remove('pop');
  void el.question.offsetWidth;
  el.question.classList.add('pop');
  el.answer.value = '';
  el.answer.disabled = false;
  updateSubmitState();
  el.answer.focus();
  qStartTime = Date.now();
}

function advance() {
  if (mode === 'session') nextSessionQuestion();
  else if (mode === 'dictTest') nextDict();
}

function flash(text, cls, delay = 850) {
  el.feedback.textContent = text;
  el.feedback.className = cls;
  setTimeout(() => {
    el.feedback.textContent = ' ';
    el.feedback.className = '';
    advance();
  }, delay);
}

function onSubmit(e) {
  e.preventDefault();
  if (mode === 'session') submitSession();
  else if (mode === 'dictTest') submitDict();
}

function togglePause() {
  if (!mode) return;
  if (!paused && !answering) return;
  if (paused) {
    paused = false;
    el.pauseBtn.textContent = t('pause');
    el.pauseBtn.classList.remove('is-paused');
    if (current) renderQuestion(); else advance();
  } else {
    paused = true;
    answering = false;
    el.question.textContent = '⏸';
    el.answer.value = '';
    el.answer.disabled = true;
    updateSubmitState();
    el.feedback.textContent = ' ';
    el.feedback.className = '';
    el.pauseBtn.textContent = t('resume');
    el.pauseBtn.classList.add('is-paused');
  }
}

// =================== КНОПКИ ЭКРАНА ПОВТОРА ===================
el.optNoRepeat.addEventListener('click', () => showMenu());
el.optViewAnswers.addEventListener('click', () => {
  const { num, id } = pendingLevel;
  answersViewedAt[id] = Date.now();
  saveState();
  const rec = lastResults[id] || { log: [], timeMs: null, answers: 0 };
  showResults(t('viewAnswersTitle', { n: num }), rec.log, rec.timeMs, rec.answers);
});
el.optRedo.addEventListener('click', () => {
  const { lvl, num, id } = pendingLevel;
  const viewed = answersViewedAt[id];
  if (viewed && Date.now() - viewed < REDO_COOLDOWN) {
    const leftMin = Math.ceil((REDO_COOLDOWN - (Date.now() - viewed)) / 60000);
    el.optionsMessage.textContent = t('redoCooldown', { min: leftMin });
    return;
  }
  startSession({
    kind: 'redo', temp: true,
    targets: factsByFactors(lvl.factors),
    title: t('levelTitlePrefix', { n: num }) + factorLabel(lvl.factors),
    finishTitle: t('finishRedo'),
  });
});

// =================== СБРОС ===================
function resetAll() {
  facts.forEach(f => { f.streak = 0; f.mastered = false; });
  correctCount = 0;
  wrongCount = 0;
  current = null;
  lastResults = {};
  answersViewedAt = {};
  saveState();
  showMenu(t('progressReset'));
}

// --- Запуск ---
el.form.addEventListener('submit', onSubmit);
el.resetAllBtn.addEventListener('click', resetAll);
el.pauseBtn.addEventListener('click', togglePause);
el.backBtn.addEventListener('click', () => {
  if (mode === 'session' && session && session.log.length) {
    showResults(t('yourAnswers'), session.log, session.timeMs, session.answers);
  } else {
    showMenu();
  }
});
el.resultsMenuBtn.addEventListener('click', () => showMenu());
el.winMenuBtn.addEventListener('click', () => showMenu());
el.optionsBackBtn.addEventListener('click', () => showMenu());
el.customBackBtn.addEventListener('click', () => showMenu());
el.customStartBtn.addEventListener('click', startCustom);
el.randomBackBtn.addEventListener('click', () => showMenu());
el.randomRerollBtn.addEventListener('click', rollRandom);
el.randomStartBtn.addEventListener('click', startRandomSet);

el.langBtn.addEventListener('click', () => el.langMenu.classList.toggle('hidden'));
el.langMenu.querySelectorAll('[data-lang]').forEach(b => {
  b.addEventListener('click', () => setLang(b.getAttribute('data-lang')));
});

loadLang();
loadState();
applyLang();
showMenu();
