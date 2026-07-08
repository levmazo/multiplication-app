// === Тренажёр таблицы умножения ===
// Числа 0..12 (169 примеров). Режимы: 🎲 Случайный набор, ✎ Свой выбор, 📝 Диктант.
// Выучено = 2 правильных ПОДРЯД. Евро за прохождение → магазин (питомцы, праздники).
// Питомцы: коллекция; сидят рядом, один назначается на «Подсказки». Языки: RU/NL/EN.
// Таймер (вкл. в Настройках): полоска на ответ, мигает при ≤3с; «не успел» в уроке — не ошибка
// (счётчик), в диктанте — в повторение и минус из награды; пауза только при таймере.

const MIN = 0;
const MAX = 12;
const NEED_STREAK = 2;
const SLOW_MS = 30000; // «долго думал» — для подбора примеров в диктант

// --- Фиксированная награда ЗА ПРОХОД ЦЕЛОЙ ТАБЛИЦЫ (по сложности) ---
// ×0 → 5; ×1,2,5,10,11 → 7; ×3,4 → 30; ×6,7,8 → 70; ×9,12 → 100.
const TABLE_REWARD = { 0: 5, 1: 7, 2: 7, 5: 7, 10: 7, 11: 7, 3: 30, 4: 30, 6: 70, 7: 70, 8: 70, 9: 100, 12: 100 };
const PER_TABLE = MAX - MIN + 1; // 13 примеров в таблице
// цена одного примера = доля от награды его таблицы (по первому числу a);
// сумма 13 долей целой таблицы = ровно её награда
function factValue(a, b) { return (TABLE_REWARD[a] || 0) / PER_TABLE; }
function rewardForFacts(list) { return list.reduce((s, f) => s + factValue(f.a, f.b), 0); }

// --- Питомцы: цена, способ подсказки, легендарность ---
const REGULAR_PETS = [
  { emoji: '🐱', price: 70,  hint: 'frame' },
  { emoji: '🐶', price: 150, hint: 'neighbor' },
  { emoji: '🐉', price: 220, hint: 'skip' },
  { emoji: '🦄', price: 400, hint: 'add' },
];
const LEGENDARY_PETS = [
  { emoji: '🦖', price: 5000,  hint: 'five', legendary: true },
  { emoji: '🐲', price: 7000,  hint: 'ten',  legendary: true },
  { emoji: '🦅', price: 12000, hint: 'half', legendary: true },
];
const ALL_PETS = REGULAR_PETS.concat(LEGENDARY_PETS);
const petByEmoji = {};
ALL_PETS.forEach(p => { petByEmoji[p.emoji] = p; });
function petLevel(emoji) { return ALL_PETS.findIndex(p => p.emoji === emoji) + 1; }

const CELEBS = [
  { emoji: '🎉', price: 0 },
  { emoji: '✨', price: 40 },
  { emoji: '🎆', price: 80 },
  { emoji: '🌈', price: 120 },
];

// =================== ПЕРЕВОДЫ ===================
const STR = {
  ru: {
    menuTitle: '✖️ Таблица умножения', learnedTotal: 'Выучено всего:',
    of: 'из', resetAll: 'Сбросить весь прогресс', backMenu: '← Обратно',
    settingsTitle: 'Settings', langSection: 'Язык', timerWord: 'Таймер', settingsBack: '← Обратно',
    mapTitle: 'Карта', mapTap: 'смотреть', mapBack: '← Карта', realMap: 'Настоящая карта', gridMap: 'Сетка',
    guestBanner: '🚪 Гость прилетел!', guestTitle: '🚪 Гость прилетел!', guestDoorHint: 'Найди дверь и открой её.',
    guestChallenge: 'Помоги гостю: реши 15 задач', guestGone: 'Гость улетел 😔 (кончилось терпение)',
    guestSearchHint: 'Открывай двери — за одной прячется гость! 🚪', guestExit: '← Выйти из поиска',
    guestReadyQ: 'Готов к задаче?', guestReady: 'Готов!',
    guestGood: 'Верно! 😊', guestBad: 'Ошибка… гость грустит',
    guestEmpty: ['Тут пусто…', 'Только паутина 🕸️', 'Никого нет', 'Скрип… и пусто', 'Пустая комната'],
    guestGift: '🎁 Подарок гостя!', guestGiftText: 'Ты получил особый праздник: {e}',
    specialsTitle: 'Особые праздники (от гостя)', specialsEmpty: 'Пока пусто — помоги гостю, и он подарит особый праздник.',
    legDone: 'верно', legMissed: 'не успел', legWrong: 'неверно', legNone: 'не решал', tableOf: 'Таблица ×{n}',
    timerEnable: 'Включить таймер', timerSecPre: 'Таймер на', timerSecPost: 'секунд',
    missedLbl: 'Не успел:', fbTimeout: '⏰ Время вышло! Попробуй решить эту задачку вовремя чуть позже.',
    dictTimeout: '⏰ Не успел: {a}×{b}={r}',
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
    myPetsBtn: '🐾 Мои питомцы', myPetsTitle: '🐾 Мои питомцы', petsEmpty: 'Питомцев пока нет — купи их в магазине.',
    petsHint: 'Питомцы сидят рядом. Выбери одного, кто будет давать подсказки.',
    petsOwned: 'У тебя питомцев: {n}', legendaryTitle: 'Легендарные питомцы', celebsTitle: 'Праздники победы',
    buy: 'Купить', notEnough: 'Мало монет', free: 'бесплатно', active: 'Активно', select: 'Выбрать',
    roleHint: 'Подсказки',
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
    menuTitle: '✖️ vermenigvuldigen', learnedTotal: 'In totaal geleerd:',
    of: 'van', resetAll: 'Alle voortgang wissen', backMenu: '← Terug',
    settingsTitle: 'Settings', langSection: 'Taal', timerWord: 'Timer', settingsBack: '← Terug',
    mapTitle: 'Kaart', mapTap: 'bekijk', mapBack: '← Kaart', realMap: 'Echte kaart', gridMap: 'Rooster',
    guestBanner: '🚪 Er is een gast!', guestTitle: '🚪 Er is een gast!', guestDoorHint: 'Zoek de deur en open hem.',
    guestChallenge: 'Help de gast: los 15 sommen op', guestGone: 'De gast is weg 😔 (geduld op)',
    guestSearchHint: 'Open de deuren — achter één zit de gast! 🚪', guestExit: '← Stop met zoeken',
    guestReadyQ: 'Klaar voor de sommen?', guestReady: 'Klaar!',
    guestGood: 'Goed! 😊', guestBad: 'Fout… de gast wordt verdrietig',
    guestEmpty: ['Hier is niets…', 'Alleen een spinnenweb 🕸️', 'Niemand hier', 'Kraak… en leeg', 'Lege kamer'],
    guestGift: '🎁 Cadeau van de gast!', guestGiftText: 'Je kreeg een speciaal feestje: {e}',
    specialsTitle: 'Speciale feestjes (van de gast)', specialsEmpty: 'Nog leeg — help de gast en je krijgt een speciaal feestje.',
    legDone: 'goed', legMissed: 'niet op tijd', legWrong: 'fout', legNone: 'niet gedaan', tableOf: 'Tafel van {n}',
    timerEnable: 'Timer aan', timerSecPre: 'Timer op', timerSecPost: 'seconden',
    missedLbl: 'Niet op tijd:', fbTimeout: '⏰ De tijd is om! Probeer deze som straks binnen de tijd op te lossen.',
    dictTimeout: '⏰ Niet op tijd: {a}×{b}={r}',
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
    myPetsBtn: '🐾 Mijn huisdieren', myPetsTitle: '🐾 Mijn huisdieren', petsEmpty: 'Nog geen huisdieren — koop ze in de winkel.',
    petsHint: 'Huisdieren zitten naast je. Kies er één die hints geeft.',
    petsOwned: 'Jouw huisdieren: {n}', legendaryTitle: 'Legendarische huisdieren', celebsTitle: 'Overwinningsfeestjes',
    buy: 'Kopen', notEnough: 'Te weinig munten', free: 'gratis', active: 'Actief', select: 'Kiezen',
    roleHint: 'Hints',
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
    menuTitle: '✖️ Multiplication table', learnedTotal: 'Learned in total:',
    of: 'of', resetAll: 'Reset all progress', backMenu: '← Back',
    settingsTitle: 'Settings', langSection: 'Language', timerWord: 'Timer', settingsBack: '← Back',
    mapTitle: 'Map', mapTap: 'view', mapBack: '← Map', realMap: 'Real map', gridMap: 'Grid',
    guestBanner: '🚪 A guest arrived!', guestTitle: '🚪 A guest arrived!', guestDoorHint: 'Find the door and open it.',
    guestChallenge: 'Help the guest: solve 15 problems', guestGone: 'The guest flew away 😔 (ran out of patience)',
    guestSearchHint: 'Open the doors — the guest hides behind one! 🚪', guestExit: '← Stop searching',
    guestReadyQ: 'Ready for the problems?', guestReady: 'Ready!',
    guestGood: 'Correct! 😊', guestBad: 'Wrong… the guest is sad',
    guestEmpty: ['Nothing here…', 'Just a cobweb 🕸️', 'Nobody here', 'Creak… and empty', 'Empty room'],
    guestGift: '🎁 Guest gift!', guestGiftText: 'You got a special celebration: {e}',
    specialsTitle: 'Special celebrations (from the guest)', specialsEmpty: 'Empty for now — help the guest to get a special celebration.',
    legDone: 'correct', legMissed: 'missed', legWrong: 'wrong', legNone: 'not done', tableOf: 'Table of {n}',
    timerEnable: 'Enable timer', timerSecPre: 'Timer for', timerSecPost: 'seconds',
    missedLbl: 'Missed:', fbTimeout: '⏰ Time is up! Try to solve it in time a bit later.',
    dictTimeout: '⏰ Time is up: {a}×{b}={r}',
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
    myPetsBtn: '🐾 My pets', myPetsTitle: '🐾 My pets', petsEmpty: 'No pets yet — buy them in the shop.',
    petsHint: 'Pets sit with you. Pick one to give hints.',
    petsOwned: 'Your pets: {n}', legendaryTitle: 'Legendary pets', celebsTitle: 'Victory celebrations',
    buy: 'Buy', notEnough: 'Not enough coins', free: 'free', active: 'Active', select: 'Select',
    roleHint: 'Hints',
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
    // last: 0 не решал · 1 верно (зелёный) · 2 не успел (оранжевый) · 3 неверно (красный)
    const f = { a, b, streak: 0, mastered: false, wrong: 0, mt: 0, last: 0 };
    facts.push(f);
    factByKey[key(a, b)] = f;
  }
}
function twin(f) { return factByKey[key(f.b, f.a)]; }

// --- Состояние ---
let coins = 0;
let timerOn = false;          // включён ли таймер на ответ
let timerSec = 5;             // секунд на пример (1..35)
let openSection = null;       // null | 'lang' | 'timer' — открытый раздел настроек
let ownedPets = [];           // список emoji (коллекция, можно повторы)
let hintPet = null;           // emoji питомца, дающего подсказки
let celebration = '🎉';
let ownedCelebs = ['🎉'];
// Гость: особые праздники (только от гостя, купить нельзя)
const SPECIAL_CELEBS = ['🎇', '💤', '🪅', '🎈', '🎁', '🏆', '🥳', '🪩', '🧨', '💥', '⭐', '🎆', '☄️', '🎠', '🎡', '🎢', '🎪', '🍾', '🥂', '🎖️'];
let ownedSpecials = [];       // полученные особые праздники
let guestWaiting = false;     // гость прилетел и ждёт (только пока играешь)
let guestTimer = null;
let guestSearching = false;   // режим поиска: кнопки меню — двери
let guestDoorBtns = [];       // кнопки-двери в режиме поиска
let guestDoorBtn = null;      // за какой дверью прячется гость
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
  settingsBtn: document.getElementById('settingsBtn'),
  settingsScreen: document.getElementById('settings-screen'),
  settingsBackBtn: document.getElementById('settingsBackBtn'),
  settingsRoot: document.getElementById('settingsRoot'),
  langSection: document.getElementById('langSection'),
  timerSection: document.getElementById('timerSection'),
  langPanel: document.getElementById('langPanel'),
  timerPanel: document.getElementById('timerPanel'),
  timerLamp: document.getElementById('timerLamp'),
  timerSecRow: document.getElementById('timerSecRow'),
  timerSecInput: document.getElementById('timerSecInput'),
  overallMastered: document.getElementById('overallMastered'),
  overallTotal: document.getElementById('overallTotal'),
  coinBalance: document.getElementById('coinBalance'),
  levelMessage: document.getElementById('levelMessage'),
  levelButtons: document.getElementById('levelButtons'),
  shopBtn: document.getElementById('shopBtn'),
  mapMenuBtn: document.getElementById('mapMenuBtn'),
  mapScreen: document.getElementById('map-screen'),
  mapBackBtn: document.getElementById('mapBackBtn'),
  realMapBtn: document.getElementById('realMapBtn'),
  gridMapBtn: document.getElementById('gridMapBtn'),
  realmapScreen: document.getElementById('realmap-screen'),
  realmapBackBtn: document.getElementById('realmapBackBtn'),
  realmapRoad: document.getElementById('realmapRoad'),
  legend1: document.getElementById('legend1'),
  gridScreen: document.getElementById('grid-screen'),
  gridBackBtn: document.getElementById('gridBackBtn'),
  gridRoot: document.getElementById('gridRoot'),
  legend2: document.getElementById('legend2'),
  shopScreen: document.getElementById('shop-screen'),
  shopBackBtn: document.getElementById('shopBackBtn'),
  shopBalance: document.getElementById('shopBalance'),
  shopMessage: document.getElementById('shopMessage'),
  petsOwned: document.getElementById('petsOwned'),
  shopPets: document.getElementById('shopPets'),
  shopLegendary: document.getElementById('shopLegendary'),
  shopCelebs: document.getElementById('shopCelebs'),
  shopSpecials: document.getElementById('shopSpecials'),
  specialsEmpty: document.getElementById('specialsEmpty'),
  guestBanner: document.getElementById('guestBanner'),
  guestExitBtn: document.getElementById('guestExitBtn'),
  guestSearchHint: document.getElementById('guestSearchHint'),
  guestScreen: document.getElementById('guest-screen'),
  guestBackBtn: document.getElementById('guestBackBtn'),
  guestStage: document.getElementById('guestStage'),
  guestReadyBtn: document.getElementById('guestReadyBtn'),
  guestMood: document.getElementById('guestMood'),
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
  timerwrap: document.getElementById('timerwrap'),
  timerNum: document.getElementById('timerNum'),
  timerfill: document.getElementById('timerfill'),
  missed: document.getElementById('missed'),
  missedWrap: document.getElementById('missedWrap'),
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
  myPetsBtn: document.getElementById('myPetsBtn'),
  myPetsShopBtn: document.getElementById('myPetsShopBtn'),
  petsScreen: document.getElementById('pets-screen'),
  petsList: document.getElementById('petsList'),
  petsEmpty: document.getElementById('petsEmpty'),
  petsBackBtn: document.getElementById('petsBackBtn'),
};

// экран «Мои питомцы»: коллекция посередине; у подсказочного — подпись
function updatePet() {
  el.petsList.innerHTML = ownedPets.map(e => {
    const role = (e === hintPet) ? t('roleHint') : '';
    return `<span class="pet-one">${role ? `<span class="pet-label">${role}</span>` : ''}${e}</span>`;
  }).join('');
  el.petsEmpty.classList.toggle('hidden', ownedPets.length > 0);
}
// показать экран питомцев
function showPets() {
  updatePet();
  hideAllScreens();
  el.petsScreen.classList.remove('hidden');
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
  if (msgTimer) { clearTimeout(msgTimer); msgTimer = null; }
  el.levelMessage.textContent = '';
  applyLang();
  renderSettings();
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
  const data = { facts: {}, coins, timerOn, timerSec, pets: ownedPets, hintPet, celeb: celebration, owned: ownedCelebs, specials: ownedSpecials };
  facts.forEach(f => { data.facts[key(f.a, f.b)] = { s: f.streak, m: f.mastered, w: f.wrong, mt: f.mt, l: f.last }; });
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { /* нет доступа */ }
}
function loadState() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { data = null; }
  if (!data) return;
  coins = data.coins || 0;
  timerOn = !!data.timerOn;
  timerSec = Math.min(35, Math.max(1, data.timerSec || 5));
  ownedPets = data.pets || (data.pet ? [data.pet] : []);
  hintPet = data.hintPet || null;
  celebration = data.celeb || '🎉';
  ownedCelebs = data.owned || ['🎉'];
  ownedSpecials = data.specials || [];
  if (ownedCelebs.indexOf('🎉') === -1) ownedCelebs.push('🎉');
  if (data.facts) {
    facts.forEach(f => {
      const s = data.facts[key(f.a, f.b)];
      if (s) { f.streak = s.s || 0; f.mastered = !!s.m; f.wrong = s.w || 0; f.mt = s.mt || 0; f.last = s.l || 0; }
    });
  }
}
// одноразовая починка: 306 евро и без питомцев (баг с невозвратом за Единорога)
function applyOneTimeFix() {
  try {
    if (localStorage.getItem('mult_fix_306')) return;
    coins = 306; ownedPets = []; hintPet = null;
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

  updateGuestMenuUI();
}

function updateTimerUI() {
  el.timerLamp.classList.toggle('on', timerOn);
  el.timerSecRow.classList.toggle('hidden', !timerOn);
  el.timerSecInput.value = timerSec;
}
function renderSettings() {
  el.settingsRoot.classList.toggle('hidden', openSection !== null);
  el.langPanel.classList.toggle('hidden', openSection !== 'lang');
  el.timerPanel.classList.toggle('hidden', openSection !== 'timer');
  el.settingsBackBtn.textContent = t('settingsBack');
  updateTimerUI();
}
function showSettings() {
  openSection = null;
  renderSettings();
  hideAllScreens();
  el.settingsScreen.classList.remove('hidden');
}
function settingsBack() {
  if (openSection !== null) { openSection = null; renderSettings(); }
  else showMenu();
}
function toggleTimer() { timerOn = !timerOn; saveState(); updateTimerUI(); }
function setTimerSec(v) {
  let n = parseInt(v, 10);
  if (isNaN(n) || n < 1) n = 1;
  if (n > 35) n = 35;
  timerSec = n;
  el.timerSecInput.value = n;
  saveState();
}
// =================== КАРТА ===================
const STATUS_CLASS = ['status-none', 'status-ok', 'status-miss', 'status-wrong'];
function statusClass(f) { return STATUS_CLASS[f.last] || 'status-none'; }

function renderLegend(container) {
  const items = [
    ['status-ok', t('legDone')],
    ['status-miss', t('legMissed')],
    ['status-wrong', t('legWrong')],
    ['status-none', t('legNone')],
  ];
  container.innerHTML = items
    .map(([c, l]) => `<span class="lg"><span class="dot ${c}"></span>${l}</span>`)
    .join('');
}

// нажал на пример → тренируешь всю таблицу первого числа (×a: a×0 … a×12)
function startTable(a) {
  const targets = factsByFactorsList([a]);
  startSession({
    kind: 'custom', temp: true, progress: true,
    targets: targets, reward: rewardForFacts(targets),
    title: t('tableOf', { n: a }), finishTitle: t('finishCustom'),
  });
}

function showMap() {
  hideAllScreens();
  el.mapScreen.classList.remove('hidden');
}

// сгладить ломаную через точки (Catmull-Rom → кубические Безье) — извилистая тропинка
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = 'M' + pts[0][0] + ' ' + pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
  }
  return d;
}
const STATUS_FILL = { 'status-none': '#9ca3af', 'status-ok': '#22c55e', 'status-miss': '#f59e0b', 'status-wrong': '#ef4444' };
function rmTree(x, y) {
  return '<g>' +
    '<rect x="' + (x - 2) + '" y="' + (y + 1) + '" width="4" height="9" rx="1" fill="#6b4a2a"/>' +   // ствол потолще
    '<circle cx="' + (x - 5) + '" cy="' + (y + 1) + '" r="5" fill="#4aa350"/>' +
    '<circle cx="' + (x + 5) + '" cy="' + (y + 1) + '" r="5" fill="#4aa350"/>' +
    '<circle cx="' + x + '" cy="' + (y - 3) + '" r="7" fill="#3f8f43"/>' +
  '</g>';
}
function rmBush(x, y) {
  return '<g fill="#57a95a">' +
    '<circle cx="' + (x - 4) + '" cy="' + (y + 1) + '" r="3.5"/>' +
    '<circle cx="' + (x + 4) + '" cy="' + (y + 1) + '" r="3.5"/>' +
    '<circle cx="' + x + '" cy="' + (y - 1) + '" r="4.5"/>' +
  '</g>';
}
// расстояние от точки до отрезка (чтобы не сажать растения на тропинку)
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
// деревья и кусты, РАЗБРОСАННЫЕ природно по всей поляне (не рядами), но не на тропе
function mapDecor(pts, W, H) {
  const farFromTrail = (x, y) => {
    for (let i = 0; i < pts.length - 1; i++) {
      if (segDist(x, y, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y) < 22) return false;
    }
    return true;
  };
  const target = Math.round(H / 22);
  let s = '', placed = 0, tries = 0;
  while (placed < target && tries < target * 8) {
    tries++;
    const x = 9 + Math.random() * (W - 18);
    const y = 16 + Math.random() * (H - 26);
    if (!farFromTrail(x, y)) continue;
    s += (Math.random() < 0.5 ? rmTree(x, y) : rmBush(x, y));
    placed++;
  }
  return s;
}
// настоящая карта: узкая забытая лесная тропинка, остановки идут по ней одна за другой
function buildRealMap() {
  const W = 300, perRow = 3, r = 16, rowGap = 60, y0 = 34, x0 = 40;
  const colGap = (W - 2 * x0) / (perRow - 1);
  const pts = facts.map((f, i) => {
    const row = Math.floor(i / perRow);
    let col = i % perRow;
    if (row % 2 === 1) col = perRow - 1 - col;           // змейка
    return { x: x0 + col * colGap, y: y0 + row * rowGap, f };
  });
  const nRows = Math.ceil(facts.length / perRow);
  const H = y0 + nRows * rowGap;
  const d = smoothPath(pts.map(p => [p.x, p.y]));
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="display:block">';
  s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#a7d18a"/>';   // лесная поляна
  // узкая землистая тропинка (без разметки): тёмный кант + светлый грунт
  s += '<path d="' + d + '" fill="none" stroke="#7c6238" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>';
  s += '<path d="' + d + '" fill="none" stroke="#c7ac7d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
  s += mapDecor(pts, W, H);
  // остановки поверх тропинки
  for (const p of pts) {
    const fill = STATUS_FILL[statusClass(p.f)] || '#9ca3af';
    s += '<g class="rm-stop" data-a="' + p.f.a + '" style="cursor:pointer">' +
      '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '" fill="' + fill + '" stroke="#fff" stroke-width="2.5"/>' +
      '<text x="' + p.x + '" y="' + (p.y + 3.2) + '" text-anchor="middle" font-size="8.5" font-weight="800" fill="#111827">' + p.f.a + '×' + p.f.b + '</text>' +
      '</g>';
  }
  s += '</svg>';
  el.realmapRoad.innerHTML = s;
}
function showRealMap() {
  renderLegend(el.legend1);
  buildRealMap();
  hideAllScreens();
  el.realmapScreen.classList.remove('hidden');
  window.scrollTo(0, 0);
}

function buildGrid() {
  const n = MAX - MIN + 1;
  el.gridRoot.style.gridTemplateColumns = `repeat(${n + 1}, 1fr)`;  // резиновые клетки — всегда влезают
  el.gridRoot.innerHTML = '';
  const head = txt => { const d = document.createElement('div'); d.className = 'grid-head'; d.textContent = txt; return d; };
  el.gridRoot.appendChild(head('×'));
  for (let b = MIN; b <= MAX; b++) el.gridRoot.appendChild(head(b));
  for (let a = MIN; a <= MAX; a++) {
    el.gridRoot.appendChild(head(a));
    for (let b = MIN; b <= MAX; b++) {
      const f = factByKey[key(a, b)];
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'grid-cell ' + statusClass(f);
      c.title = `${a}×${b}`;
      c.addEventListener('click', () => startTable(a));
      el.gridRoot.appendChild(c);
    }
  }
}
function showGrid() {
  renderLegend(el.legend2);
  buildGrid();
  hideAllScreens();
  el.gridScreen.classList.remove('hidden');
  window.scrollTo(0, 0);
}

function hideAllScreens() {
  el.menuScreen.classList.add('hidden');
  el.settingsScreen.classList.add('hidden');
  el.mapScreen.classList.add('hidden');
  el.realmapScreen.classList.add('hidden');
  el.gridScreen.classList.add('hidden');
  el.shopScreen.classList.add('hidden');
  el.customScreen.classList.add('hidden');
  el.randomScreen.classList.add('hidden');
  el.dictScreen.classList.add('hidden');
  el.gameScreen.classList.add('hidden');
  el.resultsScreen.classList.add('hidden');
  el.winScreen.classList.add('hidden');
  el.guestScreen.classList.add('hidden');
  el.petsScreen.classList.add('hidden');
}

function showMenu(message) {
  mode = null;
  paused = false;
  answering = false;
  hideTimer();
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
    `<span class="shop-hint">${t('hintLvl', { n: petLevel(p.emoji) })}</span>` +
    `<button type="button" class="buy-btn">${t('buy')} · ${p.price} ${t('currency')}</button>` +
    (owned ? `<div class="role-row">
        <button type="button" class="role-btn role-hint${hintPet === p.emoji ? ' on' : ''}">${t('roleHint')}</button>
      </div>` : '');
  card.querySelector('.buy-btn').addEventListener('click', () => buyPet(p));
  if (owned) {
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
  // особые праздники (только полученные от гостя)
  el.shopSpecials.innerHTML = '';
  el.specialsEmpty.classList.toggle('hidden', ownedSpecials.length > 0);
  ownedSpecials.forEach(e => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'shop-item' + (celebration === e ? ' active' : '');
    b.innerHTML = `<span class="shop-emoji">${e}</span><span class="shop-price">${celebration === e ? t('active') : t('select')}</span>`;
    b.addEventListener('click', () => { celebration = e; saveState(); renderShop(); });
    el.shopSpecials.appendChild(b);
  });
}
function buyPet(p) {
  if (coins < p.price) { shopMsg(t('notEnough')); return; }
  coins -= p.price;
  ownedPets.push(p.emoji);
  updatePet(); saveState(); renderShop();
}
// назначить/снять питомца, дающего подсказки
function setRole(role, emoji) {
  hintPet = (hintPet === emoji) ? null : emoji;
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

// =================== ГОСТЬ ===================
const GUEST_MIN_MS = 15 * 60 * 1000;  // 15 минут
const GUEST_MAX_MS = 60 * 60 * 1000;  // 60 минут
const GUEST_NUMS = [3, 4, 6, 7, 8];   // средние/сложные множители
const GUEST_START_MOOD = 3;           // стартовое терпение гостя
const GUEST_MOOD_MAX = 8;             // максимум радости

// назначить следующий прилёт (таймер идёт, только пока игра открыта)
function scheduleGuest() {
  if (guestTimer) clearTimeout(guestTimer);
  const delay = GUEST_MIN_MS + Math.random() * (GUEST_MAX_MS - GUEST_MIN_MS);
  guestTimer = setTimeout(guestArrive, delay);
}
// гость прилетел — показать баннер в меню
function guestArrive() {
  if (guestWaiting) return;
  guestWaiting = true;
  if (!el.menuScreen.classList.contains('hidden')) renderMenu();
}

// --- Поиск гостя: кнопки меню становятся дверями ---
function guestDoors() {
  const list = Array.prototype.slice.call(el.levelButtons.querySelectorAll('button'));
  list.push(el.shopBtn, el.mapMenuBtn, el.settingsBtn);
  return list;
}
function startGuestSearch() {
  if (!guestWaiting) return;
  guestSearching = true;
  guestDoorBtns = guestDoors();
  guestDoorBtn = guestDoorBtns[Math.floor(Math.random() * guestDoorBtns.length)];
  guestDoorBtns.forEach(b => b.classList.add('door-live'));
  el.menuScreen.classList.add('searching');
  updateGuestMenuUI();
}
function exitGuestSearch() {
  guestSearching = false;
  guestDoorBtns.forEach(b => b.classList.remove('door-live', 'door-open'));
  guestDoorBtns = [];
  guestDoorBtn = null;
  el.menuScreen.classList.remove('searching');
  renderMenu();
}
// баннер / кнопка выхода / подсказка — без перестройки кнопок меню
function updateGuestMenuUI() {
  el.guestBanner.classList.toggle('hidden', !(guestWaiting && !guestSearching));
  el.guestExitBtn.classList.toggle('hidden', !guestSearching);
  el.guestSearchHint.classList.toggle('hidden', !guestSearching);
}
// перехват клика по «двери» до штатного перехода (фаза перехвата)
function onMenuDoorClick(e) {
  if (!guestSearching) return;
  const btn = e.target.closest('button');
  if (!btn || guestDoorBtns.indexOf(btn) === -1) return; // не дверь (напр. «выйти»)
  e.stopPropagation();
  e.preventDefault();
  openDoor(btn);
}
function openDoor(btn) {
  if (btn === guestDoorBtn) {
    guestSearching = false;
    guestDoorBtns.forEach(b => b.classList.remove('door-live', 'door-open'));
    el.menuScreen.classList.remove('searching');
    showGuestMeeting();
  } else {
    btn.classList.remove('door-open');
    void btn.offsetWidth;
    btn.classList.add('door-open');
    const arr = (STR[lang] && STR[lang].guestEmpty) || STR.ru.guestEmpty;
    el.levelMessage.textContent = arr[Math.floor(Math.random() * arr.length)];
    if (msgTimer) clearTimeout(msgTimer);
    msgTimer = setTimeout(() => { el.levelMessage.textContent = ''; msgTimer = null; }, 1100);
  }
}

// --- Встреча: человек с доской «Готов?» ---
function showGuestMeeting() {
  hideAllScreens();
  el.guestScreen.classList.remove('hidden');
  el.guestStage.innerHTML =
    `<div class="person-fig">${personSVG()}</div>` +
    `<div class="speech">${t('guestReadyQ')}</div>`;
}

// --- Испытание: 15 задач; временный набор, глобальную статистику не трогаем ---
function startGuestChallenge() {
  const combos = [];
  for (const a of GUEST_NUMS) for (const b of GUEST_NUMS) combos.push({ a, b });
  const targets = shuffle(combos).slice(0, 15).map(c => ({ a: c.a, b: c.b, streak: 0, mt: 0, wrong: 0, last: 0 }));
  startSession({ kind: 'guest', temp: true, progress: false, need: 1, targets, title: t('guestChallenge'), reward: 0 });
  session.mood = GUEST_START_MOOD;
  el.guestMood.classList.remove('hidden');
  updateGuestFace();
}
// перерисовать лицо гостя по текущему настроению
function updateGuestFace() {
  el.guestMood.innerHTML = guestFaceSVG(session ? session.mood : GUEST_START_MOOD);
  el.guestMood.classList.remove('bump');
  void el.guestMood.offsetWidth;
  el.guestMood.classList.add('bump');
}
// терпение кончилось — гость улетает без награды
function guestFail() {
  guestWaiting = false;
  el.guestMood.classList.add('hidden');
  scheduleGuest();
  showMenu(t('guestGone'));
}
// все 15 верно — подарок: один особый праздник
function giveGuestReward() {
  guestWaiting = false;
  el.guestMood.classList.add('hidden');
  scheduleGuest();
  const pool = SPECIAL_CELEBS.filter(e => ownedSpecials.indexOf(e) === -1);
  const gift = pool.length ? pool[Math.floor(Math.random() * pool.length)]
    : SPECIAL_CELEBS[Math.floor(Math.random() * SPECIAL_CELEBS.length)];
  if (ownedSpecials.indexOf(gift) === -1) ownedSpecials.push(gift);
  celebration = gift;
  saveState();
  showGuestReward(gift);
}
// экран награды (переиспользуем экран победы)
function showGuestReward(gift) {
  mode = null;
  hideTimer();
  el.winTitle.textContent = t('guestGift');
  el.winText.textContent = t('guestGiftText', { e: gift });
  el.winCorrect.textContent = 15;
  el.winWrong.textContent = 0;
  el.winCoins.textContent = '';
  el.winTime.textContent = '';
  hideAllScreens();
  el.winScreen.classList.remove('hidden');
  playCeleb(el.winCeleb);
}

// --- Рисованные фигуры (SVG) ---
// лицо гостя: рот и брови меняются по настроению
function guestFaceSVG(mood) {
  const m = Math.max(0, Math.min(GUEST_MOOD_MAX, mood));
  const f = m - GUEST_START_MOOD;                     // -3 .. +5
  const cy = Math.max(46, Math.min(86, 64 + f * 4));  // изгиб рта: >64 улыбка, <64 грусть
  const tears = m <= 1;
  const brow = m <= 2;
  const cheeks = m >= 6;
  let s = '<svg viewBox="0 0 100 100" class="face-svg">';
  s += '<circle cx="50" cy="50" r="42" fill="#ffd27f" stroke="#e0a94a" stroke-width="3"/>';
  if (cheeks) s += '<circle cx="28" cy="60" r="7" fill="#ffb3b3"/><circle cx="72" cy="60" r="7" fill="#ffb3b3"/>';
  s += '<circle cx="37" cy="45" r="5" fill="#3a2a10"/><circle cx="63" cy="45" r="5" fill="#3a2a10"/>';
  if (brow) {
    s += '<line x1="29" y1="33" x2="45" y2="39" stroke="#3a2a10" stroke-width="3" stroke-linecap="round"/>';
    s += '<line x1="71" y1="33" x2="55" y2="39" stroke="#3a2a10" stroke-width="3" stroke-linecap="round"/>';
  }
  if (tears) {
    s += '<path d="M35 51 q-4 8 0 12 q4 -4 0 -12" fill="#5bc8ff"/>';
    s += '<path d="M65 51 q-4 8 0 12 q4 -4 0 -12" fill="#5bc8ff"/>';
  }
  s += `<path d="M32 64 Q50 ${cy} 68 64" fill="none" stroke="#3a2a10" stroke-width="5" stroke-linecap="round"/>`;
  s += '</svg>';
  return s;
}
// человек, который приносит задачи
function personSVG() {
  let s = '<svg viewBox="0 0 160 170" class="person-svg">';
  s += '<rect x="50" y="90" width="60" height="66" rx="16" fill="#4f7cff"/>';        // тело
  s += '<rect x="32" y="96" width="24" height="14" rx="7" fill="#ffd27f"/>';          // рука
  s += '<rect x="104" y="96" width="24" height="14" rx="7" fill="#ffd27f"/>';         // рука
  s += '<circle cx="80" cy="54" r="30" fill="#ffd27f" stroke="#e0a94a" stroke-width="3"/>'; // голова
  s += '<path d="M50 48 q30 -36 60 0 q-12 -12 -30 -12 q-18 0 -30 12z" fill="#6b4a2b"/>';    // волосы
  s += '<circle cx="70" cy="54" r="4" fill="#3a2a10"/><circle cx="90" cy="54" r="4" fill="#3a2a10"/>';
  s += '<path d="M68 66 Q80 76 92 66" fill="none" stroke="#3a2a10" stroke-width="4" stroke-linecap="round"/>';
  s += '</svg>';
  return s;
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
    streak: {}, log: [], timeMs: 0, answers: 0, wrongTotal: 0, hintUsed: false, missed: 0,
  };
  mode = 'session';
  paused = false;
  current = null;
  el.pauseBtn.textContent = t('pause');
  el.pauseBtn.classList.remove('is-paused');
  el.pauseBtn.classList.toggle('hidden', !timerActive()); // пауза есть только при таймере
  el.answer.disabled = false;
  el.levelTitle.textContent = session.title;
  el.feedback.textContent = ' ';
  el.feedback.className = '';
  el.guestMood.classList.add('hidden'); // лицо гостя — только в режиме гостя
  hideAllScreens();
  el.gameScreen.classList.remove('hidden');
  updateSessionStats();
  nextSessionQuestion();
}

// таймер: у гостя всегда выключен, иначе — по настройке
function timerActive() { return timerOn && !(mode === 'session' && session && session.kind === 'guest'); }
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
  el.missedWrap.classList.toggle('hidden', !timerActive());
  el.missed.textContent = session.missed;
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
  stopTimer();
  const elapsed = Date.now() - qStartTime;
  session.timeMs += elapsed;
  session.answers++;
  current.mt = Math.max(current.mt, elapsed);

  const value = parseInt(raw, 10);
  const right = current.a * current.b;
  const isCorrect = value === right;
  current.last = isCorrect ? 1 : 3; // для карты: зелёный / красный
  session.log.push({ a: current.a, b: current.b, answer: value, correct: isCorrect });

  if (session.kind === 'guest') {
    if (isCorrect) {
      session.streak[key(current.a, current.b)] = (session.streak[key(current.a, current.b)] || 0) + 1;
      session.mood = Math.min(GUEST_MOOD_MAX, session.mood + 1); // радуется сильнее
      updateGuestFace();
      flash(t('guestGood'), 'ok big');
    } else {
      session.mood -= 1;            // грустнеет; задачка не засчитана — вернётся снова
      updateGuestFace();
      if (session.mood <= 0) { updateSessionStats(); guestFail(); return; } // терпение кончилось
      flash(t('guestBad'), 'bad');
    }
    updateSessionStats();
    return;
  }

  if (isCorrect) {
    if (session.temp) session.streak[key(current.a, current.b)] = (session.streak[key(current.a, current.b)] || 0) + 1;
    else { current.streak++; if (current.streak >= session.need) current.mastered = true; }
    if (session.progress && !current.mastered) {
      current.streak++;
      if (current.streak >= NEED_STREAK) current.mastered = true;
    }
    const s = streakOf(current);
    if (s >= session.need) flash(t('fbMastered', { a: current.a, b: current.b, r: right }), 'ok big');
    else flash(t('fbStreak', { s: s, n: session.need, left: session.need - s }), 'ok big');
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
  if (session.kind === 'guest') { giveGuestReward(); return; }
  if (session.kind === 'dictLearn') {
    dict.roundList = session.targets.slice();
    beginDictRound(t('dictRedoTitle'));
    return;
  }
  if (session.log.length === 0) { showMenu(t('allLearnedHere')); return; }
  const earned = Math.round(session.reward);
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
  dict = { timeMs: 0, answers: 0, correct: 0, wrong: 0, penalty: 0 };
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
  el.pauseBtn.classList.toggle('hidden', !timerOn); // пауза есть только при таймере
  el.missedWrap.classList.add('hidden'); // в диктанте счётчика «не успел» нет
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
  stopTimer();
  const elapsed = Date.now() - qStartTime;
  dict.timeMs += elapsed;
  dict.answers++;
  dict.answered++;
  current.mt = Math.max(current.mt, elapsed);
  const value = parseInt(raw, 10);
  const right = current.a * current.b;
  current.last = (value === right) ? 1 : 3; // для карты: зелёный / красный
  if (value === right) {
    dict.correct++;
    flash(t('dictCorrect'), 'ok big', 500);
  } else {
    dict.wrong++;
    current.wrong++;
    dict.penalty += factValue(current.a, current.b); // ошибка вычитается из награды
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
  hideTimer();
  // награда = полная − ошибки − «не успел»
  const earned = Math.round(Math.max(0, dict.reward - dict.penalty));
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
  answering = false;
  hideTimer();
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
// особые сценки праздников: эмодзи → функция, строящая живую сценку
const CELEB_SCENES = {
  '🎢': coasterScene,
  '🎠': c => parkRideScene(c, 'carousel'),
  '🎡': c => parkRideScene(c, 'ferris'),
  '🎪': circusScene,
};

function playCeleb(container) {
  container.innerHTML = '';
  container.classList.toggle('scene', !!CELEB_SCENES[celebration]);
  const scene = CELEB_SCENES[celebration];
  if (scene) { scene(container); celebSound(); return; }
  for (let i = 0; i < 9; i++) {
    const s = document.createElement('span');
    s.className = 'cfx';
    s.textContent = celebration;
    s.style.animationDelay = (i * 0.07) + 's';
    container.appendChild(s);
  }
  celebSound();
}

// СЦЕНКА: американские горки — вагончик с твоим лицом (в шлеме) катится по волнистым рельсам
// путь совпадает с offset-path в CSS (.cart-mover) — координаты 1:1 с пикселями .coaster
const COASTER_PATH = 'M0 130 C40 130 52 55 98 55 S160 145 206 145 S284 62 330 88';
function coasterScene(container) {
  container.innerHTML =
    '<div class="coaster">' +
      '<svg class="scene-svg" viewBox="0 0 320 200" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="csky" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#6cc6ff"/><stop offset="1" stop-color="#d6f2ff"/>' +
          '</linearGradient>' +
          '<linearGradient id="crail" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0" stop-color="#ff5da2"/><stop offset="0.5" stop-color="#ff8a3d"/><stop offset="1" stop-color="#ffd93b"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<rect x="0" y="0" width="320" height="200" fill="url(#csky)"/>' +
        // солнышко с лучами (без анимации)
        '<g class="sun"><circle cx="272" cy="40" r="18" fill="#ffd93b"/>' +
          '<g stroke="#ffd93b" stroke-width="3" stroke-linecap="round">' +
            '<line x1="272" y1="10" x2="272" y2="2"/><line x1="272" y1="70" x2="272" y2="78"/>' +
            '<line x1="242" y1="40" x2="234" y2="40"/><line x1="302" y1="40" x2="310" y2="40"/>' +
            '<line x1="250" y1="18" x2="245" y2="13"/><line x1="294" y1="62" x2="299" y2="67"/>' +
            '<line x1="294" y1="18" x2="299" y2="13"/><line x1="250" y1="62" x2="245" y2="67"/>' +
          '</g></g>' +
        // облака
        '<g class="cloud cloudA" fill="#ffffff"><ellipse cx="60" cy="45" rx="26" ry="14"/><ellipse cx="82" cy="48" rx="20" ry="12"/></g>' +
        '<g class="cloud cloudB" fill="#ffffff"><ellipse cx="180" cy="30" rx="20" ry="11"/><ellipse cx="196" cy="33" rx="15" ry="9"/></g>' +
        // дальние холмы + земля
        '<path d="M0 176 Q70 140 150 176 T320 172 V200 H0 Z" fill="#8fd884"/>' +
        '<rect x="0" y="182" width="320" height="18" fill="#5fb85a"/>' +
        // деревья
        '<g><rect x="20" y="158" width="6" height="26" fill="#7a5230"/><circle cx="23" cy="152" r="14" fill="#3ea35a"/><circle cx="14" cy="158" r="10" fill="#46b365"/><circle cx="32" cy="158" r="10" fill="#46b365"/></g>' +
        '<g><rect x="300" y="160" width="6" height="24" fill="#7a5230"/><circle cx="303" cy="154" r="12" fill="#3ea35a"/><circle cx="295" cy="160" r="9" fill="#46b365"/><circle cx="311" cy="160" r="9" fill="#46b365"/></g>' +
        // опоры горки: верх каждой рассчитан точно по кривой рельса (COASTER_PATH)
        '<g stroke="#7a5230" stroke-width="5">' +
          '<line x1="47" y1="93" x2="47" y2="182"/>' +
          '<line x1="98" y1="55" x2="98" y2="182"/>' +
          '<line x1="152" y1="100" x2="152" y2="182"/>' +
          '<line x1="206" y1="145" x2="206" y2="182"/>' +
          '<line x1="268" y1="107" x2="268" y2="182"/>' +
        '</g>' +
        // рельсы (тёмная подложка + яркая линия)
        '<path d="' + COASTER_PATH + '" fill="none" stroke="#3a2a10" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="' + COASTER_PATH + '" fill="none" stroke="url(#crail)" stroke-width="5" stroke-linecap="round"/>' +
        // ТОЛПА зрителей — рисуется последней, поэтому стоит ПЕРЕД столбами
        coasterCrowd() +
      '</svg>' +
      // непрерывная вереница вагончиков (много поездов подряд, равные промежутки)
      coasterCarts() +
    '</div>';
  // кепки: у каждого вагончика свой случайный выбор, заново на КАЖДОМ круге
  container.querySelectorAll('.cart-mover').forEach(m => {
    const roll = () => randomizeCap(m);
    roll();
    m.addEventListener('animationiteration', roll);
  });
}
// случайно решить, есть ли на вагончике кепка и какого цвета (вызывается каждый круг)
const CAP_COLORS = ['#e23b3b', '#2b6cb0', '#2f855a', '#6b46c1', '#d69e2e', '#ff8a3d'];
function randomizeCap(mover) {
  const cap = mover.querySelector('.cart-cap');
  if (!cap) return;
  if (Math.random() < 0.5) {
    cap.style.display = 'none';
  } else {
    cap.style.display = '';
    const col = CAP_COLORS[Math.floor(Math.random() * CAP_COLORS.length)];
    cap.querySelectorAll('[data-cap]').forEach(e => e.setAttribute('fill', col));
  }
}
// два поезда по три вагончика; поезда на равном расстоянии друг от друга (полкруга)
function coasterCarts() {
  const DUR = 4;                 // длительность круга (совпадает с ride в CSS)
  const TRAINS = 2, PER_TRAIN = 3;
  const CAR_GAP = 0.42;          // промежуток между вагонами внутри поезда (сек)
  const TRAIN_GAP = DUR / TRAINS; // поезда на равном расстоянии по кругу (2 с = полкруга)
  const capColors = ['#e23b3b', '#2b6cb0', '#2f855a', '#6b46c1', '#d69e2e'];
  let s = '';
  for (let tr = 0; tr < TRAINS; tr++) {
    for (let c = 0; c < PER_TRAIN; c++) {
      const delay = -(tr * TRAIN_GAP + c * CAR_GAP).toFixed(3);
      const cap = Math.random() < 0.5; // случайно: в этот раз кепка у случайных вагончиков
      const capColor = capColors[Math.floor(Math.random() * capColors.length)]; // и цвет случайный
      s += '<div class="cart-mover" style="animation-delay:' + delay + 's">' +
        '<div class="cart">' + cartSVG(true, cap, capColor) + '</div></div>'; // все вагончики синие
    }
  }
  return s;
}
// плотная толпа человечков по всей земле (три ряда для «глубины»; ноги стоят на траве)
function coasterCrowd() {
  const shirts = ['#e23b3b', '#4f7cff', '#3ea35a', '#ff8a3d', '#9b5de5', '#ff5da2', '#00a3a3', '#f4b400'];
  const flags = ['#ffd93b', '#ff5da2', '#4f7cff', '#3ea35a', '#ffffff', '#ff8a3d'];
  // задний ряд рисуется первым (выше), передний — последним (перекрывает)
  const rows = [{ dy: -7, x0: 5 }, { dy: -3, x0: 9 }, { dy: 1, x0: 6 }];
  let s = '';
  let i = 0;
  for (const r of rows) {
    for (let x = r.x0; x <= 317; x += 8) {
      const jd = ((i * 0.17) % 0.6).toFixed(2);
      const wd = ((i * 0.11) % 0.7).toFixed(2);
      s += fanSVG(x, shirts[i % shirts.length], flags[i % flags.length], r.dy, jd, wd);
      i++;
    }
  }
  return s;
}
// один вагончик; пассажир без шлема — некоторые в кепке, некоторые без.
// rider — цвет вагончика; cap/capColor — кепка (или без неё)
function cartSVG(rider, cap, capColor) {
  const body = rider ? '#4f7cff' : '#ff8a3d';
  let s = '<svg class="cart-svg" viewBox="0 0 64 58" aria-hidden="true">';
  // голова
  s += '<circle cx="32" cy="30" r="11" fill="#ffd27f"/>' +
    '<circle cx="27" cy="29" r="2" fill="#3a2a10"/><circle cx="37" cy="29" r="2" fill="#3a2a10"/>' +
    '<path d="M26 33 Q32 40 38 33" fill="none" stroke="#3a2a10" stroke-width="2.4" stroke-linecap="round"/>';
  // кепка: всегда в разметке, но показ/цвет задаёт JS (randomizeCap) на каждом круге
  s += '<g class="cart-cap"' + (cap ? '' : ' style="display:none"') + '>' +
    '<path data-cap d="M21 28 a11 11 0 0 1 22 0 z" fill="' + capColor + '"/>' +
    '<rect data-cap x="30" y="26" width="16" height="3.5" rx="1.75" fill="' + capColor + '"/>' +
  '</g>';
  s += '<rect x="9" y="40" width="46" height="13" rx="5" fill="' + body + '"/>' +
    '<rect x="9" y="40" width="46" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>' +
    '<circle cx="21" cy="54" r="4.5" fill="#222"/><circle cx="43" cy="54" r="4.5" fill="#222"/>' +
    '</svg>';
  return s;
}
// зритель-человечек с флажком (x — центр по земле, shirt — одежда, flag — цвет флажка,
// dy — сдвиг по вертикали для ряда, jd/wd — задержки прыжка и махания флагом)
// порядок: ноги → тело → руки → голова (сверху, всегда видна) → флажок
function fanSVG(x, shirt, flag, dy, jd, wd) {
  const y = n => n + dy;
  return '<g class="fan" style="animation-delay:' + jd + 's">' +
    '<line x1="' + x + '" y1="' + y(185) + '" x2="' + (x - 4) + '" y2="' + y(192) + '" stroke="#333" stroke-width="2.6" stroke-linecap="round"/>' +
    '<line x1="' + x + '" y1="' + y(185) + '" x2="' + (x + 4) + '" y2="' + y(192) + '" stroke="#333" stroke-width="2.6" stroke-linecap="round"/>' +
    '<line x1="' + x + '" y1="' + y(176) + '" x2="' + x + '" y2="' + y(186) + '" stroke="' + shirt + '" stroke-width="3.6" stroke-linecap="round"/>' +
    '<line x1="' + x + '" y1="' + y(178) + '" x2="' + (x - 6) + '" y2="' + y(183) + '" stroke="' + shirt + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<line x1="' + x + '" y1="' + y(178) + '" x2="' + (x + 7) + '" y2="' + y(170) + '" stroke="' + shirt + '" stroke-width="2.6" stroke-linecap="round"/>' +
    '<circle cx="' + x + '" cy="' + y(171) + '" r="4.5" fill="#c98a3c" stroke="#7a5320" stroke-width="1"/>' + // голова (потемнее + обводка)
    '<g class="flagwave" style="animation-delay:' + wd + 's">' +
      '<line x1="' + (x + 7) + '" y1="' + y(170) + '" x2="' + (x + 7) + '" y2="' + y(155) + '" stroke="#7a5230" stroke-width="1.8" stroke-linecap="round"/>' +
      '<polygon points="' + (x + 7) + ',' + y(155) + ' ' + (x + 7) + ',' + y(164) + ' ' + (x + 19) + ',' + y(159) + '" fill="' + flag + '"/>' +
    '</g>' +
    '</g>';
}

// =================== СЦЕНКИ: ПАРК АТТРАКЦИОНОВ И ЦИРК ===================
// Всё на чистом CSS-анимациях (как горки) — сценка сама крутится/зацикливается,
// пока не нажата «Обратно». Ни одного JS-таймера.

// Общий фон парка: небо, солнце, облака, холмы, земля, деревья (свои id, чтобы не
// конфликтовать с горочными csky/crail). Возвращает содержимое <svg> (без обёртки).
function parkBackdrop() {
  return (
    '<defs><linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#6cc6ff"/><stop offset="1" stop-color="#d6f2ff"/>' +
    '</linearGradient></defs>' +
    '<rect x="0" y="0" width="320" height="200" fill="url(#psky)"/>' +
    // солнце
    '<g><circle cx="46" cy="34" r="16" fill="#ffd93b"/>' +
      '<g stroke="#ffd93b" stroke-width="3" stroke-linecap="round">' +
        '<line x1="46" y1="6" x2="46" y2="0"/><line x1="46" y1="62" x2="46" y2="68"/>' +
        '<line x1="18" y1="34" x2="12" y2="34"/><line x1="74" y1="34" x2="80" y2="34"/>' +
        '<line x1="26" y1="14" x2="22" y2="10"/><line x1="66" y1="54" x2="70" y2="58"/>' +
        '<line x1="66" y1="14" x2="70" y2="10"/><line x1="26" y1="54" x2="22" y2="58"/>' +
      '</g></g>' +
    // облака
    '<g class="cloud cloudA" fill="#ffffff"><ellipse cx="150" cy="30" rx="24" ry="13"/><ellipse cx="170" cy="33" rx="18" ry="11"/></g>' +
    '<g class="cloud cloudB" fill="#ffffff"><ellipse cx="250" cy="46" rx="20" ry="11"/><ellipse cx="266" cy="49" rx="15" ry="9"/></g>' +
    // холмы + земля
    '<path d="M0 176 Q70 142 150 176 T320 172 V200 H0 Z" fill="#8fd884"/>' +
    '<rect x="0" y="182" width="320" height="18" fill="#5fb85a"/>'
  );
}

// домик-станция посадки: корпус + крыша + тёмный дверной проём (cx — центр по земле)
function houseSVG(cx, color) {
  const w = 34, h = 30, x = cx - w / 2, y = 182 - h; // стоит на земле
  return '<g>' +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="' + color + '"/>' +
    '<polygon points="' + (x - 4) + ',' + y + ' ' + (x + w + 4) + ',' + y + ' ' + cx + ',' + (y - 16) + '" fill="#8a3b28"/>' +
    '<rect x="' + (cx - 6) + '" y="' + (y + h - 18) + '" width="12" height="18" rx="2" fill="#3a2a18"/>' +
    '<circle cx="' + (cx + 3) + '" cy="' + (y + h - 9) + '" r="1.3" fill="#ffd93b"/>' +
  '</g>';
}

// седок в гондоле/на лошадке (компактный: голова + плечи)
function riderSeat(x, cy, shirt) {
  return '<g>' +
    '<path d="M' + (x - 6) + ' ' + (cy + 6) + ' Q' + x + ' ' + (cy - 4) + ' ' + (x + 6) + ' ' + (cy + 6) + '" fill="' + shirt + '"/>' +
    '<circle cx="' + x + '" cy="' + (cy - 4) + '" r="4.2" fill="#ffd27f" stroke="#7a5320" stroke-width="0.8"/>' +
  '</g>';
}

// стоячий человечек-ходок (ноги на земле gy)
function riderWalk(x, gy, shirt) {
  return '<g>' +
    '<line x1="' + x + '" y1="' + (gy - 5) + '" x2="' + (x - 3) + '" y2="' + gy + '" stroke="#333" stroke-width="2.4" stroke-linecap="round"/>' +
    '<line x1="' + x + '" y1="' + (gy - 5) + '" x2="' + (x + 3) + '" y2="' + gy + '" stroke="#333" stroke-width="2.4" stroke-linecap="round"/>' +
    '<line x1="' + x + '" y1="' + (gy - 14) + '" x2="' + x + '" y2="' + (gy - 5) + '" stroke="' + shirt + '" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="' + x + '" cy="' + (gy - 18) + '" r="4.2" fill="#ffd27f" stroke="#7a5320" stroke-width="0.8"/>' +
  '</g>';
}

// плотные боковые толпы с флажками по обоим краям (много народу, как у горок)
function sideCrowds() {
  const shirts = ['#e23b3b', '#4f7cff', '#3ea35a', '#ff8a3d', '#9b5de5', '#ff5da2', '#00a3a3', '#f4b400'];
  const flags = ['#ffd93b', '#ff5da2', '#4f7cff', '#3ea35a', '#ffffff', '#ff8a3d'];
  const rows = [{ dy: -7 }, { dy: -3 }, { dy: 1 }];   // три ряда для «глубины»
  let s = '', i = 0;
  for (const r of rows) {
    const off = (i % 2) * 4;
    for (let x = 5 + off; x <= 52; x += 8) {          // левый край
      s += fanSVG(x, shirts[i % shirts.length], flags[i % flags.length], r.dy, ((i * 0.17) % 0.6).toFixed(2), ((i * 0.11) % 0.7).toFixed(2)); i++;
    }
    for (let x = 268 + off; x <= 316; x += 8) {        // правый край
      s += fanSVG(x, shirts[i % shirts.length], flags[i % flags.length], r.dy, ((i * 0.17) % 0.6).toFixed(2), ((i * 0.11) % 0.7).toFixed(2)); i++;
    }
  }
  return s;
}

// лошадка карусели, центр крепления (px,py)
// лошадка карусели в ЛОКАЛЬНЫХ координатах (вокруг 0,0) — едет по горизонтальной
// орбите через offset-path (.car-horse). Внутри — седоки A/B (смена на паузе).
function carHorse(shirt) {
  return (
    '<line x1="0" y1="-16" x2="0" y2="12" stroke="#c9a06a" stroke-width="2.5"/>' +  // шест
    '<path d="M-11 -2 q-6 1 -5 8" fill="none" stroke="#e6d3b0" stroke-width="2.6" stroke-linecap="round"/>' + // хвост
    '<ellipse cx="0" cy="0" rx="11" ry="6" fill="#fdf6ec" stroke="#c9a06a" stroke-width="1"/>' + // тело
    '<path d="M6 -1 Q12 -5 11.5 -12 L8 -12 Q8.5 -7 3 -4 Z" fill="#fdf6ec" stroke="#c9a06a" stroke-width="1"/>' + // шея+морда
    '<circle cx="11" cy="-12" r="2.3" fill="#fdf6ec" stroke="#c9a06a" stroke-width="1"/>' +   // нос
    '<path d="M8 -12 l-1.5 -4 l3.5 2 z" fill="#fdf6ec" stroke="#c9a06a" stroke-width="0.8"/>' + // ухо
    '<path d="M7.5 -6 Q9.5 -9 9.5 -12.5" fill="none" stroke="#e0a34a" stroke-width="1.8" stroke-linecap="round"/>' + // грива (вдоль шеи)
    '<line x1="-6" y1="5" x2="-6" y2="11" stroke="#c9a06a" stroke-width="2"/>' +   // 4 ноги
    '<line x1="-2" y1="6" x2="-2" y2="12" stroke="#c9a06a" stroke-width="2"/>' +
    '<line x1="3" y1="6" x2="3" y2="12" stroke="#c9a06a" stroke-width="2"/>' +
    '<line x1="7" y1="5" x2="7" y2="11" stroke="#c9a06a" stroke-width="2"/>' +
    // седок: появляется при входе, исчезает при выходе (привозят/увозят ходоки)
    '<g class="car-rider">' + riderSeat(0, -9, shirt) + '</g>'
  );
}

// капсула колеса обозрения (стиль Singapore Flyer): тёмное стекло, светлый ободок.
// Рисуется ПОВЕРХ седока — голову видно сквозь полупрозрачное стекло.
function capsuleFer(px, py) {
  return '<g>' +
    '<line x1="' + px + '" y1="' + (py - 12) + '" x2="' + px + '" y2="' + (py - 6) + '" stroke="#9aa7b5" stroke-width="1.5"/>' + // подвес к ободу
    '<rect x="' + (px - 8) + '" y="' + (py - 6) + '" width="16" height="13" rx="6" fill="rgba(40,62,84,0.5)" stroke="#e6eef5" stroke-width="1.3"/>' +
    '<rect x="' + (px - 8) + '" y="' + (py - 6) + '" width="16" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>' +
  '</g>';
}

// СЦЕНКА-ЦЕНТР: карусель — лошадки едут по горизонтальному кругу под купольной крышей
const CAR_SHIRTS = ['#e23b3b', '#2b6cb0', '#2f855a', '#e67e22', '#6b46c1', '#f4b400'];
function carouselSVG() {
  const cx = 160, N = 6;
  let horses = '';
  for (let i = 0; i < N; i++) {
    horses += '<g class="car-horse" style="--p:' + (i * 100 / N).toFixed(2) + '">' + carHorse(CAR_SHIRTS[i]) + '</g>';
  }
  // крыша-навес держится на столбе + двух боковых опорах над платформой
  const base = 122, apex = 90, hw = 52, plat = 179;   // платформа — на земле
  const domeTop = (base + 2 * (apex - 6) + base) / 4;  // реальная вершина купола (кривой Безье)
  let roof = '<path d="M' + (cx - hw) + ' ' + base + ' Q' + cx + ' ' + (apex - 6) + ' ' + (cx + hw) + ' ' + base + ' Z" fill="#e8514f"/>';
  roof += '<g stroke="#ffffff" stroke-width="4" opacity="0.6">';
  for (let k = -2; k <= 2; k++) {
    roof += '<line x1="' + cx + '" y1="' + domeTop + '" x2="' + (cx + k * (hw / 2.4)) + '" y2="' + base + '"/>';
  }
  roof += '</g>';
  let fest = '<g fill="#f2c14e">';
  for (let x = cx - hw + 6; x <= cx + hw - 5; x += 12) {
    fest += '<circle cx="' + x.toFixed(1) + '" cy="' + base + '" r="6"/>';
  }
  fest += '</g>';
  // опоры навеса (рисуются за лошадками)
  const posts =
    '<line x1="' + cx + '" y1="' + base + '" x2="' + cx + '" y2="' + plat + '" stroke="#c9a06a" stroke-width="5"/>' +
    '<line x1="' + (cx - 46) + '" y1="' + (base + 4) + '" x2="' + (cx - 46) + '" y2="' + (plat - 2) + '" stroke="#c9a06a" stroke-width="3.5"/>' +
    '<line x1="' + (cx + 46) + '" y1="' + (base + 4) + '" x2="' + (cx + 46) + '" y2="' + (plat - 2) + '" stroke="#c9a06a" stroke-width="3.5"/>';
  return '<g>' +
    '<ellipse cx="' + cx + '" cy="' + (plat + 5) + '" rx="54" ry="6" fill="rgba(0,0,0,0.12)"/>' +   // тень на траве
    '<ellipse cx="' + cx + '" cy="' + plat + '" rx="50" ry="9" fill="#caa96a" stroke="#a9863f" stroke-width="2"/>' + // платформа
    posts +
    horses +
    roof + fest +
  '</g>';
}

// СЦЕНКА-ЦЕНТР: колесо обозрения в стиле Singapore Flyer — тонкий обод, много
// тросов-спиц веером от ступицы, капсулы по внешней стороне обода, мачта-опора
function ferrisSVG() {
  const cx = 160, cy = 100, R = 48, N = 16;
  let spin = '<circle cx="' + cx + '" cy="' + cy + '" r="66" fill="none"/>';   // балансир оси
  // тросы-спицы (много, тонкие)
  spin += '<g stroke="#c3ccd6" stroke-width="0.8" opacity="0.85">';
  for (let i = 0; i < 32; i++) {
    const b = (i / 32) * Math.PI * 2;
    spin += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R * Math.cos(b)).toFixed(2) + '" y2="' + (cy + R * Math.sin(b)).toFixed(2) + '"/>';
  }
  spin += '</g>';
  // тонкий двойной обод
  spin += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#eef2f6" stroke-width="3"/>';
  spin += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 3) + '" fill="none" stroke="#aab6c2" stroke-width="1"/>';
  // капсулы снаружи обода
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const px = +(cx + (R + 7) * Math.cos(a)).toFixed(2);
    const py = +(cy + (R + 7) * Math.sin(a)).toFixed(2);
    spin += '<g class="ride-counter">' +
      '<circle cx="' + px + '" cy="' + py + '" r="16" fill="none"/>' +   // балансир: центр bbox = точка орбиты
      '<g class="car-rider">' + riderSeat(px, py + 2, CAR_SHIRTS[i % CAR_SHIRTS.length]) + '</g>' +   // появляется на входе, исчезает на выходе
      capsuleFer(px, py) +
    '</g>';
  }
  // опора-мачта + основание (за колесом) и ступица (поверх)
  const legs =
    '<line x1="' + (cx - 26) + '" y1="182" x2="' + cx + '" y2="' + cy + '" stroke="#e6edf3" stroke-width="6" stroke-linecap="round"/>' +
    '<line x1="' + (cx + 26) + '" y1="182" x2="' + cx + '" y2="' + cy + '" stroke="#e6edf3" stroke-width="6" stroke-linecap="round"/>' +
    '<rect x="' + (cx - 16) + '" y="178" width="32" height="8" rx="2" fill="#cfd8e0"/>';
  const hub = '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#cfd8e0" stroke="#9aa7b5" stroke-width="1"/>';
  return '<g>' +
    '<ellipse cx="' + cx + '" cy="182" rx="40" ry="6" fill="rgba(0,0,0,0.12)"/>' +
    legs +
    '<g class="ride-spin">' + spin + '</g>' +
    hub +
  '</g>';
}

function rideSVG(kind) {
  return kind === 'ferris' ? ferrisSVG() : carouselSVG();
}

// СЦЕНКА: карусель (🎠) и колесо обозрения (🎡) — общий каркас
function parkRideScene(container, kind) {
  container.innerHTML =
    '<div class="scene-box parkride ' + kind + '">' +
      '<svg class="scene-svg" viewBox="0 0 320 200" aria-hidden="true">' +
        parkBackdrop() +
        sideCrowds() +
        rideSVG(kind) +
        carouselWalkers() +
      '</svg>' +
    '</div>';
}

// смена людей: набор входит из правого угла → садится → катается → выходит в левый угол
function carouselWalkers() {
  let s = '<g>';
  for (let i = 0; i < 6; i++) {
    s += '<g class="car-in" style="animation-delay:' + (-i * 0.18).toFixed(2) + 's">' + riderWalk(158 - i * 2, 176, CAR_SHIRTS[i]) + '</g>';
  }
  for (let i = 0; i < 6; i++) {
    s += '<g class="car-out" style="animation-delay:' + (-i * 0.18).toFixed(2) + 's">' + riderWalk(160 - i * 2, 176, CAR_SHIRTS[i]) + '</g>';
  }
  return s + '</g>';
}

// цирковой шатёр (вид снаружи)
function circusTent() {
  return '<g>' +
    '<ellipse cx="160" cy="184" rx="86" ry="8" fill="rgba(0,0,0,0.12)"/>' +
    // купол (вершина кривой ≈ y105)
    '<path d="M86 150 Q160 60 234 150 Z" fill="#e8514f"/>' +
    // полосы купола — от вершины к основанию
    '<g stroke="#ffffff" stroke-width="5" opacity="0.85">' +
      '<line x1="160" y1="106" x2="118" y2="150"/><line x1="160" y1="106" x2="139" y2="150"/>' +
      '<line x1="160" y1="106" x2="160" y2="150"/>' +
      '<line x1="160" y1="106" x2="181" y2="150"/><line x1="160" y1="106" x2="202" y2="150"/>' +
    '</g>' +
    '<rect x="86" y="150" width="148" height="30" fill="#f2c14e"/>' +
    // вход-арка
    '<path d="M144 180 L144 158 Q160 146 176 158 L176 180 Z" fill="#7a2f26"/>' +
    // флажок на вершине купола
    '<line x1="160" y1="106" x2="160" y2="92" stroke="#b98a3a" stroke-width="2"/>' +
    '<polygon points="160,92 160,101 174,96.5" fill="#4f7cff"/>' +
  '</g>';
}

// зритель, СИДЯЩИЙ на стуле (стул с ножками, стоит неподвижно; у сидящего ног не видно;
// человек не прыгает вместе со стулом — только машет флажком)
function circusSeated(x, y, shirt, flag, i) {
  const wd = ((i * 0.19) % 0.7).toFixed(2);
  return '<g>' +
    // стул: 2 ножки + сиденье + спинка (статичный)
    '<line x1="' + (x - 4) + '" y1="' + (y + 5) + '" x2="' + (x - 4) + '" y2="' + (y - 1) + '" stroke="#6b3b2a" stroke-width="1.6"/>' +
    '<line x1="' + (x + 4) + '" y1="' + (y + 5) + '" x2="' + (x + 4) + '" y2="' + (y - 1) + '" stroke="#6b3b2a" stroke-width="1.6"/>' +
    '<rect x="' + (x - 5) + '" y="' + (y - 2) + '" width="10" height="3" rx="1" fill="#7a4530"/>' +
    '<line x1="' + (x + 5) + '" y1="' + (y - 2) + '" x2="' + (x + 5) + '" y2="' + (y - 10) + '" stroke="#6b3b2a" stroke-width="1.6"/>' +
    // сидящий человек (без ног), машет флажком
    '<line x1="' + x + '" y1="' + (y - 2) + '" x2="' + x + '" y2="' + (y - 10) + '" stroke="' + shirt + '" stroke-width="3.4" stroke-linecap="round"/>' + // тело
    '<circle cx="' + x + '" cy="' + (y - 13) + '" r="3.3" fill="#ffd27f" stroke="#7a5320" stroke-width="0.8"/>' + // голова
    '<g class="flagwave" style="animation-delay:' + wd + 's">' +
      '<line x1="' + (x - 5) + '" y1="' + (y - 8) + '" x2="' + (x - 5) + '" y2="' + (y - 18) + '" stroke="#7a5230" stroke-width="1.4"/>' +
      '<polygon points="' + (x - 5) + ',' + (y - 18) + ' ' + (x - 5) + ',' + (y - 11) + ' ' + (x + 4) + ',' + (y - 14.5) + '" fill="' + flag + '"/>' +
    '</g>' +
  '</g>';
}

// трибуны: несколько рядов сидящих зрителей с флажками (part: 'back' — сзади, 'front' — впереди)
function circusStand(part) {
  const shirts = ['#e23b3b', '#4f7cff', '#3ea35a', '#ff8a3d', '#9b5de5', '#ffd93b', '#ff5da2', '#00a3a3', '#f4b400'];
  const flags = ['#ffd93b', '#ff5da2', '#4f7cff', '#3ea35a', '#ffffff', '#ff8a3d'];
  const rows = part === 'back'
    ? [{ y: 64, x0: 20 }, { y: 88, x0: 32 }, { y: 114, x0: 22 }]     // дальние трибуны (за ареной)
    : [{ y: 196, x0: 16 }];                                          // передний ряд (перед ареной)
  let s = '';
  let i = part === 'back' ? 0 : 100;
  for (const r of rows) {
    for (let x = r.x0; x <= 302; x += 20) {
      s += circusSeated(x, r.y, shirts[i % shirts.length], flags[i % flags.length], i);
      i++;
    }
  }
  return s;
}

// вид внутри цирка: трибуны вокруг, манеж-сцена, провисающий канат над ареной, канатоходец
function circusInside() {
  return '<g>' +
    '<rect x="0" y="0" width="320" height="200" fill="#5b1f2e"/>' +        // тёмный шатёр изнутри
    circusStand('back') +                                                    // дальние трибуны (за ареной)
    '<ellipse cx="160" cy="184" rx="124" ry="15" fill="#c9873f"/>' +         // манеж-сцена (опилки)
    '<ellipse cx="160" cy="184" rx="124" ry="15" fill="none" stroke="#ffd93b" stroke-width="3"/>' +
    // столбы стоят НА арене, канат натянут над сценой и провисает
    '<line x1="96" y1="178" x2="96" y2="92" stroke="#d9b38c" stroke-width="4"/>' +
    '<line x1="224" y1="178" x2="224" y2="92" stroke="#d9b38c" stroke-width="4"/>' +
    '<path d="M96 93 Q160 117 224 93" fill="none" stroke="#ffe08a" stroke-width="2"/>' +
    // канатоходец: короткий балансир, едет по провисающему канату (offset-path)
    '<g class="rope-walker">' +
      '<line x1="-13" y1="-9" x2="13" y2="-9" stroke="#c98a3c" stroke-width="2.4" stroke-linecap="round"/>' + // балансир (короткий)
      '<circle cx="0" cy="-18" r="4.5" fill="#ffd27f" stroke="#7a5320" stroke-width="1"/>' +  // голова
      '<line x1="0" y1="-14" x2="0" y2="-6" stroke="#e23b3b" stroke-width="4" stroke-linecap="round"/>' +   // тело
      '<line x1="0" y1="-11" x2="-9" y2="-9" stroke="#e23b3b" stroke-width="2" stroke-linecap="round"/>' +  // руки к балансиру
      '<line x1="0" y1="-11" x2="9" y2="-9" stroke="#e23b3b" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="0" y1="-6" x2="-3" y2="0" stroke="#333" stroke-width="2.4" stroke-linecap="round"/>' +   // ноги на канат
      '<line x1="0" y1="-6" x2="3" y2="0" stroke="#333" stroke-width="2.4" stroke-linecap="round"/>' +
    '</g>' +
    circusStand('front') +                                                   // передний ряд (перед ареной)
  '</g>';
}

// большая толпа сходится ко входу в шатёр (с обеих сторон)
function circusEnterers() {
  const cols = ['#4f7cff', '#3ea35a', '#ff8a3d', '#9b5de5', '#e23b3b', '#00a3a3', '#f4b400', '#ff5da2', '#2f855a', '#6b46c1'];
  const xs = [36, 54, 72, 90, 108, 284, 266, 248, 230, 212];
  let s = '<g>';
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const dx = (x < 160 ? 150 : 170) - x;           // сходятся к воротам, но не в одну точку
    s += '<g class="enterer" style="--dx:' + dx + 'px;animation-delay:' + (-(i % 5) * 0.5).toFixed(2) + 's">' +
      riderWalk(x, 180 - (i % 2), cols[i]) + '</g>';
  }
  return s + '</g>';
}

// СЦЕНКА: цирк (🎪) — снаружи (люди заходят) ⇄ внутри (канатоходец), крест-фейд
function circusScene(container) {
  container.innerHTML =
    '<div class="scene-box circus">' +
      '<svg class="scene-svg" viewBox="0 0 320 200" aria-hidden="true">' +
        parkBackdrop() +
        '<g class="circus-out">' + circusTent() + sideCrowds() + circusEnterers() + '</g>' +
        '<g class="circus-in">' + circusInside() + '</g>' +
      '</svg>' +
    '</div>';
}

// =================== ТАЙМЕР НА ОТВЕТ ===================
let timerRaf = null;
let timerDeadline = 0;

// остановить отсчёт (цифры замирают, но остаются видны — чтобы карточка не прыгала)
function stopTimer() {
  if (timerRaf) cancelAnimationFrame(timerRaf);
  timerRaf = null;
  document.body.classList.remove('urgent');
  el.timerNum.classList.remove('glow');
}
// спрятать таймер совсем (уход с игрового экрана, пауза, таймер выключен)
function hideTimer() {
  stopTimer();
  el.timerwrap.classList.add('hidden');
  el.timerfill.classList.remove('blink');
}

// формат цифры: больше 3 сек — «00:05» (целые); 3.000 и меньше — «00:02.999» (миллисекунды)
function fmtTimer(remMs) {
  const pad2 = n => String(n).padStart(2, '0');
  if (remMs > 3000) {
    const secs = Math.ceil(remMs / 1000);
    return pad2(Math.floor(secs / 60)) + ':' + pad2(secs % 60);
  }
  const secs = Math.floor(remMs / 1000);
  const ms = Math.floor(remMs % 1000);
  return pad2(Math.floor(secs / 60)) + ':' + pad2(secs % 60) + '.' + String(ms).padStart(3, '0');
}

function startTimer() {
  stopTimer();
  el.timerwrap.classList.remove('hidden');
  const total = timerSec * 1000;
  timerDeadline = Date.now() + total;
  function render(rem) {
    el.timerfill.style.width = (rem / total * 100) + '%';
    el.timerNum.textContent = fmtTimer(rem);
    // тревога, только когда осталось РОВНО 3.000 секунды или меньше:
    // фон плавно переливается жёлтый ↔ красный, полоска краснеет
    const urgent = rem <= 3000;
    el.timerfill.classList.toggle('blink', urgent);
    el.timerNum.classList.toggle('glow', urgent);   // цифры плавно переливаются
    document.body.classList.toggle('urgent', urgent); // фон резко мигает
  }
  function tick() {
    const rem = Math.max(0, timerDeadline - Date.now());
    render(rem);
    // время выходит РОВНО на нуле — не раньше ни на миллисекунду
    if (rem <= 0) { onTimeout(); return; }
    timerRaf = requestAnimationFrame(tick);
  }
  render(total);
  timerRaf = requestAnimationFrame(tick);
}

function onTimeout() {
  stopTimer();
  if (!answering) return;
  answering = false;
  if (mode === 'session') sessionTimeout();
  else if (mode === 'dictTest') dictTimeout();
}

// не успел в обучении: НЕ ошибка — счётчик +1, пример вернётся, без подсказки,
// «подряд» не сбрасывается; правильный ответ не показываем (иначе можно
// пересидеть таймер и бесплатно подглядеть)
function sessionTimeout() {
  current.last = 2; // для карты: оранжевый — не успел
  session.missed++;
  session.timeMs += timerSec * 1000;
  session.answers++;
  updateSessionStats();
  flash(t('fbTimeout'), 'timeout', 1800); // крупно, красным и подольше
}

// не успел в диктанте: счётчика нет — пример идёт в повторение (с близнецом),
// награда за него вычитается
function dictTimeout() {
  current.last = 2; // для карты: оранжевый — не успел
  dict.timeMs += timerSec * 1000;
  dict.answers++;
  dict.answered++;
  dict.wrong++;
  dict.penalty += factValue(current.a, current.b);
  dict.mistakes.add(key(current.a, current.b));
  const tw = twin(current);
  if (tw) dict.mistakes.add(key(tw.a, tw.b));
  updateDictStats();
  flash(t('dictTimeout', { a: current.a, b: current.b, r: current.a * current.b }), 'timeout', 1800);
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
  if (timerActive()) startTimer(); else hideTimer();
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
  if (!mode || !timerOn) return; // пауза есть только при включённом таймере
  if (!paused && !answering) return;
  if (paused) {
    paused = false;
    el.pauseBtn.textContent = t('pause');
    el.pauseBtn.classList.remove('is-paused');
    advance(); // после паузы — ДРУГАЯ задачка (нельзя «подумать на паузе»)
  } else {
    paused = true;
    answering = false;
    hideTimer();
    // текущий пример убираем: в диктанте возвращаем в конец очереди, в уроке он и так в пуле
    if (mode === 'dictTest' && current) dict.queue.push(current);
    current = null;
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
  if (session && session.kind === 'guest') {
    el.guestMood.classList.add('hidden'); // прерванный гость — остаётся ждать в меню
    showMenu();
  } else if (mode === 'session' && session && session.log.length) {
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
el.myPetsBtn.addEventListener('click', showPets);
el.myPetsShopBtn.addEventListener('click', showPets);
el.petsBackBtn.addEventListener('click', () => showMenu());
el.shopBackBtn.addEventListener('click', () => showMenu());
el.guestBanner.addEventListener('click', startGuestSearch);
el.guestExitBtn.addEventListener('click', exitGuestSearch);
el.menuScreen.addEventListener('click', onMenuDoorClick, true); // перехват «дверей» до перехода
el.guestBackBtn.addEventListener('click', () => showMenu());
el.guestReadyBtn.addEventListener('click', startGuestChallenge);
el.customBackBtn.addEventListener('click', () => showMenu());
el.customStartBtn.addEventListener('click', startCustom);
el.settingsBtn.addEventListener('click', showSettings);
el.mapMenuBtn.addEventListener('click', showMap);
el.mapBackBtn.addEventListener('click', () => showMenu());
el.realMapBtn.addEventListener('click', showRealMap);
el.realmapRoad.addEventListener('click', e => {   // клик по остановке на тропинке
  const g = e.target.closest('.rm-stop');
  if (g) startTable(+g.dataset.a);
});
el.gridMapBtn.addEventListener('click', showGrid);
el.realmapBackBtn.addEventListener('click', showMap);
el.gridBackBtn.addEventListener('click', showMap);
el.settingsBackBtn.addEventListener('click', settingsBack);
el.langSection.addEventListener('click', () => { openSection = 'lang'; renderSettings(); });
el.timerSection.addEventListener('click', () => { openSection = 'timer'; renderSettings(); });
el.langPanel.querySelectorAll('[data-lang]').forEach(b => {
  b.addEventListener('click', () => setLang(b.getAttribute('data-lang')));
});
el.timerLamp.addEventListener('click', toggleTimer);
el.timerSecInput.addEventListener('input', () => setTimerSec(el.timerSecInput.value));

loadLang();
loadState();
applyOneTimeFix();
updatePet();
applyLang();
showMenu();
scheduleGuest();
