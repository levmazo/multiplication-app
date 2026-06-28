// === Тренажёр таблицы умножения ===
// Числа 0..12 (169 примеров). 3×5 и 5×3 — разные задачи.
// Режимы: 🎲 Случайный набор (учишься) и 📝 Диктант (контрольная по выученному).
// Выучено = 2 правильных ПОДРЯД. Монеты за прохождение → магазин (питомцы, праздники).
// Языки: RU / NL / EN. Прогресс и монеты хранятся в localStorage.

const MIN = 0;
const MAX = 12;
const NEED_STREAK = 2;

// --- Награда по НАСТОЯЩЕЙ сложности ---
// Лёгкие таблицы (есть трюк): 0,1,2,5,10,11 → 2. Средние: 3,4 → 4. Сложные: 6,7,8,9,12 → 8.
const EASY_FACTORS = [0, 1, 2, 5, 10, 11];
const MEDIUM_FACTORS = [3, 4];
function factorScore(f) {
  if (EASY_FACTORS.includes(f)) return 2;
  if (MEDIUM_FACTORS.includes(f)) return 4;
  return 8;
}
// Пример оценивается по самому ЛЁГКОМУ множителю: есть трюк → пример лёгкий (7×10=лёгкий, 7×8=сложный)
function factValue(a, b) { return Math.min(factorScore(a), factorScore(b)); }
function rewardForFacts(list) { return list.reduce((s, f) => s + factValue(f.a, f.b), 0); }
function dictationReward(roundList) { return rewardForFacts(roundList); }

const PETS = [
  { emoji: '🐱', price: 50 },
  { emoji: '🐶', price: 120 },
  { emoji: '🐉', price: 250 },
  { emoji: '🦄', price: 400 },
];
const CELEBS = [
  { emoji: '🎉', price: 0 },
  { emoji: '✨', price: 40 },
  { emoji: '🎆', price: 80 },
  { emoji: '🌈', price: 120 },
];

// =================== ПЕРЕВОДЫ ===================
const STR = {
  ru: {
    langBtn: '⚙ Language', menuTitle: '✖️ Таблица умножения', learnedTotal: 'Выучено всего:',
    of: 'из', resetAll: 'Сбросить весь прогресс', backMenu: '← В меню',
    randomTitle: '🎲 Случайный набор', randomHint: 'Будешь умножать на эти числа:',
    reroll: '🎲 Другие две цифры', start: 'Начать',
    learned: 'Выучено:', correctLbl: 'Верно:', wrongLbl: 'Ошибок:',
    answerBtn: 'Ответить', pause: '⏸ Пауза', resume: '▶ Начать снова', menuBtn: 'В меню',
    winCorrectLbl: 'Верных ответов:',
    randName: 'Случайный набор', randTap: 'нажми',
    dictName: 'Диктант', dictControl: 'контрольная', dictLocked: 'сначала поучись',
    fbMastered: '✅ Верно! Выучено! ({a}×{b}={r})',
    fbStreak: '✅ Верно! Подряд: {s}/{n} (осталось {left})',
    fbWrong: '❌ Неверно. {a}×{b}={r}. Счётчик сброшен.',
    dictCorrect: '✅ Верно!', dictRemember: '❌ Запомнил: {a}×{b}={r}',
    finishRandom: '🎉 Набор пройден!',
    allLearnedHere: 'Здесь уже всё выучено! 🎉',
    dictNeedLevelShort: 'Сначала поучись в «Случайном наборе».',
    dictNeedLevel: 'Сначала поучись в «Случайном наборе» — потом откроется диктант.',
    resultsCount: '✅ Правильных: {c}   ❌ Неправильных: {w}',
    timeLine: '⏱ Потрачено ~{tot} сек · в среднем ~{avg} сек на пример',
    yourAnswers: 'Твои ответы', dictTitle: 'Диктант', dictRedoTitle: 'Диктант: повтор по ошибкам',
    dictLearnTitle: 'Учим ошибки диктанта (2 подряд)', randomSessionTitle: 'Случайный набор: ×{list}',
    winDictTitle: '🎉 Диктант сдан!', winDictText: 'Ты прошёл диктант без ошибок!',
    rightAns: 'верно: {r}', coinsPlus: '+{n} евро', currency: 'евро',
    shopBtn: '🛒 Магазин', shopTitle: '🛒 Магазин', petsTitle: 'Питомцы',
    petsHint: 'Питомец решает за тебя один пример (можно одного).', celebsTitle: 'Праздники победы',
    buy: 'Купить', active: 'Активно', select: 'Выбрать', notEnough: 'Мало монет', free: 'бесплатно',
    petHint: '{e} подсказка: {a}×{b} = {sum}',
    customTitle: 'Свой выбор', customHint: 'Отметь, что хочешь тренировать:',
    chooseAtLeastOne: 'Отметь хотя бы одно!', finishCustom: '🎉 Готово!', learnedX: 'выучено {d}/{t}',
  },
  nl: {
    langBtn: '⚙ Language', menuTitle: '✖️ vermenigvuldigen', learnedTotal: 'In totaal geleerd:',
    of: 'van', resetAll: 'Alle voortgang wissen', backMenu: '← Naar menu',
    randomTitle: '🎲 Willekeurige set', randomHint: 'Je gaat met deze getallen vermenigvuldigen:',
    reroll: '🎲 Twee andere getallen', start: 'Starten',
    learned: 'Geleerd:', correctLbl: 'Goed:', wrongLbl: 'Fout:',
    answerBtn: 'Antwoorden', pause: '⏸ Pauze', resume: '▶ Verdergaan', menuBtn: 'Naar menu',
    winCorrectLbl: 'Goede antwoorden:',
    randName: 'Willekeurige set', randTap: 'klik',
    dictName: 'Dictee', dictControl: 'toets', dictLocked: 'leer eerst iets',
    fbMastered: '✅ Goed! Geleerd! ({a}×{b}={r})',
    fbStreak: '✅ Goed! Op rij: {s}/{n} (nog {left})',
    fbWrong: '❌ Fout. {a}×{b}={r}. Teller terug naar nul.',
    dictCorrect: '✅ Goed!', dictRemember: '❌ Onthouden: {a}×{b}={r}',
    finishRandom: '🎉 Set gehaald!',
    allLearnedHere: 'Hier is alles al geleerd! 🎉',
    dictNeedLevelShort: 'Leer eerst in «Willekeurige set».',
    dictNeedLevel: 'Leer eerst in «Willekeurige set» — dan gaat het dictee open.',
    resultsCount: '✅ Goed: {c}   ❌ Fout: {w}',
    timeLine: '⏱ Gebruikt ~{tot} sec · gemiddeld ~{avg} sec per som',
    yourAnswers: 'Jouw antwoorden', dictTitle: 'Dictee', dictRedoTitle: 'Dictee: fouten herhalen',
    dictLearnTitle: 'Fouten van het dictee leren (2 op rij)', randomSessionTitle: 'Willekeurige set: ×{list}',
    winDictTitle: '🎉 Dictee gehaald!', winDictText: 'Je hebt het dictee zonder fouten gedaan!',
    rightAns: 'goed: {r}', coinsPlus: '+{n} euro', currency: 'euro',
    shopBtn: '🛒 Winkel', shopTitle: '🛒 Winkel', petsTitle: 'Huisdieren',
    petsHint: 'Een huisdier lost één som voor je op (max. 1).', celebsTitle: 'Overwinningsfeestjes',
    buy: 'Kopen', active: 'Actief', select: 'Kiezen', notEnough: 'Te weinig munten', free: 'gratis',
    petHint: '{e} hint: {a}×{b} = {sum}',
    customTitle: 'Eigen keuze', customHint: 'Vink aan wat je wilt oefenen:',
    chooseAtLeastOne: 'Kies er minstens één!', finishCustom: '🎉 Klaar!', learnedX: 'geleerd {d}/{t}',
  },
  en: {
    langBtn: '⚙ Language', menuTitle: '✖️ Multiplication table', learnedTotal: 'Learned in total:',
    of: 'of', resetAll: 'Reset all progress', backMenu: '← To menu',
    randomTitle: '🎲 Random set', randomHint: "You'll multiply by these numbers:",
    reroll: '🎲 Two other numbers', start: 'Start',
    learned: 'Learned:', correctLbl: 'Correct:', wrongLbl: 'Mistakes:',
    answerBtn: 'Answer', pause: '⏸ Pause', resume: '▶ Resume', menuBtn: 'To menu',
    winCorrectLbl: 'Correct answers:',
    randName: 'Random set', randTap: 'click',
    dictName: 'Dictation', dictControl: 'test', dictLocked: 'learn first',
    fbMastered: '✅ Correct! Learned! ({a}×{b}={r})',
    fbStreak: '✅ Correct! In a row: {s}/{n} ({left} left)',
    fbWrong: '❌ Wrong. {a}×{b}={r}. Counter reset.',
    dictCorrect: '✅ Correct!', dictRemember: '❌ Noted: {a}×{b}={r}',
    finishRandom: '🎉 Set complete!',
    allLearnedHere: 'Everything here is already learned! 🎉',
    dictNeedLevelShort: 'Learn in the “Random set” first.',
    dictNeedLevel: 'Learn in the “Random set” first — then the dictation opens.',
    resultsCount: '✅ Correct: {c}   ❌ Wrong: {w}',
    timeLine: '⏱ Spent ~{tot} sec · about ~{avg} sec per problem',
    yourAnswers: 'Your answers', dictTitle: 'Dictation', dictRedoTitle: 'Dictation: redo mistakes',
    dictLearnTitle: 'Learning dictation mistakes (2 in a row)', randomSessionTitle: 'Random set: ×{list}',
    winDictTitle: '🎉 Dictation passed!', winDictText: 'You passed the dictation with no mistakes!',
    rightAns: 'correct: {r}', coinsPlus: '+{n} euro', currency: 'euro',
    shopBtn: '🛒 Shop', shopTitle: '🛒 Shop', petsTitle: 'Pets',
    petsHint: 'A pet solves one problem for you (max 1).', celebsTitle: 'Victory celebrations',
    buy: 'Buy', active: 'Active', select: 'Select', notEnough: 'Not enough coins', free: 'free',
    petHint: '{e} hint: {a}×{b} = {sum}',
    customTitle: 'Your choice', customHint: 'Check what you want to practice:',
    chooseAtLeastOne: 'Pick at least one!', finishCustom: '🎉 Done!', learnedX: 'learned {d}/{t}',
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

// --- Состояние ---
let coins = 0;
let ownedPet = null;          // emoji или null
let celebration = '🎉';       // активный праздник
let ownedCelebs = ['🎉'];     // купленные праздники
let mode = null;              // 'session' | 'dictTest' | null
let session = null;
let dict = null;
let current = null;
let answering = false;
let paused = false;
let qStartTime = 0;
let randomChosen = [];
let msgTimer = null;

// --- Элементы ---
const el = {
  menuScreen: document.getElementById('menu-screen'),
  langBtn: document.getElementById('langBtn'),
  langMenu: document.getElementById('langMenu'),
  overallMastered: document.getElementById('overallMastered'),
  overallTotal: document.getElementById('overallTotal'),
  coinBalance: document.getElementById('coinBalance'),
  levelMessage: document.getElementById('levelMessage'),
  levelButtons: document.getElementById('levelButtons'),
  shopBtn: document.getElementById('shopBtn'),
  shopScreen: document.getElementById('shop-screen'),
  shopBackBtn: document.getElementById('shopBackBtn'),
  shopBalance: document.getElementById('shopBalance'),
  shopMessage: document.getElementById('shopMessage'),
  shopPets: document.getElementById('shopPets'),
  shopCelebs: document.getElementById('shopCelebs'),
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
  progressfill: document.getElementById('progressfill'),
  question: document.getElementById('question'),
  answer: document.getElementById('answer'),
  form: document.getElementById('answerForm'),
  submitBtn: document.getElementById('submitBtn'),
  feedback: document.getElementById('feedback'),
  pauseBtn: document.getElementById('pauseBtn'),
  resultsScreen: document.getElementById('results-screen'),
  resultsCeleb: document.getElementById('resultsCeleb'),
  resultsTitle: document.getElementById('resultsTitle'),
  resultsSummary: document.getElementById('resultsSummary'),
  resultsCoins: document.getElementById('resultsCoins'),
  resultsTime: document.getElementById('resultsTime'),
  resultsList: document.getElementById('resultsList'),
  resultsMenuBtn: document.getElementById('resultsMenuBtn'),
  winScreen: document.getElementById('win-screen'),
  winCeleb: document.getElementById('winCeleb'),
  winTitle: document.getElementById('winTitle'),
  winText: document.getElementById('winText'),
  winCorrect: document.getElementById('winCorrect'),
  winWrong: document.getElementById('winWrong'),
  winCoins: document.getElementById('winCoins'),
  winTime: document.getElementById('winTime'),
  winMenuBtn: document.getElementById('winMenuBtn'),
  petCompanion: document.getElementById('petCompanion'),
};

function updatePet() { el.petCompanion.textContent = ownedPet || ''; }

el.overallTotal.textContent = facts.length;

// =================== ЯЗЫК ===================
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(elm => { elm.textContent = t(elm.getAttribute('data-i18n')); });
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

// --- Кнопка «Ответить» ---
function updateSubmitState() {
  el.submitBtn.disabled = el.answer.disabled || el.answer.value.trim() === '';
}
el.answer.addEventListener('input', updateSubmitState);

// --- Сохранение ---
const SAVE_KEY = 'mult_progress';
function saveState() {
  const data = { facts: {}, coins: coins, pet: ownedPet, celeb: celebration, owned: ownedCelebs };
  facts.forEach(f => { data.facts[key(f.a, f.b)] = { s: f.streak, m: f.mastered }; });
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { /* нет доступа */ }
}
function loadState() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { data = null; }
  if (!data) return;
  coins = data.coins || 0;
  ownedPet = data.pet || null;
  celebration = data.celeb || '🎉';
  ownedCelebs = data.owned || ['🎉'];
  if (ownedCelebs.indexOf('🎉') === -1) ownedCelebs.push('🎉');
  if (data.facts) {
    facts.forEach(f => {
      const s = data.facts[key(f.a, f.b)];
      if (s) { f.streak = s.s || 0; f.mastered = !!s.m; }
    });
  }
}

// --- Монеты ---
function addCoins(n) { coins += n; updateBalances(); saveState(); }
function updateBalances() {
  const txt = coins + ' ' + t('currency');
  el.coinBalance.textContent = txt;
  el.shopBalance.textContent = txt;
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
function overallMastered() { return facts.filter(f => f.mastered).length; }
function masteredFacts() { return facts.filter(f => f.mastered); }

function fmtTotal(ms) { return Math.round(ms / 1000); }
function fmtAvg(ms, n) { return n ? (Math.round((ms / n) / 100) / 10) : 0; }
function timeLine(ms, n) { return n ? t('timeLine', { tot: fmtTotal(ms), avg: fmtAvg(ms, n) }) : ''; }

// --- Меню ---
function renderMenu() {
  el.overallMastered.textContent = overallMastered();
  updateBalances();
  el.levelButtons.innerHTML = '';

  // случайный набор
  const randBtn = document.createElement('button');
  randBtn.type = 'button';
  randBtn.className = 'level-btn';
  randBtn.innerHTML = `<span class="lvl-name">🎲</span><span class="lvl-sub">${t('randName')}</span>` +
    `<span class="lvl-progress">${t('randTap')}</span>`;
  randBtn.addEventListener('click', showRandom);
  el.levelButtons.appendChild(randBtn);

  // свой выбор (считается в прогресс)
  const customBtn = document.createElement('button');
  customBtn.type = 'button';
  const cDone = overallMastered();
  const cComplete = cDone === facts.length;
  customBtn.className = 'level-btn' + (cComplete ? ' complete' : '');
  customBtn.innerHTML = `<span class="lvl-name">✎</span><span class="lvl-sub">${t('customTitle')}</span>` +
    `<span class="lvl-progress">${t('learnedX', { d: cDone, t: facts.length })}</span>`;
  customBtn.addEventListener('click', showCustom);
  el.levelButtons.appendChild(customBtn);

  // диктант
  const dictBtn = document.createElement('button');
  dictBtn.type = 'button';
  dictBtn.className = 'level-btn';
  if (overallMastered() > 0) {
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
  el.shopScreen.classList.add('hidden');
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
  if (message) msgTimer = setTimeout(() => { el.levelMessage.textContent = ''; msgTimer = null; }, 1000);
  renderMenu();
  hideAllScreens();
  el.menuScreen.classList.remove('hidden');
}

// =================== МАГАЗИН ===================
function showShop() {
  el.shopMessage.textContent = '';
  renderShop();
  hideAllScreens();
  el.shopScreen.classList.remove('hidden');
}
function shopMsg(text) {
  el.shopMessage.textContent = text;
  setTimeout(() => { if (el.shopMessage.textContent === text) el.shopMessage.textContent = ''; }, 1200);
}
function renderShop() {
  updateBalances();
  // питомцы
  el.shopPets.innerHTML = '';
  PETS.forEach(p => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'shop-item' + (ownedPet === p.emoji ? ' active' : '');
    const tag = ownedPet === p.emoji ? t('active') : (p.price + ' ' + t('currency'));
    b.innerHTML = `<span class="shop-emoji">${p.emoji}</span><span class="shop-price">${tag}</span>`;
    b.addEventListener('click', () => buyPet(p));
    el.shopPets.appendChild(b);
  });
  // праздники
  el.shopCelebs.innerHTML = '';
  CELEBS.forEach(c => {
    const owned = ownedCelebs.indexOf(c.emoji) !== -1;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'shop-item' + (celebration === c.emoji ? ' active' : '');
    let tag;
    if (celebration === c.emoji) tag = t('active');
    else if (owned) tag = t('select');
    else tag = c.price === 0 ? t('free') : (c.price + ' ' + t('currency'));
    b.innerHTML = `<span class="shop-emoji">${c.emoji}</span><span class="shop-price">${tag}</span>`;
    b.addEventListener('click', () => pickCeleb(c));
    el.shopCelebs.appendChild(b);
  });
}
function buyPet(p) {
  if (ownedPet === p.emoji) return;
  if (coins < p.price) { shopMsg(t('notEnough')); return; }
  coins -= p.price;
  ownedPet = p.emoji;   // новый питомец заменяет старого
  updatePet();
  saveState();
  renderShop();
}
function pickCeleb(c) {
  const owned = ownedCelebs.indexOf(c.emoji) !== -1;
  if (!owned) {
    if (coins < c.price) { shopMsg(t('notEnough')); return; }
    coins -= c.price;
    ownedCelebs.push(c.emoji);
  }
  celebration = c.emoji;
  saveState();
  renderShop();
}

// =================== СВОЙ ВЫБОР ===================
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
  startSession({
    kind: 'custom', temp: true, progress: true,
    targets: factsByFactorsList(chosen),
    reward: rewardForFacts(factsByFactorsList(chosen)),
    title: t('customTitle'),
    finishTitle: t('finishCustom'),
  });
}

// =================== СЛУЧАЙНЫЙ НАБОР ===================
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
    targets: factsByFactorsList(randomChosen),
    reward: rewardForFacts(factsByFactorsList(randomChosen)),
    title: t('randomSessionTitle', { list: randomChosen.join(', ×') }),
    finishTitle: t('finishRandom'),
  });
}
function factsByFactorsList(factors) { return facts.filter(f => factors.includes(f.a)); }

// =================== СЕАНС ===================
function startSession(opts) {
  session = {
    kind: opts.kind, targets: opts.targets, temp: !!opts.temp, progress: !!opts.progress,
    need: opts.need || NEED_STREAK, title: opts.title,
    finishTitle: opts.finishTitle || t('finishRandom'), reward: opts.reward || 0,
    streak: {}, log: [], timeMs: 0, answers: 0,
    wrongTotal: 0, hintUsed: false,
  };
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

// пример как повторное сложение (для подсказки питомца): 7×8 → 8+8+…=56
function repeatedAddition(a, b) {
  const count = Math.min(a, b), val = Math.max(a, b);
  if (count === 0) return '0';
  const parts = [];
  for (let i = 0; i < count; i++) parts.push(val);
  return parts.join('+') + ' = ' + (a * b);
}

function sessionDone(f) { return session.temp ? (session.streak[key(f.a, f.b)] || 0) >= session.need : f.mastered; }
function streakOf(f) { return session.temp ? (session.streak[key(f.a, f.b)] || 0) : f.streak; }
function sessionPool() { return session.targets.filter(f => !sessionDone(f)); }

function updateSessionStats() {
  const done = session.targets.filter(sessionDone).length;
  const tot = session.targets.length;
  el.mastered.textContent = done;
  el.total.textContent = tot;
  el.correct.textContent = session.log.filter(e => e.correct).length;
  el.wrong.textContent = session.log.filter(e => !e.correct).length;
  el.progressfill.style.width = (tot ? (done / tot * 100) : 0) + '%';
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
    if (session.temp) session.streak[key(current.a, current.b)] = 0;
    else current.streak = 0;
    if (session.progress && !current.mastered) current.streak = 0;
    // питомец: один раз за заход, на 2-й ошибке — подсказка (только в обучении)
    session.wrongTotal++;
    const lesson = (session.kind === 'random' || session.kind === 'custom');
    if (ownedPet && lesson && !session.hintUsed && session.wrongTotal >= 2) {
      session.hintUsed = true;
      flash(t('petHint', { e: ownedPet, a: current.a, b: current.b, sum: repeatedAddition(current.a, current.b) }), 'ok', 2000);
    } else {
      flash(t('fbWrong', { a: current.a, b: current.b, r: right }), 'bad');
    }
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
  const earned = session.reward;
  if (earned > 0) addCoins(earned);
  showResults(session.finishTitle, session.log, session.timeMs, session.answers, earned);
}

// =================== ДИКТАНТ ===================
function startDictation() {
  dict = { roundList: masteredFacts(), timeMs: 0, answers: 0, correct: 0, wrong: 0 };
  if (dict.roundList.length === 0) { showMenu(t('dictNeedLevelShort')); return; }
  dict.reward = dictationReward(dict.roundList);
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
  el.correct.textContent = dict.correct;
  el.wrong.textContent = dict.wrong;
  el.progressfill.style.width = (dict.roundTotal ? (dict.answered / dict.roundTotal * 100) : 0) + '%';
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
    dict.correct++;
    flash(t('dictCorrect'), 'ok', 500);
  } else {
    dict.wrong++;
    dict.mistakes.add(key(current.a, current.b));
    const tw = twin(current);
    if (tw) dict.mistakes.add(key(tw.a, tw.b));
    flash(t('dictRemember', { a: current.a, b: current.b, r: right }), 'bad');
  }
  updateDictStats();
}
function endDictRound() {
  if (dict.mistakes.size === 0) { winDictation(); return; }
  const targets = [...dict.mistakes].map(k => factByKey[k]);
  startSession({ kind: 'dictLearn', temp: true, targets: targets, title: t('dictLearnTitle') });
}
function winDictation() {
  mode = null;
  addCoins(dict.reward);
  el.winTitle.textContent = t('winDictTitle');
  el.winText.textContent = t('winDictText');
  el.winCorrect.textContent = dict.correct;
  el.winWrong.textContent = dict.wrong;
  el.winCoins.textContent = t('coinsPlus', { n: dict.reward });
  el.winTime.textContent = timeLine(dict.timeMs, dict.answers);
  hideAllScreens();
  el.winScreen.classList.remove('hidden');
  playCeleb(el.winCeleb);
}

// =================== РЕЗУЛЬТАТЫ / ПРАЗДНИК ===================
function showResults(title, log, timeMs, answers, coinsEarned) {
  mode = null;
  paused = false;
  const correct = log.filter(e => e.correct).length;
  const wrong = log.filter(e => !e.correct).length;
  el.resultsTitle.textContent = title;
  el.resultsSummary.textContent = t('resultsCount', { c: correct, w: wrong });
  el.resultsCoins.textContent = coinsEarned ? t('coinsPlus', { n: coinsEarned }) : '';
  el.resultsTime.textContent = (timeMs != null) ? timeLine(timeMs, answers) : '';
  el.resultsList.innerHTML = '';
  log.forEach(e => {
    const item = document.createElement('div');
    item.className = 'result-item ' + (e.correct ? 'ok' : 'bad');
    if (e.correct) item.textContent = `${e.a} × ${e.b} = ${e.answer}`;
    else item.innerHTML = `<span>${e.a} × ${e.b} = ${e.answer}</span><span class="right-ans">${t('rightAns', { r: e.a * e.b })}</span>`;
    el.resultsList.appendChild(item);
  });
  hideAllScreens();
  el.resultsScreen.classList.remove('hidden');
  if (coinsEarned) playCeleb(el.resultsCeleb); else el.resultsCeleb.textContent = '';
}

let audioCtx = null;
function celebSound() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'triangle';
    o.frequency.setValueAtTime(523, audioCtx.currentTime);
    o.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
    o.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
    g.gain.setValueAtTime(0.18, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
    o.start(); o.stop(audioCtx.currentTime + 0.45);
  } catch (e) { /* без звука */ }
}
function playCeleb(container) {
  container.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const s = document.createElement('span');
    s.className = 'cfx';
    s.textContent = celebration;
    s.style.animationDelay = (i * 0.07) + 's';
    container.appendChild(s);
  }
  celebSound();
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

// --- Запуск ---
el.form.addEventListener('submit', onSubmit);
el.pauseBtn.addEventListener('click', togglePause);
el.backBtn.addEventListener('click', () => {
  if (mode === 'session' && session && session.log.length) {
    showResults(t('yourAnswers'), session.log, session.timeMs, session.answers, 0);
  } else {
    showMenu();
  }
});
el.resultsMenuBtn.addEventListener('click', () => showMenu());
el.winMenuBtn.addEventListener('click', () => showMenu());
el.randomBackBtn.addEventListener('click', () => showMenu());
el.randomRerollBtn.addEventListener('click', rollRandom);
el.randomStartBtn.addEventListener('click', startRandomSet);
el.shopBtn.addEventListener('click', showShop);
el.shopBackBtn.addEventListener('click', () => showMenu());
el.customBackBtn.addEventListener('click', () => showMenu());
el.customStartBtn.addEventListener('click', startCustom);
el.langBtn.addEventListener('click', () => el.langMenu.classList.toggle('hidden'));
el.langMenu.querySelectorAll('[data-lang]').forEach(b => {
  b.addEventListener('click', () => setLang(b.getAttribute('data-lang')));
});

loadLang();
loadState();
updatePet();
applyLang();
showMenu();
