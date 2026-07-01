// === Тренажёр таблицы умножения ===
// Числа 0..12 (169 примеров). Режимы: 🎲 Случайный набор, ✎ Свой выбор, 📝 Диктант.
// Выучено = 2 правильных ПОДРЯД. Евро за прохождение → магазин (питомцы, праздники).
// Питомцы: коллекция; роли «Бонус» и «Подсказки» у РАЗНЫХ питомцев. Языки: RU/NL/EN.

const MIN = 0;
const MAX = 12;
const NEED_STREAK = 2;
const SLOW_MS = 30000; // «долго думал» — для подбора примеров в диктант

// --- Награда по сложности: лёгкие 0,1,2,5,10,11 → 10; средние 3,4 → 70; сложные → 300 ---
const EASY_FACTORS = [0, 1, 2, 5, 10, 11];
const MEDIUM_FACTORS = [3, 4];
function factorScore(f) {
  if (EASY_FACTORS.includes(f)) return 10;
  if (MEDIUM_FACTORS.includes(f)) return 70;
  return 300;
}
function factValue(a, b) { return Math.min(factorScore(a), factorScore(b)); }
function rewardForFacts(list) { return list.reduce((s, f) => s + factValue(f.a, f.b), 0); }

// --- Питомцы: цена, бонус (%), способ подсказки, легендарность ---
const REGULAR_PETS = [
  { emoji: '🐱', price: 70,  bonus: 1,  hint: 'frame' },
  { emoji: '🐶', price: 150, bonus: 10, hint: 'neighbor' },
  { emoji: '🐉', price: 220, bonus: 15, hint: 'skip' },
  { emoji: '🦄', price: 400, bonus: 20, hint: 'add' },
];
const LEGENDARY_PETS = [
  { emoji: '🦖', price: 5000,  bonus: 50,  hint: 'five', legendary: true },
  { emoji: '🐲', price: 7000,  bonus: 75,  hint: 'ten',  legendary: true },
  { emoji: '🦅', price: 12000, bonus: 150, hint: 'half', legendary: true },
];
const ALL_PETS = REGULAR_PETS.concat(LEGENDARY_PETS);
const petByEmoji = {};
ALL_PETS.forEach(p => { petByEmoji[p.emoji] = p; });
function petLevel(emoji) { return ALL_PETS.findIndex(p => p.emoji === emoji) + 1; }
function petBonusMultiplier() {
  return (bonusPet && petByEmoji[bonusPet]) ? (1 + petByEmoji[bonusPet].bonus / 100) : 1;
}

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
    dictPrompt: 'Сколько примеров? (мин. 15, выучено {n})',
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
    petsHint: 'Питомцы сидят рядом. Выбери одного на «Бонус» и другого на «Подсказки».',
    petsOwned: 'У тебя питомцев: {n}', legendaryTitle: 'Легендарные питомцы', celebsTitle: 'Праздники победы',
    buy: 'Купить', notEnough: 'Мало монет', free: 'бесплатно', active: 'Активно', select: 'Выбрать',
    roleBonus: 'Бонус', roleHint: 'Подсказки', oneRole: 'Одному питомцу — одна роль',
    hintLvl: '💡 ур.{n}',
    petHint: '{e} {a}×{b}: {sum}',
    h_frame: 'возьми {b}, {a} раз',
    trick_zero: 'взять 0 раз → 0', trick_one: 'само число → {r}',
    trick_ten: 'припиши ноль → {r}', trick_eleven: 'цифру два раза → {r}',
    customTitle: 'Свой выбор', customHint: 'Отметь, что хочешь тренировать:',
    chooseAtLeastOne: 'Отметь хотя бы одно!', finishCustom: '🎉 Готово!', learnedX: 'выучено {d}/{t}',
    done: '✓ готово',
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
    dictPrompt: 'Hoeveel sommen? (min. 15, geleerd {n})',
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
    petsHint: 'Huisdieren zitten naast je. Kies één voor «Bonus» en één voor «Hints».',
    petsOwned: 'Jouw huisdieren: {n}', legendaryTitle: 'Legendarische huisdieren', celebsTitle: 'Overwinningsfeestjes',
    buy: 'Kopen', notEnough: 'Te weinig munten', free: 'gratis', active: 'Actief', select: 'Kiezen',
    roleBonus: 'Bonus', roleHint: 'Hints', oneRole: 'Eén huisdier, één rol',
    hintLvl: '💡 niv.{n}',
    petHint: '{e} {a}×{b}: {sum}',
    h_frame: 'neem {b}, {a} keer',
    trick_zero: '0 keer nemen → 0', trick_one: 'het getal zelf → {r}',
    trick_ten: 'zet er 0 achter → {r}', trick_eleven: 'cijfer twee keer → {r}',
    customTitle: 'Eigen keuze', customHint: 'Vink aan wat je wilt oefenen:',
    chooseAtLeastOne: 'Kies er minstens één!', finishCustom: '🎉 Klaar!', learnedX: 'geleerd {d}/{t}',
    done: '✓ klaar',
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
    dictPrompt: 'How many problems? (min 15, learned {n})',
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
    petsHint: 'Pets sit with you. Pick one for «Bonus» and another for «Hints».',
    petsOwned: 'Your pets: {n}', legendaryTitle: 'Legendary pets', celebsTitle: 'Victory celebrations',
    buy: 'Buy', notEnough: 'Not enough coins', free: 'free', active: 'Active', select: 'Select',
    roleBonus: 'Bonus', roleHint: 'Hints', oneRole: 'One pet, one role',
    hintLvl: '💡 lvl {n}',
    petHint: '{e} {a}×{b}: {sum}',
    h_frame: 'take {b}, {a} times',
    trick_zero: 'take 0 times → 0', trick_one: 'the number itself → {r}',
    trick_ten: 'append a zero → {r}', trick_eleven: 'the digit twice → {r}',
    customTitle: 'Your choice', customHint: 'Check what you want to practice:',
    chooseAtLeastOne: 'Pick at least one!', finishCustom: '🎉 Done!', learnedX: 'learned {d}/{t}',
    done: '✓ done',
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
    const f = { a, b, streak: 0, mastered: false, wrong: 0, mt: 0 };
    facts.push(f);
    factByKey[key(a, b)] = f;
  }
}
function twin(f) { return factByKey[key(f.b, f.a)]; }

// --- Состояние ---
let coins = 0;
let ownedPets = [];           // список emoji (коллекция, можно повторы)
let bonusPet = null;          // emoji питомца, дающего бонус
let hintPet = null;           // emoji питомца, дающего подсказки
let celebration = '🎉';
let ownedCelebs = ['🎉'];
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
  petsOwned: document.getElementById('petsOwned'),
  shopPets: document.getElementById('shopPets'),
  shopLegendary: document.getElementById('shopLegendary'),
  shopCelebs: document.getElementById('shopCelebs'),
  customScreen: document.getElementById('custom-screen'),
  customChecks: document.getElementById('customChecks'),
  customStartBtn: document.getElementById('customStartBtn'),
  customBackBtn: document.getElementById('customBackBtn'),
  customProgress: document.getElementById('customProgress'),
  randomScreen: document.getElementById('random-screen'),
  randomNumbers: document.getElementById('randomNumbers'),
  randomRerollBtn: document.getElementById('randomRerollBtn'),
  randomStartBtn: document.getElementById('randomStartBtn'),
  randomBackBtn: document.getElementById('randomBackBtn'),
  dictScreen: document.getElementById('dict-screen'),
  dictPrompt: document.getElementById('dictPrompt'),
  dictCount: document.getElementById('dictCount'),
  dictStartBtn: document.getElementById('dictStartBtn'),
  dictBackBtn: document.getElementById('dictBackBtn'),
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

// питомцы сидят рядом; над бонусным/подсказочным — подпись
function updatePet() {
  el.petCompanion.innerHTML = ownedPets.map(e => {
    let role = '';
    if (e === bonusPet) role = t('roleBonus');
    else if (e === hintPet) role = t('roleHint');
    return `<span class="pet-one">${role ? `<span class="pet-label">${role}</span>` : ''}${e}</span>`;
  }).join('');
}

el.overallTotal.textContent = facts.length;

// =================== ЯЗЫК ===================
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(elm => { elm.textContent = t(elm.getAttribute('data-i18n')); });
  if (!paused) el.pauseBtn.textContent = t('pause');
  updatePet();
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
  const data = { facts: {}, coins, pets: ownedPets, bonusPet, hintPet, celeb: celebration, owned: ownedCelebs };
  facts.forEach(f => { data.facts[key(f.a, f.b)] = { s: f.streak, m: f.mastered, w: f.wrong, mt: f.mt }; });
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { /* нет доступа */ }
}
function loadState() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { data = null; }
  if (!data) return;
  coins = data.coins || 0;
  ownedPets = data.pets || (data.pet ? [data.pet] : []);
  bonusPet = data.bonusPet || null;
  hintPet = data.hintPet || null;
  celebration = data.celeb || '🎉';
  ownedCelebs = data.owned || ['🎉'];
  if (ownedCelebs.indexOf('🎉') === -1) ownedCelebs.push('🎉');
  if (data.facts) {
    facts.forEach(f => {
      const s = data.facts[key(f.a, f.b)];
      if (s) { f.streak = s.s || 0; f.mastered = !!s.m; f.wrong = s.w || 0; f.mt = s.mt || 0; }
    });
  }
}
// одноразовая починка: 306 евро и без питомцев (баг с невозвратом за Единорога)
function applyOneTimeFix() {
  try {
    if (localStorage.getItem('mult_fix_306')) return;
    coins = 306; ownedPets = []; bonusPet = null; hintPet = null;
    localStorage.setItem('mult_fix_306', '1');
    saveState();
  } catch (e) { /* нет доступа */ }
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
function factsByFactorsList(factors) { return facts.filter(f => factors.includes(f.a)); }

function fmtTotal(ms) { return Math.round(ms / 1000); }
function fmtAvg(ms, n) { return n ? (Math.round((ms / n) / 100) / 10) : 0; }
function timeLine(ms, n) { return n ? t('timeLine', { tot: fmtTotal(ms), avg: fmtAvg(ms, n) }) : ''; }

// =================== ПОДСКАЗКИ ===================
function methodStr(method, a, b) {
  const r = a * b;
  if (method === 'frame') return t('h_frame', { a: a, b: b });
  if (method === 'neighbor') {
    if (b >= 2) return `${a}×${b - 1}=${a * (b - 1)}, +${a}`;
    if (a >= 2) return `${a - 1}×${b}=${(a - 1) * b}, +${b}`;
    return t('h_frame', { a, b });
  }
  if (method === 'skip') {
    if (a === 0 || b === 0) return '0';
    const seq = []; for (let i = 1; i <= a; i++) seq.push(i * b); return seq.join(', ');
  }
  if (method === 'add') {
    if (a === 0 || b === 0) return '0';
    const parts = []; for (let i = 0; i < a; i++) parts.push(b); return parts.join('+') + ' = ' + r;
  }
  if (method === 'five') {
    if (b >= 6) return `${a}×5 + ${a}×${b - 5} = ${a * 5}+${a * (b - 5)} = ${r}`;
    if (a >= 6) return `5×${b} + ${a - 5}×${b} = ${5 * b}+${(a - 5) * b} = ${r}`;
    return methodStr('add', a, b);
  }
  if (method === 'ten') {
    if (b >= 6 && b <= 9) return `${a}×10 − ${a}×${10 - b} = ${a * 10}−${a * (10 - b)} = ${r}`;
    if (a >= 6 && a <= 9) return `10×${b} − ${10 - a}×${b} = ${10 * b}−${(10 - a) * b} = ${r}`;
    return methodStr('add', a, b);
  }
  if (method === 'half') {
    if (b % 2 === 0 && b > 0) return `${a}×${b / 2} + ${a}×${b / 2} = ${a * (b / 2)}+${a * (b / 2)} = ${r}`;
    if (a % 2 === 0 && a > 0) return `${a / 2}×${b} + ${a / 2}×${b} = ${(a / 2) * b}+${(a / 2) * b} = ${r}`;
    return methodStr('neighbor', a, b);
  }
  return t('h_frame', { a, b });
}
// трюк (только легендарные); возвращает строку или null
function trickStr(a, b) {
  const r = a * b;
  if (a === 0 || b === 0) return t('trick_zero');
  if (a === 1 || b === 1) return t('trick_one', { r });
  if (a === 10 || b === 10) return t('trick_ten', { r });
  const other = a === 11 ? b : (b === 11 ? a : null);
  if (other !== null && other >= 1 && other <= 9) return t('trick_eleven', { r });
  return null;
}
function hintBody(emoji, a, b) {
  const pet = petByEmoji[emoji];
  if (!pet) return methodStr('add', a, b);
  if (pet.legendary) { const tr = trickStr(a, b); if (tr) return tr; }
  return methodStr(pet.hint, a, b);
}

// =================== МЕНЮ ===================
function renderMenu() {
  el.overallMastered.textContent = overallMastered();
  updateBalances();
  el.levelButtons.innerHTML = '';

  const randBtn = document.createElement('button');
  randBtn.type = 'button';
  randBtn.className = 'level-btn';
  randBtn.innerHTML = `<span class="lvl-name">🎲</span><span class="lvl-sub">${t('randName')}</span>` +
    `<span class="lvl-progress">${t('randTap')}</span>`;
  randBtn.addEventListener('click', showRandom);
  el.levelButtons.appendChild(randBtn);

  const customBtn = document.createElement('button');
  customBtn.type = 'button';
  const cDone = overallMastered();
  const cComplete = cDone === facts.length;
  customBtn.className = 'level-btn' + (cComplete ? ' complete' : '');
  customBtn.innerHTML = `<span class="lvl-name">✎</span><span class="lvl-sub">${t('customTitle')}</span>` +
    `<span class="lvl-progress">${t('learnedX', { d: cDone, t: facts.length })}</span>`;
  customBtn.addEventListener('click', showCustom);
  el.levelButtons.appendChild(customBtn);

  const dictBtn = document.createElement('button');
  dictBtn.type = 'button';
  dictBtn.className = 'level-btn';
  if (overallMastered() > 0) {
    dictBtn.innerHTML = `<span class="lvl-name">📝</span><span class="lvl-sub">${t('dictName')}</span>` +
      `<span class="lvl-progress">${t('dictControl')}</span>`;
    dictBtn.addEventListener('click', showDictSetup);
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
  el.dictScreen.classList.add('hidden');
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
  setTimeout(() => { if (el.shopMessage.textContent === text) el.shopMessage.textContent = ''; }, 1400);
}
function petCard(p, container) {
  const count = ownedPets.filter(e => e === p.emoji).length;
  const owned = count > 0;
  const card = document.createElement('div');
  card.className = 'shop-item' + (owned ? ' owned' : '');
  card.innerHTML =
    `<span class="shop-emoji">${p.emoji}${count > 1 ? '<span class="pet-count">×' + count + '</span>' : ''}</span>` +
    `<span class="shop-bonus">+${p.bonus}%</span>` +
    `<span class="shop-hint">${t('hintLvl', { n: petLevel(p.emoji) })}</span>` +
    `<button type="button" class="buy-btn">${t('buy')} · ${p.price} ${t('currency')}</button>` +
    (owned ? `<div class="role-row">
        <button type="button" class="role-btn role-bonus${bonusPet === p.emoji ? ' on' : ''}">${t('roleBonus')}</button>
        <button type="button" class="role-btn role-hint${hintPet === p.emoji ? ' on' : ''}">${t('roleHint')}</button>
      </div>` : '');
  card.querySelector('.buy-btn').addEventListener('click', () => buyPet(p));
  if (owned) {
    card.querySelector('.role-bonus').addEventListener('click', () => setRole('bonus', p.emoji));
    card.querySelector('.role-hint').addEventListener('click', () => setRole('hint', p.emoji));
  }
  container.appendChild(card);
}
function renderShop() {
  updateBalances();
  el.petsOwned.textContent = t('petsOwned', { n: ownedPets.length });
  el.shopPets.innerHTML = '';
  REGULAR_PETS.forEach(p => petCard(p, el.shopPets));
  el.shopLegendary.innerHTML = '';
  LEGENDARY_PETS.forEach(p => petCard(p, el.shopLegendary));
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
  if (coins < p.price) { shopMsg(t('notEnough')); return; }
  coins -= p.price;
  ownedPets.push(p.emoji);
  updatePet(); saveState(); renderShop();
}
// роль (bonus/hint) у РАЗНЫХ питомцев
function setRole(role, emoji) {
  if (role === 'bonus') {
    if (hintPet === emoji) { shopMsg(t('oneRole')); return; }
    bonusPet = (bonusPet === emoji) ? null : emoji;
  } else {
    if (bonusPet === emoji) { shopMsg(t('oneRole')); return; }
    hintPet = (hintPet === emoji) ? null : emoji;
  }
  updatePet(); saveState(); renderShop();
}
function pickCeleb(c) {
  const owned = ownedCelebs.indexOf(c.emoji) !== -1;
  if (!owned) {
    if (coins < c.price) { shopMsg(t('notEnough')); return; }
    coins -= c.price;
    ownedCelebs.push(c.emoji);
  }
  celebration = c.emoji;
  saveState(); renderShop();
}

// =================== СВОЙ ВЫБОР ===================
function showCustom() {
  el.customProgress.textContent = `${t('learnedTotal')} ${overallMastered()} ${t('of')} ${facts.length}`;
  el.customChecks.innerHTML = '';
  const tot = MAX - MIN + 1;
  for (let k = MIN; k <= MAX; k++) {
    const done = facts.filter(f => f.a === k && f.mastered).length;
    const complete = done === tot;
    const wrap = document.createElement('label');
    wrap.className = 'check-item';
    wrap.innerHTML = `<span class="check-top"><input type="checkbox" value="${k}"> ×${k}</span>` +
      `<span class="check-progress${complete ? ' done' : ''}">${complete ? t('done') : done + '/' + tot}</span>`;
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
    title: t('customTitle'), finishTitle: t('finishCustom'),
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

// =================== СЕАНС ===================
function startSession(opts) {
  session = {
    kind: opts.kind, targets: opts.targets, temp: !!opts.temp, progress: !!opts.progress,
    need: opts.need || NEED_STREAK, title: opts.title,
    finishTitle: opts.finishTitle || t('finishRandom'), reward: opts.reward || 0,
    streak: {}, log: [], timeMs: 0, answers: 0, wrongTotal: 0, hintUsed: false,
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
  const elapsed = Date.now() - qStartTime;
  session.timeMs += elapsed;
  session.answers++;
  current.mt = Math.max(current.mt, elapsed);

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
    current.wrong++;
    if (session.temp) session.streak[key(current.a, current.b)] = 0;
    else current.streak = 0;
    if (session.progress && !current.mastered) current.streak = 0;
    session.wrongTotal++;
    const lesson = (session.kind === 'random' || session.kind === 'custom');
    if (hintPet && lesson && !session.hintUsed && session.wrongTotal >= 2) {
      session.hintUsed = true;
      flash(t('petHint', { e: hintPet, a: current.a, b: current.b, sum: hintBody(hintPet, current.a, current.b) }), 'ok', 3333);
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
  const earned = Math.round(session.reward * petBonusMultiplier());
  if (earned > 0) addCoins(earned);
  showResults(session.finishTitle, session.log, session.timeMs, session.answers, earned);
}

// =================== ДИКТАНТ ===================
function showDictSetup() {
  const learned = masteredFacts().length;
  if (learned === 0) { showMenu(t('dictNeedLevelShort')); return; }
  el.dictPrompt.textContent = t('dictPrompt', { n: learned });
  el.dictCount.value = learned >= 15 ? Math.min(20, learned) : 15;
  hideAllScreens();
  el.dictScreen.classList.remove('hidden');
}
// подбор примеров: сначала ошибочные, потом медленные, потом сложные; добивка повторами
function selectDictExamples(N) {
  const learned = masteredFacts();
  const wrongPool = learned.filter(f => f.wrong > 0).sort((x, y) => y.wrong - x.wrong);
  let chosen;
  if (wrongPool.length >= N) {
    chosen = wrongPool.slice(0, N);
  } else {
    chosen = wrongPool.slice();
    const slow = learned.filter(f => f.wrong === 0 && f.mt > SLOW_MS).sort((x, y) => y.mt - x.mt);
    for (const f of slow) { if (chosen.length >= N) break; chosen.push(f); }
    if (chosen.length < N) {
      const rest = learned.filter(f => chosen.indexOf(f) === -1)
        .sort((x, y) => factValue(y.a, y.b) - factValue(x.a, x.b)); // сложные вперёд
      for (const f of rest) { if (chosen.length >= N) break; chosen.push(f); }
    }
    // если выучено меньше N — добиваем повторами самых ошибочных (или любых)
    const pad = wrongPool.length ? wrongPool : learned;
    let i = 0;
    while (chosen.length < N && pad.length) { chosen.push(pad[i % pad.length]); i++; }
  }
  return shuffle(chosen);
}
function startDictation() {
  const learnedCount = masteredFacts().length;
  if (learnedCount === 0) { showMenu(t('dictNeedLevelShort')); return; }
  let N = parseInt(el.dictCount.value, 10);
  if (isNaN(N) || N < 15) N = 15;
  if (learnedCount >= 15 && N > learnedCount) N = learnedCount;
  if (learnedCount < 15) N = 15;
  const chosen = selectDictExamples(N);
  dict = { timeMs: 0, answers: 0, correct: 0, wrong: 0 };
  dict.roundList = chosen;
  dict.reward = rewardForFacts([...new Set(chosen)]);
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
  const elapsed = Date.now() - qStartTime;
  dict.timeMs += elapsed;
  dict.answers++;
  dict.answered++;
  current.mt = Math.max(current.mt, elapsed);
  const value = parseInt(raw, 10);
  const right = current.a * current.b;
  if (value === right) {
    dict.correct++;
    flash(t('dictCorrect'), 'ok', 500);
  } else {
    dict.wrong++;
    current.wrong++;
    dict.mistakes.add(key(current.a, current.b));
    const tw = twin(current);
    if (tw) dict.mistakes.add(key(tw.a, tw.b));
    flash(t('dictRemember', { a: current.a, b: current.b, r: right }), 'bad');
  }
  saveState();
  updateDictStats();
}
function endDictRound() {
  if (dict.mistakes.size === 0) { winDictation(); return; }
  const targets = [...dict.mistakes].map(k => factByKey[k]);
  startSession({ kind: 'dictLearn', temp: true, targets: targets, title: t('dictLearnTitle') });
}
function winDictation() {
  mode = null;
  const earned = Math.round(dict.reward * petBonusMultiplier());
  addCoins(earned);
  el.winTitle.textContent = t('winDictTitle');
  el.winText.textContent = t('winDictText');
  el.winCorrect.textContent = dict.correct;
  el.winWrong.textContent = dict.wrong;
  el.winCoins.textContent = t('coinsPlus', { n: earned });
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
el.dictBackBtn.addEventListener('click', () => showMenu());
el.dictStartBtn.addEventListener('click', startDictation);
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
applyOneTimeFix();
updatePet();
applyLang();
showMenu();
