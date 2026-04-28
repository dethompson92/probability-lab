const COLORS = {
  Black: "#17211f",
  White: "#f8fafc",
  Brown: "#8b5e34",
  Red: "#d62828",
  Orange: "#f77f00",
  Yellow: "#f4d35e",
  Green: "#007f5f",
  Blue: "#0096c7",
  Purple: "#7b2cbf",
  Pink: "#ff8fab",
};

const COLOR_ORDER = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink"];
const CUBE_COLOR_ORDER = ["Black", "White", "Yellow", "Red", "Blue", "Green", "Orange", "Brown", "Pink"];
const SPINNER_SPLITS = [2, 3, 4, 5, 6, 8, 10, 12];
const MAX_TRIALS = 10000;
const PENNY_DOT_PLOT_LIMIT = 75;
const PENNY_MILESTONES = [10, 25, 50, 75];

const SPINNER_PRESETS = [
  {
    id: "four-equal",
    name: "Four Equal Colors",
    description: "Red, yellow, green, and blue each have relative frequency 0.25.",
    slices: [
      { label: "Red", weight: 1 },
      { label: "Yellow", weight: 1 },
      { label: "Green", weight: 1 },
      { label: "Blue", weight: 1 },
    ],
  },
  {
    id: "red-blue-halves",
    name: "Red / Blue Halves",
    description: "Two equal sections: red and blue.",
    slices: [
      { label: "Red", weight: 1 },
      { label: "Blue", weight: 1 },
    ],
  },
  {
    id: "red-red-blue-thirds",
    name: "Two-Thirds Red",
    description: "Red covers 2/3 of the spinner and blue covers 1/3.",
    slices: [
      { label: "Red", weight: 2 },
      { label: "Blue", weight: 1 },
    ],
  },
  {
    id: "alternating-quarters",
    name: "Alternating Red / Blue",
    description: "Four equal sections alternating red and blue.",
    slices: [
      { label: "Red", weight: 1 },
      { label: "Blue", weight: 1 },
      { label: "Red", weight: 1 },
      { label: "Blue", weight: 1 },
    ],
  },
  {
    id: "three-equal",
    name: "Red / Blue / Yellow",
    description: "Three equal sections: red, blue, and yellow.",
    slices: [
      { label: "Red", weight: 1 },
      { label: "Blue", weight: 1 },
      { label: "Yellow", weight: 1 },
    ],
  },
  {
    id: "six-mixed",
    name: "Six Equal Sections",
    description: "Six equal sections with red, blue, yellow, and green.",
    slices: [
      { label: "Red", weight: 1 },
      { label: "Blue", weight: 1 },
      { label: "Yellow", weight: 1 },
      { label: "Red", weight: 1 },
      { label: "Green", weight: 1 },
      { label: "Yellow", weight: 1 },
    ],
  },
  {
    id: "unequal-three",
    name: "Unequal Three Colors",
    description: "Blue is 1/2, red is 1/3, and yellow is 1/6.",
    slices: [
      { label: "Blue", weight: 3 },
      { label: "Red", weight: 2 },
      { label: "Yellow", weight: 1 },
    ],
  },
  {
    id: "roygbpp",
    name: "ROYGB + Purple + Pink",
    description: "Seven equal color sections.",
    slices: COLOR_ORDER.map((label) => ({ label, weight: 1 })),
  },
];

const POEM_LINES = [
  "I know what the caged bird feels alas",
  "When the sun is bright on the upland slopes",
  "When the wind stirs soft through the springing grass",
  "And the river flows like a stream of glass",
  "When the first bird sings and the first bud opes",
  "And the faint perfume from its chalice steals",
  "I know what the caged bird feels",
  "I know why the caged bird beats his wing",
  "Till its blood is red on the cruel bars",
  "For he must fly back to his perch and cling",
  "When he fain would be on the bough a-swing",
  "And a pain still throbs in the old old scars",
  "And they pulse again with a keener sting",
  "I know why he beats his wing",
  "I know why the caged bird sings ah me",
  "When his wing is bruised and his bosom sore",
  "When he beats his bars and he would be free",
  "It is not a carol of joy or glee",
  "But a prayer that he sends from his heart's deep core",
  "But a plea that upward to Heaven he flings",
  "I know why the caged bird sings",
];

const POEM_WORDS = POEM_LINES.join(" ").split(/\s+/);

// Lesson 14 – Skate Park Times (800 values from the PDF random-number table)
// Row 00–79, columns 0–9; values are session times in minutes.
const SKATE_PARK_TIMES = [
  // rows 00–09
  45, 58, 49, 78, 59, 36, 52, 39, 70, 51,
  50, 45, 45, 66, 71, 55, 65, 33, 60, 51,
  53, 83, 40, 51, 83, 57, 75, 38, 43, 77,
  49, 49, 81, 57, 42, 36, 22, 66, 68, 52,
  60, 67, 43, 60, 55, 63, 56, 44, 50, 58,
  64, 41, 67, 73, 55, 69, 63, 46, 50, 65,
  54, 58, 53, 55, 51, 74, 53, 55, 64, 16,
  28, 48, 62, 24, 82, 51, 64, 45, 41, 47,
  70, 50, 38, 16, 39, 83, 62, 50, 37, 58,
  79, 62, 45, 48, 42, 51, 67, 68, 56, 78,
  // rows 10–19
  61, 56, 71, 55, 57, 77, 48, 65, 61, 62,
  65, 40, 56, 47, 44, 51, 38, 68, 64, 40,
  53, 22, 73, 62, 82, 78, 84, 50, 43, 43,
  81, 42, 72, 49, 55, 65, 41, 92, 50, 60,
  56, 44, 40, 70, 52, 47, 30,  9, 58, 53,
  84, 64, 64, 34, 37, 69, 57, 75, 62, 67,
  45, 58, 49, 78, 59, 36, 52, 39, 70, 51,
  50, 45, 45, 66, 71, 55, 65, 33, 60, 51,
  53, 83, 40, 51, 83, 57, 75, 38, 43, 77,
  49, 49, 81, 57, 42, 36, 22, 66, 68, 52,
  // rows 20–29
  60, 67, 43, 60, 55, 63, 56, 44, 50, 58,
  64, 41, 67, 73, 55, 69, 63, 46, 50, 65,
  54, 58, 53, 55, 51, 74, 53, 55, 64, 16,
  28, 48, 62, 24, 82, 51, 64, 45, 41, 47,
  70, 50, 38, 16, 39, 83, 62, 50, 37, 58,
  79, 62, 45, 48, 42, 51, 67, 68, 56, 78,
  61, 56, 71, 55, 57, 77, 48, 65, 61, 62,
  65, 40, 56, 47, 44, 51, 38, 68, 64, 40,
  53, 22, 73, 62, 82, 78, 84, 50, 43, 43,
  81, 42, 72, 49, 55, 65, 41, 92, 50, 60,
  // rows 30–39
  56, 44, 40, 70, 52, 47, 30,  9, 58, 53,
  84, 64, 64, 34, 37, 69, 57, 75, 62, 67,
  45, 58, 49, 78, 59, 36, 52, 39, 70, 51,
  50, 45, 45, 66, 71, 55, 65, 33, 60, 51,
  53, 83, 40, 51, 83, 57, 75, 38, 43, 77,
  49, 49, 81, 57, 42, 36, 22, 66, 68, 52,
  60, 67, 43, 60, 55, 63, 56, 44, 50, 58,
  64, 41, 67, 73, 55, 69, 63, 46, 50, 65,
  54, 58, 53, 55, 51, 74, 53, 55, 64, 16,
  28, 48, 62, 24, 82, 51, 64, 45, 41, 47,
  // rows 40–49
  53, 70, 59, 62, 33, 31, 74, 44, 46, 68,
  37, 51, 84, 47, 46, 33, 53, 54, 70, 74,
  35, 45, 48, 45, 56, 60, 66, 60, 65, 57,
  42, 81, 67, 64, 60, 79, 46, 48, 67, 56,
  41, 21, 41, 58, 48, 38, 50, 53, 73, 38,
  35, 28, 43, 43, 55, 39, 75, 45, 68, 36,
  64, 31, 31, 40, 84, 79, 47, 63, 48, 46,
  34, 36, 54, 61, 33, 16, 50, 60, 52, 55,
  53, 52, 48, 47, 77, 37, 66, 51, 61, 64,
  40, 44, 45, 22, 36, 64, 50, 49, 64, 39,
  // rows 50–59
  45, 69, 67, 33, 55, 61, 62, 38, 51, 43,
  55, 39, 46, 56, 53, 50, 44, 42, 40, 60,
  11, 36, 56, 69, 72, 73, 71, 48, 58, 52,
  81, 47, 36, 54, 81, 59, 50, 42, 80, 69,
  40, 43, 30, 54, 61, 13, 73, 65, 52, 40,
  71, 78, 71, 61, 54, 79, 63, 47, 49, 73,
  53, 70, 59, 62, 33, 31, 74, 44, 46, 68,
  37, 51, 84, 47, 46, 33, 53, 54, 70, 74,
  35, 45, 48, 45, 56, 60, 66, 60, 65, 57,
  42, 81, 67, 64, 60, 79, 46, 48, 67, 56,
  // rows 60–69
  41, 21, 41, 58, 48, 38, 50, 53, 73, 38,
  35, 28, 43, 43, 55, 39, 75, 45, 68, 36,
  64, 31, 31, 40, 84, 79, 47, 63, 48, 46,
  34, 36, 54, 61, 33, 16, 50, 60, 52, 55,
  53, 52, 48, 47, 77, 37, 66, 51, 61, 64,
  40, 44, 45, 22, 36, 64, 50, 49, 64, 39,
  45, 69, 67, 33, 55, 61, 62, 38, 51, 43,
  55, 39, 46, 56, 53, 50, 44, 42, 40, 60,
  11, 36, 56, 69, 72, 73, 71, 48, 58, 52,
  81, 47, 36, 54, 81, 59, 50, 42, 80, 69,
  // rows 70–79
  40, 43, 30, 54, 61, 13, 73, 65, 52, 40,
  71, 78, 71, 61, 54, 79, 63, 47, 49, 73,
  53, 70, 59, 62, 33, 31, 74, 44, 46, 68,
  37, 51, 84, 47, 46, 33, 53, 54, 70, 74,
  35, 45, 48, 45, 56, 60, 66, 60, 65, 57,
  42, 81, 67, 64, 60, 79, 46, 48, 67, 56,
  41, 21, 41, 58, 48, 38, 50, 53, 73, 38,
  35, 28, 43, 43, 55, 39, 75, 45, 68, 36,
  64, 31, 31, 40, 84, 79, 47, 63, 48, 46,
  34, 36, 54, 61, 33, 16, 50, 60, 52, 55,
];

const PENNY_AGE_COUNTS = {
  0: 17,
  1: 8,
  2: 5,
  3: 2,
  4: 4,
  5: 5,
  6: 2,
  7: 4,
  8: 3,
  9: 3,
  10: 8,
  11: 1,
  12: 2,
  13: 2,
  14: 2,
  15: 1,
  16: 7,
  17: 5,
  18: 1,
  19: 4,
  20: 2,
  21: 3,
  22: 4,
  23: 5,
  24: 5,
  25: 2,
  26: 2,
  27: 1,
  28: 2,
  29: 3,
  30: 5,
  31: 2,
  32: 5,
  33: 2,
  34: 3,
  37: 4,
  38: 6,
  39: 2,
  41: 1,
  42: 1,
  43: 2,
  46: 1,
  48: 2,
  53: 1,
  54: 1,
};

const PENNY_AGES = Object.entries(PENNY_AGE_COUNTS).flatMap(([age, count]) => (
  Array.from({ length: count }, () => Number(age))
));

const DEFAULT_CUBE_CONFIG = [
  { label: "Black", enabled: true, count: 10 },
  { label: "White", enabled: true, count: 4 },
  { label: "Yellow", enabled: true, count: 1 },
  { label: "Red", enabled: true, count: 1 },
  { label: "Blue", enabled: true, count: 1 },
  { label: "Green", enabled: true, count: 1 },
  { label: "Orange", enabled: true, count: 1 },
  { label: "Brown", enabled: true, count: 1 },
  { label: "Pink", enabled: false, count: 0 },
];

const state = {
  activity: "coin",
  coin: {
    tosses: [],
    view: "summary",
  },
  poem: {
    picks: [],
    current: null,
  },
  pennies: {
    bag: shuffleArray(PENNY_AGES),
    drawn: [],
    current: null,
    showTables: false,
    showMilestones: false,
  },
  cubes: {
    colors: makeDefaultCubeConfig(),
    targetTotal: 20,
    replacement: true,
    draws: [],
    current: null,
    bag: [],
  },
  skatepark: {
    bag: shuffleArray(SKATE_PARK_TIMES),
    pulled: [],
    current: null,
  },
  experimental: {
    mode: "preset",
    preset: {
      presetId: "four-equal",
      slices: makePresetSlices("four-equal"),
      results: [],
      rotation: 0,
      outputView: "count",
      showTheoretical: false,
    },
    custom: {
      slices: makeEqualSlices(4),
      results: [],
      rotation: 0,
      outputView: "count",
      showTheoretical: false,
    },
    dice: {
      count: 2,
      faces: ["1", "2", "3", "4", "5", "6"],
      results: [],
      lastFaces: ["1", "1"],
      editorOpen: false,
      outputView: "count",
      showTheoretical: false,
    },
  },
};

state.cubes.bag = shuffleArray(expandCubeBag(state.cubes.colors));

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const formatDecimal = (value) => Number.isFinite(value)
  ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")
  : "0";
const percent = (value) => `${(value * 100).toFixed(1)}%`;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function makeDefaultCubeConfig() {
  return DEFAULT_CUBE_CONFIG.map((item) => ({
    ...item,
    color: COLORS[item.label],
  }));
}

function makeSlice(label, weight = 1) {
  return {
    label,
    color: COLORS[label] || COLORS.Blue,
    weight,
  };
}

function makeEqualSlices(count) {
  return Array.from({ length: count }, (_, index) => makeSlice(COLOR_ORDER[index % COLOR_ORDER.length], 1));
}

function makePresetSlices(presetId) {
  const preset = SPINNER_PRESETS.find((item) => item.id === presetId) || SPINNER_PRESETS[0];
  return preset.slices.map((slice) => makeSlice(slice.label, slice.weight));
}

function getPreset(presetId) {
  return SPINNER_PRESETS.find((preset) => preset.id === presetId) || SPINNER_PRESETS[0];
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? Number(checked.value) : 1;
}

function getTrialCount(name, customSelector) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  if (!checked) return 1;
  if (checked.value !== "custom") return Number(checked.value);

  const input = $(customSelector);
  const value = Math.floor(Number(input.value) || 1);
  const clamped = Math.min(Math.max(value, 1), MAX_TRIALS);
  input.value = clamped;
  return clamped;
}

function countBy(items) {
  return items.reduce((counts, item) => {
    counts.set(item, (counts.get(item) || 0) + 1);
    return counts;
  }, new Map());
}

function makeEmpty(message) {
  return `<p class="empty-state">${message}</p>`;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function expandCubeBag(config) {
  return config.flatMap((item) => (
    item.enabled ? Array.from({ length: Math.max(0, Math.floor(item.count || 0)) }, () => item.label) : []
  ));
}

function getCubeActiveConfig() {
  return state.cubes.colors.filter((item) => item.enabled && item.count > 0);
}

function getCubeTotal() {
  return getCubeActiveConfig().reduce((sum, item) => sum + item.count, 0);
}

function rebuildCubeBag() {
  state.cubes.bag = shuffleArray(expandCubeBag(state.cubes.colors));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function renderActivity() {
  $$(".tab-button").forEach((button) => {
    const active = button.dataset.activity === state.activity;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  $$(".activity-section").forEach((section) => {
    const active = section.id === `${state.activity}-activity`;
    section.classList.toggle("active", active);
  });
}

function renderMode() {
  $$(".mode-button").forEach((button) => {
    const active = button.dataset.mode === state.experimental.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  ["preset", "custom", "dice"].forEach((mode) => {
    $(`#${mode}-mode`).classList.toggle("active", state.experimental.mode === mode);
  });
}

function tossCoins() {
  const requested = Number($("#coin-count").value);
  const tossCount = Math.min(Math.max(Math.floor(requested || 1), 1), MAX_TRIALS);
  $("#coin-count").value = tossCount;

  const newTosses = Array.from({ length: tossCount }, () => randomItem(["Heads", "Tails"]));
  state.coin.tosses.push(...newTosses);

  const last = newTosses[newTosses.length - 1];
  const coinVisual = $("#coin-visual");
  coinVisual.classList.remove("heads", "tails", "flip");
  coinVisual.classList.add(last === "Heads" ? "heads" : "tails");
  $("#coin-face").textContent = last === "Heads" ? "H" : "T";
  requestAnimationFrame(() => coinVisual.classList.add("flip"));

  $("#coin-status").textContent = `${tossCount} ${tossCount === 1 ? "toss" : "tosses"} added. Last toss: ${last}.`;
  renderCoin();
}

function clearCoin() {
  state.coin.tosses = [];
  $("#coin-status").textContent = "Ready for the first toss.";
  $("#coin-visual").classList.remove("tails", "flip");
  $("#coin-visual").classList.add("heads");
  $("#coin-face").textContent = "H";
  renderCoin();
}

function renderCoin() {
  const tosses = state.coin.tosses;
  const counts = countBy(tosses);
  const heads = counts.get("Heads") || 0;
  const tails = counts.get("Tails") || 0;
  const total = tosses.length;

  $("#coin-total").textContent = total;
  $("#coin-heads").textContent = heads;
  $("#coin-tails").textContent = tails;
  $("#coin-summary").textContent = total ? `${heads} heads and ${tails} tails after ${total} tosses.` : "No tosses yet.";
  $("#coin-detail-view").value = state.coin.view;

  if (state.coin.view === "summary") {
    $("#coin-output").innerHTML = renderCoinSummary(heads, tails, total);
    return;
  }

  if (!total) {
    $("#coin-output").innerHTML = makeEmpty("Toss the coin to start collecting detailed results.");
    return;
  }

  if (state.coin.view === "list") {
    $("#coin-output").innerHTML = `
      <ol class="result-list">
        ${tosses.map((result, index) => `<li>${index + 1}. ${result}</li>`).join("")}
      </ol>
    `;
    return;
  }

  if (state.coin.view === "table") {
    $("#coin-output").innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Toss</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            ${tosses.map((result, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${result}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  $("#coin-output").innerHTML = `
    <div class="ratio-grid">
      ${renderRatioItem("Heads", heads, total, "#d6a400")}
      ${renderRatioItem("Tails", tails, total, "#007f5f")}
    </div>
  `;
}

function renderCoinSummary(heads, tails, total) {
  return `
    <div class="count-grid">
      <div class="count-card">
        <strong>${heads}</strong>
        <span>Heads</span>
      </div>
      <div class="count-card">
        <strong>${tails}</strong>
        <span>Tails</span>
      </div>
      <div class="count-card">
        <strong>${total}</strong>
        <span>Total Tosses</span>
      </div>
    </div>
  `;
}

function renderRatioItem(label, count, total, color) {
  const value = total ? count / total : 0;
  return `
    <div class="ratio-item" style="border-left-color: ${color}">
      <strong>${count}/${total}</strong>
      <span>${label}</span>
      <div class="meter" aria-hidden="true"><span style="--value: ${value * 100}%; background: ${color}"></span></div>
    </div>
  `;
}

function pickPoemWords(count) {
  const picks = Array.from({ length: count }, () => {
    const index = Math.floor(Math.random() * POEM_WORDS.length);
    return {
      word: POEM_WORDS[index],
      index: index + 1,
    };
  });

  state.poem.picks.push(...picks);
  state.poem.current = picks[picks.length - 1];
  renderPoem();
}

function clearPoemWords() {
  state.poem.picks = [];
  state.poem.current = null;
  renderPoem();
}

function renderPoem() {
  $("#poem-total-words").textContent = POEM_WORDS.length;
  $("#poem-summary").textContent = `${state.poem.picks.length} ${state.poem.picks.length === 1 ? "word" : "words"} picked.`;

  if (state.poem.current) {
    $("#poem-current-word").textContent = state.poem.current.word;
    $("#poem-word-detail").textContent = `Word ${state.poem.current.index} of ${POEM_WORDS.length}.`;
  } else {
    $("#poem-current-word").textContent = "Ready";
    $("#poem-word-detail").textContent = `Pick from ${POEM_WORDS.length} poem words.`;
  }

  if (!state.poem.picks.length) {
    $("#poem-output").innerHTML = makeEmpty("Pick a word to start the list.");
    return;
  }

  $("#poem-output").innerHTML = `
    <ol class="result-list word-list">
      ${state.poem.picks.map((pick, index) => `
        <li>
          <strong>${index + 1}. ${escapeHtml(pick.word)}</strong>
          <span>word ${pick.index}</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function drawSpinner(svg, slices, rotation = 0) {
  const total = slices.reduce((sum, slice) => sum + slice.weight, 0);
  const cx = 110;
  const cy = 110;
  const radius = 96;
  let start = -90;

  svg.style.transform = `rotate(${rotation}deg)`;
  svg.innerHTML = slices.map((slice) => {
    const angle = total ? (slice.weight / total) * 360 : 0;
    const textColor = getReadableTextColor(slice.color);
    if (angle >= 359.999) {
      return `
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${slice.color}" stroke="#17211f" stroke-width="5"></circle>
        <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
          fill="${textColor}" font-size="18" font-weight="800">${escapeHtml(shortSpinnerLabel(slice.label))}</text>
      `;
    }
    const end = start + angle;
    const path = describeSector(cx, cy, radius, start, end);
    const labelAngle = start + angle / 2;
    const labelPoint = polarToCartesian(cx, cy, radius * 0.62, labelAngle);
    start = end;

    return `
      <path d="${path}" fill="${slice.color}" stroke="#17211f" stroke-width="2"></path>
      <text x="${labelPoint.x}" y="${labelPoint.y}" text-anchor="middle" dominant-baseline="middle"
        fill="${textColor}" font-size="14" font-weight="800">${escapeHtml(shortSpinnerLabel(slice.label))}</text>
    `;
  }).join("") + `
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#17211f" stroke-width="5"></circle>
    <circle cx="${cx}" cy="${cy}" r="9" fill="#17211f"></circle>
  `;
}

function shortSpinnerLabel(label) {
  const labels = {
    Orange: "Org",
    Purple: "Purp",
    Yellow: "Yel",
  };
  return labels[label] || label;
}

function getReadableTextColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#17211f" : "#ffffff";
}

function polarToCartesian(cx, cy, radius, angleDegrees) {
  const radians = angleDegrees * Math.PI / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeSector(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function weightedSpin(slices) {
  const total = slices.reduce((sum, slice) => sum + slice.weight, 0);
  let target = Math.random() * total;
  for (const slice of slices) {
    target -= slice.weight;
    if (target <= 0) return slice.label;
  }
  return slices[slices.length - 1].label;
}

function spinMany(slices, count) {
  return Array.from({ length: count }, () => weightedSpin(slices));
}

function spinPreset() {
  const count = getTrialCount("preset-spin-count", "#preset-custom-count");
  const results = spinMany(state.experimental.preset.slices, count);
  state.experimental.preset.results.push(...results);
  state.experimental.preset.rotation += 720 + Math.random() * 720;
  $("#preset-last-result").textContent = `${count} ${count === 1 ? "spin" : "spins"} added. Last spin: ${results[results.length - 1]}.`;
  renderPreset();
}

function spinCustom() {
  const count = getTrialCount("custom-spin-count", "#custom-custom-count");
  const results = spinMany(state.experimental.custom.slices, count);
  state.experimental.custom.results.push(...results);
  state.experimental.custom.rotation += 720 + Math.random() * 720;
  $("#custom-last-result").textContent = `${count} ${count === 1 ? "spin" : "spins"} added. Last spin: ${results[results.length - 1]}.`;
  renderCustom();
}

function clearPreset() {
  state.experimental.preset.results = [];
  $("#preset-last-result").textContent = "Ready to spin.";
  renderPreset();
}

function resetPresetSpinner() {
  const presetId = $("#preset-select").value || state.experimental.preset.presetId;
  state.experimental.preset.presetId = presetId;
  state.experimental.preset.slices = makePresetSlices(presetId);
  state.experimental.preset.results = [];
  state.experimental.preset.rotation = 0;
  $("#preset-last-result").textContent = "Ready to spin.";
  renderPreset();
}

function renderPreset() {
  const preset = state.experimental.preset;
  const presetDefinition = getPreset(preset.presetId);
  $("#preset-title").textContent = presetDefinition.name;
  $("#preset-description").textContent = presetDefinition.description;
  $("#preset-select").value = preset.presetId;
  drawSpinner($("#preset-spinner-svg"), preset.slices, preset.rotation);
  $("#preset-total-label").textContent = `${preset.results.length} ${preset.results.length === 1 ? "spin" : "spins"}`;
  renderOutputControls("preset", preset);
  $("#preset-results").innerHTML = renderOutcomeTable(preset.results, summarizeSlices(preset.slices), preset, "Run the experiment to collect data.");
}

function addCustomSlice() {
  const slices = state.experimental.custom.slices;
  if (slices.length >= 12) {
    $("#custom-last-result").textContent = "The spinner already has 12 slices.";
    return;
  }

  const label = $("#custom-color-select").value;
  slices.push({ label, color: COLORS[label], weight: 1 });
  state.experimental.custom.results = [];
  $("#custom-last-result").textContent = "Spinner changed; results cleared.";
  renderCustom();
}

function removeCustomSlice() {
  const slices = state.experimental.custom.slices;
  if (slices.length <= 1) {
    $("#custom-last-result").textContent = "Keep at least one slice on the spinner.";
    return;
  }

  const label = $("#custom-color-select").value;
  const index = slices.findIndex((slice) => slice.label === label);
  if (index === -1) {
    $("#custom-last-result").textContent = `No ${label.toLowerCase()} slice is available to remove.`;
    return;
  }

  slices.splice(index, 1);
  state.experimental.custom.results = [];
  $("#custom-last-result").textContent = "Spinner changed; results cleared.";
  renderCustom();
}

function updateCustomSlice(index, updates) {
  const slice = state.experimental.custom.slices[index];
  state.experimental.custom.slices[index] = {
    ...slice,
    ...updates,
  };
  state.experimental.custom.results = [];
  $("#custom-last-result").textContent = "Spinner changed; results cleared.";
  renderCustom();
}

function clearCustom() {
  state.experimental.custom.results = [];
  $("#custom-last-result").textContent = "Ready to spin.";
  renderCustom();
}

function applyCustomSplit() {
  const count = Number($("#custom-split-select").value) || 4;
  state.experimental.custom.slices = makeEqualSlices(count);
  state.experimental.custom.results = [];
  state.experimental.custom.rotation = 0;
  $("#custom-last-result").textContent = `Spinner split into ${count} equal ${count === 1 ? "slice" : "slices"}.`;
  renderCustom();
}

function renderCustom() {
  const custom = state.experimental.custom;
  drawSpinner($("#custom-spinner-svg"), custom.slices, custom.rotation);
  $("#custom-slice-count").textContent = `${custom.slices.length} ${custom.slices.length === 1 ? "slice" : "slices"}`;
  $("#custom-total-label").textContent = `${custom.results.length} ${custom.results.length === 1 ? "spin" : "spins"}`;
  $("#custom-slice-editor").innerHTML = `
    <div class="slice-editor">
      ${custom.slices.map((slice, index) => `
        <div class="slice-row">
          <label class="swatch-label">
            <span class="swatch" style="background: ${slice.color}"></span>
            <select data-slice-label="${index}" aria-label="Color for slice ${index + 1}">
              ${COLOR_ORDER.map((label) => `
                <option value="${label}" ${label === slice.label ? "selected" : ""}>${label}</option>
              `).join("")}
            </select>
          </label>
          <label>
            Weight
            <input data-slice-weight="${index}" type="number" min="1" max="12" step="1" value="${slice.weight}">
          </label>
          <button class="quiet-button" data-slice-remove="${index}" type="button">Remove</button>
        </div>
      `).join("")}
    </div>
  `;
  renderOutputControls("custom", custom);
  $("#custom-results").innerHTML = renderOutcomeTable(custom.results, summarizeSlices(custom.slices), custom, "Run the experiment to collect data.");
}

function summarizeSlices(slices) {
  const summary = new Map();
  slices.forEach((slice) => {
    const current = summary.get(slice.label) || { label: slice.label, color: slice.color, weight: 0 };
    current.weight += slice.weight;
    summary.set(slice.label, current);
  });
  return Array.from(summary.values());
}

function renderOutputControls(prefix, settings) {
  const viewSelect = $(`#${prefix}-output-view`);
  const theoreticalButton = $(`#${prefix}-theoretical-toggle`);
  if (!viewSelect || !theoreticalButton) return;

  viewSelect.value = settings.outputView;
  theoreticalButton.setAttribute("aria-pressed", String(settings.showTheoretical));
  theoreticalButton.textContent = settings.showTheoretical ? "Hide Theoretical" : "Show Theoretical";
  theoreticalButton.classList.toggle("active", settings.showTheoretical);
}

function renderOutcomeTable(results, outcomes, settings, emptyMessage) {
  if (!results.length) return makeEmpty(emptyMessage);

  const counts = countBy(results);
  const total = results.length;
  const rows = normalizeOutcomes(outcomes).map((outcome) => {
    const count = counts.get(outcome.label) || 0;
    return {
      ...outcome,
      count,
      observed: total ? count / total : 0,
    };
  });
  const resultHeader = settings.outputView === "relative" ? "Relative Frequency" : "Count";

  return `
    <div class="table-wrap">
      <table class="results-table">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>${resultHeader}</th>
            ${settings.showTheoretical ? "<th>Theoretical</th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${renderOutcomeLabel(row)}</td>
              <td>${formatResultValue(row, total, settings)}</td>
              ${settings.showTheoretical ? `<td>${formatDecimal(row.probability)} (${percent(row.probability)})</td>` : ""}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function normalizeOutcomes(outcomes) {
  const totalWeight = outcomes.reduce((sum, outcome) => sum + (outcome.weight || 0), 0);
  return outcomes.map((outcome) => ({
    ...outcome,
    probability: outcome.probability ?? (totalWeight ? outcome.weight / totalWeight : 0),
  }));
}

function renderOutcomeLabel(outcome) {
  if (!outcome.color) return escapeHtml(outcome.label);
  return `<span class="swatch" style="display:inline-block; background:${outcome.color}"></span> ${escapeHtml(outcome.label)}`;
}

function formatResultValue(row, total, settings) {
  if (settings.outputView !== "relative") return row.count;
  return `${row.count}/${total}`;
}

function rollDice() {
  const dice = state.experimental.dice;
  dice.count = getRadioValue("dice-count");
  const count = getTrialCount("dice-roll-count", "#dice-custom-count");
  const rolls = [];
  let lastFaces = [];

  for (let index = 0; index < count; index += 1) {
    const faces = Array.from({ length: dice.count }, () => randomItem(dice.faces));
    lastFaces = faces;
    rolls.push(formatDiceOutcome(faces));
  }

  dice.lastFaces = lastFaces;
  dice.results.push(...rolls);
  $("#dice-last-result").textContent = `${count} ${count === 1 ? "roll" : "rolls"} added. Last roll: ${rolls[rolls.length - 1]}.`;
  renderDice();
}

function formatDiceOutcome(faces) {
  const numeric = faces.every((face) => /^-?\d+(\.\d+)?$/.test(face));
  if (numeric) {
    const total = faces.reduce((sum, face) => sum + Number(face), 0);
    return String(total);
  }
  return faces.join(" + ");
}

function resetDice() {
  state.experimental.dice.faces = ["1", "2", "3", "4", "5", "6"];
  state.experimental.dice.results = [];
  state.experimental.dice.lastFaces = Array.from({ length: state.experimental.dice.count }, () => "1");
  $("#dice-last-result").textContent = "Ready to roll.";
  renderDice();
}

function clearDice() {
  state.experimental.dice.results = [];
  $("#dice-last-result").textContent = "Ready to roll.";
  renderDice();
}

function renderDice() {
  const dice = state.experimental.dice;
  dice.count = getRadioValue("dice-count");
  $("#dice-total-label").textContent = `${dice.results.length} ${dice.results.length === 1 ? "roll" : "rolls"}`;
  $("#dice-editor-panel").classList.toggle("hidden", !dice.editorOpen);
  $("#dice-make").setAttribute("aria-expanded", String(dice.editorOpen));
  renderOutputControls("dice", dice);
  renderDiceVisuals();
  renderDiceEditor();
  $("#dice-results").innerHTML = renderDiceResults();
}

function renderDiceVisuals() {
  const dice = state.experimental.dice;
  const faces = dice.lastFaces.length === dice.count
    ? dice.lastFaces
    : Array.from({ length: dice.count }, () => dice.faces[0]);
  $("#dice-visuals").innerHTML = faces.map((face) => renderDie(face)).join("");
}

function renderDie(face) {
  const number = Number(face);
  if (Number.isInteger(number) && number >= 1 && number <= 6) {
    const positions = {
      1: [5],
      2: [1, 9],
      3: [1, 5, 9],
      4: [1, 3, 7, 9],
      5: [1, 3, 5, 7, 9],
      6: [1, 3, 4, 6, 7, 9],
    };
    return `
      <div class="die" aria-label="Die showing ${number}">
        ${Array.from({ length: 9 }, (_, index) => {
          const place = index + 1;
          return positions[number].includes(place)
            ? `<span class="pip" style="grid-area:${gridArea(place)}"></span>`
            : "<span></span>";
        }).join("")}
      </div>
    `;
  }

  return `
    <div class="die" aria-label="Die showing ${escapeHtml(face)}">
      <span class="die-label">${escapeHtml(face)}</span>
    </div>
  `;
}

function gridArea(place) {
  const row = Math.ceil(place / 3);
  const col = ((place - 1) % 3) + 1;
  return `${row} / ${col}`;
}

function renderDiceEditor() {
  const dice = state.experimental.dice;
  $("#dice-face-editor").innerHTML = dice.faces.map((face, index) => `
    <label>
      Face ${index + 1}
      <input data-dice-face="${index}" type="text" maxlength="8" value="${escapeHtml(face)}">
    </label>
  `).join("");
}

function renderDiceResults() {
  const dice = state.experimental.dice;
  const outcomes = dice.count === 1 ? oneDieOutcomes(dice.faces) : twoDiceOutcomes(dice.faces);
  return renderOutcomeTable(dice.results, outcomes, dice, "Roll the dice to collect data.");
}

function oneDieOutcomes(faces) {
  const counts = countBy(faces.map((face) => formatDiceOutcome([face])));
  const total = faces.length;
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, probability: count / total }))
    .sort(compareOutcomes);
}

function twoDiceOutcomes(faces) {
  const outcomes = [];
  faces.forEach((left) => {
    faces.forEach((right) => {
      outcomes.push(formatDiceOutcome([left, right]));
    });
  });

  const counts = countBy(outcomes);
  const total = outcomes.length;
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, probability: count / total }))
    .sort(compareOutcomes);
}

function compareOutcomes(a, b) {
  const left = Number(a.label);
  const right = Number(b.label);
  if (Number.isFinite(left) && Number.isFinite(right)) return left - right;
  return a.label.localeCompare(b.label);
}

function animateReveal(selector) {
  const node = $(selector);
  if (!node) return;
  node.classList.remove("animate");
  void node.offsetWidth;
  node.classList.add("animate");
}

function resetPennies() {
  state.pennies.bag = shuffleArray(PENNY_AGES);
  state.pennies.drawn = [];
  state.pennies.current = null;
  $("#penny-status").textContent = "Mix the bag and pull a penny to begin.";
  renderPennies();
}

function pullPennies(count) {
  const available = state.pennies.bag.length;
  if (!available) {
    $("#penny-status").textContent = "The paper bag is empty. Reset the bag to sample again.";
    return;
  }

  const actual = Math.min(count, available);
  const pulled = state.pennies.bag.splice(0, actual);
  state.pennies.drawn.push(...pulled);
  state.pennies.current = pulled[pulled.length - 1];
  $("#penny-status").textContent = actual < count
    ? `The bag ran out, so ${actual} ${actual === 1 ? "penny was" : "pennies were"} pulled.`
    : `Pulled ${actual} ${actual === 1 ? "penny" : "pennies"}. Larger numbers mean older pennies.`;
  animateReveal("#penny-reveal-token");
  renderPennies();
}

function renderPennies() {
  const pennies = state.pennies.drawn;
  const total = pennies.length;
  const remaining = state.pennies.bag.length;
  const oldest = total ? Math.max(...pennies) : 0;
  const newest = total ? Math.min(...pennies) : 0;
  const sampleMedian = median(pennies);
  const current = state.pennies.current;

  $("#penny-show-tables").checked = state.pennies.showTables;
  $("#penny-show-milestones").checked = state.pennies.showMilestones;
  $("#penny-total-drawn").textContent = total;
  $("#penny-remaining").textContent = remaining;
  $("#penny-current-max").textContent = oldest;
  $("#penny-current-age").textContent = current === null ? "Ready" : `${current} years`;

  const reveal = $("#penny-reveal-token");
  reveal.textContent = current === null ? "?" : current;

  if (!total) {
    $("#penny-summary").textContent = "No pennies pulled yet.";
    $("#penny-output").innerHTML = makeEmpty("Pull pennies from the bag to build a random sample of penny ages.");
    return;
  }

  $("#penny-summary").textContent = `${total} ${total === 1 ? "penny" : "pennies"} pulled. Newest age: ${newest}. Median age: ${formatDecimal(sampleMedian)}. Oldest age: ${oldest}.`;

  const plotValues = pennies.slice(0, PENNY_DOT_PLOT_LIMIT);
  const note = total > PENNY_DOT_PLOT_LIMIT
    ? "* Only the first 75 pennies are depicted in the dot plot."
    : "";

  const sections = [
    `
      <div class="count-grid">
        <div class="count-card">
          <strong>${total}</strong>
          <span>Pennies Pulled</span>
        </div>
        <div class="count-card">
          <strong>${formatDecimal(sampleMedian)}</strong>
          <span>Median Age</span>
        </div>
        <div class="count-card">
          <strong>${oldest}</strong>
          <span>Oldest Penny</span>
        </div>
      </div>
    `,
  ];

  if (total < 10) {
    sections.push(`<p class="helper-text">Pull ${10 - total} more ${10 - total === 1 ? "penny" : "pennies"} to show the dot plot.</p>`);
  } else {
    sections.push(`
      <div class="chart-block">
        <div class="output-heading compact-heading">
          <h3>Dot Plot of Penny Ages</h3>
          <p>${note || `${plotValues.length} penny ages shown.`}</p>
        </div>
        ${renderDotPlot(plotValues, { min: 0, max: 55, tickEvery: 5, axisLabel: "Penny Age (years)" })}
      </div>
    `);
  }

  if (state.pennies.showMilestones) {
    const milestonePlots = PENNY_MILESTONES
      .filter((size) => total >= size)
      .map((size) => `
        <article class="snapshot-card">
          <h4>${size} Penny Sample</h4>
          ${renderDotPlot(pennies.slice(0, size), { min: 0, max: 55, tickEvery: 5, axisLabel: "Age", compact: true })}
        </article>
      `)
      .join("");

    sections.push(milestonePlots
      ? `<div class="snapshot-grid">${milestonePlots}</div>`
      : `<p class="helper-text">Milestone snapshots appear after you reach 10 pennies.</p>`);
  }

  if (state.pennies.showTables) {
    sections.push(renderPennyTables(pennies));
  }

  $("#penny-output").innerHTML = sections.join("");
}

function renderDotPlot(values, options = {}) {
  const {
    min = 0,
    max = 10,
    tickEvery = 1,
    axisLabel = "Value",
    compact = false,
  } = options;

  const cols = max - min + 1;

  // Compute dot size so the plot fits without horizontal scrolling.
  // Estimate available width: ~1060 px for full-width panels, ~230 px for
  // compact milestone cards (minmax-260 grid reduced by padding).
  const availableWidth = compact ? 230 : 1060;
  const rawSize = Math.floor(availableWidth / cols) - 2;
  const dotSize = Math.max(4, Math.min(compact ? 9 : 13, rawSize));
  const dotGap  = Math.max(1, Math.round(dotSize * 0.18));
  const rowHeight = dotSize + dotGap;

  const counts = countBy(values);
  const maxStack = Math.max(1, ...Array.from(counts.values()), 1);
  const columns = Array.from({ length: cols }, (_, index) => {
    const value = min + index;
    const count = counts.get(value) || 0;
    return `
      <div class="dot-column">
        <div class="dot-stack">
          ${Array.from({ length: count }, () => `<span class="dot"></span>`).join("")}
        </div>
        <div class="dot-label">${value % tickEvery === 0 ? value : ""}</div>
      </div>
    `;
  }).join("");

  return `
    <div class="table-wrap">
      <div class="dot-plot-shell" style="--dot-columns:${cols}; --dot-max-stack:${maxStack}; --dot-size:${dotSize}px; --dot-gap:${dotGap}px; --dot-row-height:${rowHeight}px;">
        <div class="dot-plot">${columns}</div>
        <p class="axis-label">${axisLabel}</p>
      </div>
    </div>
  `;
}

function renderPennyTables(values) {
  const counts = countBy(values);
  const total = values.length;
  const ages = Array.from(counts.keys()).sort((left, right) => left - right);

  return `
    <div class="dual-table-grid">
      <div class="output-panel inset-panel">
        <div class="output-heading compact-heading">
          <h3>Frequency Table</h3>
          <p>${total} total pennies</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Age</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              ${ages.map((age) => `
                <tr>
                  <td>${age}</td>
                  <td>${counts.get(age)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="output-panel inset-panel">
        <div class="output-heading compact-heading">
          <h3>Relative Frequency Table</h3>
          <p>Based on all pulls</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Age</th>
                <th>Relative Frequency</th>
              </tr>
            </thead>
            <tbody>
              ${ages.map((age) => {
                const frequency = counts.get(age);
                return `
                  <tr>
                    <td>${age}</td>
                    <td>${frequency}/${total} (${percent(frequency / total)})</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ─── Lesson 14: Skate Park Times ───────────────────────────────────────────

function resetSkateParkBag() {
  state.skatepark.bag = shuffleArray(SKATE_PARK_TIMES);
}

function pullSkateParkTimes(count) {
  const available = state.skatepark.bag.length;
  if (!available) {
    $("#skatepark-status").textContent = "All 800 times have been pulled. Clear the data to start again.";
    return;
  }

  const actual = Math.min(count, available);
  const pulled = state.skatepark.bag.splice(0, actual);
  state.skatepark.pulled.push(...pulled);
  state.skatepark.current = pulled[pulled.length - 1];

  $("#skatepark-status").textContent = actual < count
    ? `The pool ran out; ${actual} ${actual === 1 ? "time was" : "times were"} pulled.`
    : `Pulled ${actual} ${actual === 1 ? "time" : "times"}. Last: ${state.skatepark.current} min.`;
  animateReveal("#skatepark-reveal-token");
  renderSkatePark();
}

function clearSkateParkData() {
  resetSkateParkBag();
  state.skatepark.pulled = [];
  state.skatepark.current = null;
  $("#skatepark-status").textContent = "Data cleared. Ready to pull again.";
  renderSkatePark();
}

function getSkateParkPullCount() {
  const checked = document.querySelector("input[name='skatepark-pull-count']:checked");
  if (!checked) return 1;
  if (checked.value !== "custom") return Number(checked.value);
  const input = $("#skatepark-custom-count");
  const value = Math.min(Math.max(Math.floor(Number(input.value) || 1), 1), 800);
  input.value = value;
  return value;
}

function renderSkatePark() {
  const { pulled, current, bag } = state.skatepark;
  const total = pulled.length;
  const remaining = bag.length;

  $("#skatepark-total-pulled").textContent = total;
  $("#skatepark-remaining").textContent = remaining;

  const token = $("#skatepark-reveal-token");
  token.textContent = current === null ? "?" : current;

  $("#skatepark-current-time").textContent = current === null ? "Ready" : `${current} min`;
  $("#skatepark-summary").textContent = total
    ? `${total} ${total === 1 ? "time" : "times"} pulled so far.`
    : "No times pulled yet.";

  // Always render the output section (dot plot + tables)
  $("#skatepark-output").innerHTML = renderSkateParkOutput(pulled, total);
}

function renderSkateParkOutput(pulled, total) {
  const counts = countBy(pulled);
  const sortedValues = Array.from(counts.keys()).sort((a, b) => a - b);

  const dotPlotSection = `
    <div class="chart-block">
      <div class="output-heading compact-heading">
        <h3>Dot Plot of Session Times</h3>
        <p>${total} ${total === 1 ? "time" : "times"} pulled</p>
      </div>
      ${renderDotPlot(pulled, { min: 0, max: 95, tickEvery: 5, axisLabel: "Session Time (minutes)" })}
    </div>
  `;

  // Pull log table – one row per draw
  const pullLogRows = pulled.length
    ? pulled.map((val, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${val}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="2" style="color:var(--muted)">Pull times to see the log.</td></tr>`;

  const pullLogSection = `
    <div class="output-panel inset-panel">
      <div class="output-heading compact-heading">
        <h3>Pull Log</h3>
        <p>${total} ${total === 1 ? "entry" : "entries"}</p>
      </div>
      <div class="table-wrap" style="max-height:260px; overflow-y:auto;">
        <table>
          <thead>
            <tr>
              <th>Pull #</th>
              <th>Time (min)</th>
            </tr>
          </thead>
          <tbody>${pullLogRows}</tbody>
        </table>
      </div>
    </div>
  `;

  // Frequency table
  const freqRows = sortedValues.length
    ? sortedValues.map((val) => `
        <tr>
          <td>${val}</td>
          <td>${counts.get(val)}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="2" style="color:var(--muted)">Pull times to see frequencies.</td></tr>`;

  const freqSection = `
    <div class="output-panel inset-panel">
      <div class="output-heading compact-heading">
        <h3>Frequency Table</h3>
        <p>${total} total</p>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time (min)</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>${freqRows}</tbody>
        </table>
      </div>
    </div>
  `;

  // Relative frequency table
  const relFreqRows = sortedValues.length
    ? sortedValues.map((val) => {
        const count = counts.get(val);
        return `
          <tr>
            <td>${val}</td>
            <td>${count}/${total} (${percent(count / total)})</td>
          </tr>
        `;
      }).join("")
    : `<tr><td colspan="2" style="color:var(--muted)">Pull times to see relative frequencies.</td></tr>`;

  const relFreqSection = `
    <div class="output-panel inset-panel">
      <div class="output-heading compact-heading">
        <h3>Relative Frequency Table</h3>
        <p>Based on all pulls</p>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time (min)</th>
              <th>Relative Frequency</th>
            </tr>
          </thead>
          <tbody>${relFreqRows}</tbody>
        </table>
      </div>
    </div>
  `;

  return `
    ${dotPlotSection}
    <div class="dual-table-grid skatepark-table-grid">
      ${pullLogSection}
      ${freqSection}
      ${relFreqSection}
    </div>
  `;
}

// ───────────────────────────────────────────────────────────────────────────

function resetCubeSetup() {
  state.cubes.colors = makeDefaultCubeConfig();
  state.cubes.targetTotal = 20;
  state.cubes.replacement = true;
  state.cubes.draws = [];
  state.cubes.current = null;
  rebuildCubeBag();
  $("#cube-status").textContent = "Lesson-inspired bag restored. Pull a cube to begin.";
  renderCubes();
}

function clearCubeResults() {
  state.cubes.draws = [];
  state.cubes.current = null;
  rebuildCubeBag();
  $("#cube-status").textContent = "Results cleared. The bag is ready for another experiment.";
  renderCubes();
}

function updateCubeColor(index, updates) {
  state.cubes.colors[index] = {
    ...state.cubes.colors[index],
    ...updates,
  };
  state.cubes.targetTotal = getCubeTotal() || state.cubes.targetTotal;
  state.cubes.draws = [];
  state.cubes.current = null;
  rebuildCubeBag();
  $("#cube-status").textContent = "Bag updated; results cleared.";
  renderCubes();
}

function scaleCubeCountsToTarget() {
  const target = clamp(Math.floor(Number($("#cube-target-total").value) || 1), 1, 500);
  $("#cube-target-total").value = target;
  const active = state.cubes.colors.filter((item) => item.enabled);

  if (!active.length) {
    $("#cube-status").textContent = "Turn on at least one color before scaling the bag.";
    return;
  }

  const currentTotal = active.reduce((sum, item) => sum + item.count, 0);
  let nextCounts;

  if (currentTotal === 0) {
    const base = Math.floor(target / active.length);
    let remainder = target % active.length;
    nextCounts = active.map((item) => ({
      label: item.label,
      count: base + (remainder-- > 0 ? 1 : 0),
    }));
  } else {
    const raw = active.map((item) => ({
      label: item.label,
      exact: (item.count / currentTotal) * target,
    }));
    let assigned = 0;
    nextCounts = raw.map((item) => {
      const count = Math.floor(item.exact);
      assigned += count;
      return { label: item.label, count, remainder: item.exact - count };
    });
    nextCounts
      .sort((left, right) => right.remainder - left.remainder)
      .slice(0, target - assigned)
      .forEach((item) => {
        item.count += 1;
      });
  }

  state.cubes.colors = state.cubes.colors.map((item) => {
    const match = nextCounts.find((next) => next.label === item.label);
    return {
      ...item,
      count: item.enabled ? (match ? match.count : 0) : 0,
    };
  });
  state.cubes.targetTotal = target;
  state.cubes.draws = [];
  state.cubes.current = null;
  rebuildCubeBag();
  $("#cube-status").textContent = `Bag scaled to ${target} cubes and results were cleared.`;
  renderCubes();
}

function drawCubes(count) {
  const activeBag = expandCubeBag(state.cubes.colors);
  if (!activeBag.length) {
    $("#cube-status").textContent = "Add at least one active cube to the bag before pulling.";
    return;
  }

  let pulls = [];
  if (state.cubes.replacement) {
    pulls = Array.from({ length: count }, () => randomItem(activeBag));
  } else {
    const actual = Math.min(count, state.cubes.bag.length);
    pulls = state.cubes.bag.splice(0, actual);
    if (!pulls.length) {
      $("#cube-status").textContent = "No cubes remain in the bag. Clear results or turn replacement back on.";
      renderCubes();
      return;
    }
    if (actual < count) {
      $("#cube-status").textContent = `Only ${actual} ${actual === 1 ? "cube was" : "cubes were"} available to pull.`;
    }
  }

  state.cubes.draws.push(...pulls);
  state.cubes.current = pulls[pulls.length - 1];
  if (!(!state.cubes.replacement && pulls.length < count)) {
    $("#cube-status").textContent = `${pulls.length} ${pulls.length === 1 ? "cube" : "cubes"} pulled ${state.cubes.replacement ? "with replacement" : "without replacement"}.`;
  }
  animateReveal("#cube-reveal-token");
  renderCubes();
}

function renderCubes() {
  const totalInBag = getCubeTotal();
  const remaining = state.cubes.replacement ? totalInBag : state.cubes.bag.length;
  const current = state.cubes.current;
  const currentColor = current ? COLORS[current] : "#ffffff";
  const currentText = current ? getReadableTextColor(currentColor) : "#17211f";

  $("#cube-target-total").value = state.cubes.targetTotal;
  $("#cube-total-drawn").textContent = state.cubes.draws.length;
  $("#cube-active-total").textContent = totalInBag;
  $("#cube-remaining").textContent = remaining;
  $("#cube-current-color").textContent = current || "Ready";

  const token = $("#cube-reveal-token");
  token.textContent = current || "?";
  token.style.background = current ? currentColor : "#ffffff";
  token.style.color = currentText;
  token.style.borderColor = current ? currentColor : "#cbd8d2";

  const toggle = $("#cube-replacement-toggle");
  toggle.classList.toggle("active", state.cubes.replacement);
  toggle.setAttribute("aria-pressed", String(state.cubes.replacement));
  toggle.textContent = state.cubes.replacement ? "With Replacement" : "Without Replacement";

  $("#cube-color-editor").innerHTML = renderCubeEditor();
  $("#cube-summary").textContent = totalInBag
    ? `${totalInBag} cubes configured across ${getCubeActiveConfig().length} active ${getCubeActiveConfig().length === 1 ? "color" : "colors"}.`
    : "No cubes are active in the bag yet.";
  $("#cube-output").innerHTML = renderCubeOutput();
}

function renderCubeEditor() {
  const total = getCubeTotal();
  return state.cubes.colors.map((item, index) => {
    const share = total && item.enabled ? percent(item.count / total) : "0.0%";
    return `
      <div class="color-row ${item.enabled ? "" : "muted-row"}">
        <label class="color-toggle">
          <input data-cube-enabled="${index}" type="checkbox" ${item.enabled ? "checked" : ""}>
          <span class="swatch" style="background:${item.color}"></span>
          <span>${item.label}</span>
        </label>
        <label>
          Count
          <input data-cube-count="${index}" type="number" min="0" max="500" step="1" value="${item.count}" ${item.enabled ? "" : "disabled"}>
        </label>
        <span class="helper-chip">${share}</span>
      </div>
    `;
  }).join("");
}

function renderCubeOutput() {
  const active = getCubeActiveConfig();
  const total = getCubeTotal();
  const drawCounts = countBy(state.cubes.draws);

  const bagRows = active.length
    ? active.map((item) => `
        <tr>
          <td>${renderOutcomeLabel(item)}</td>
          <td>${item.count}</td>
          <td>${total ? percent(item.count / total) : "0.0%"}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="3">No active colors yet.</td></tr>`;

  const sampleRows = active.length
    ? active.map((item) => {
        const frequency = drawCounts.get(item.label) || 0;
        return `
          <tr>
            <td>${renderOutcomeLabel(item)}</td>
            <td>${frequency}</td>
            <td>${state.cubes.draws.length ? `${frequency}/${state.cubes.draws.length} (${percent(frequency / state.cubes.draws.length)})` : "0/0"}</td>
          </tr>
        `;
      }).join("")
    : `<tr><td colspan="3">Add active colors to start sampling.</td></tr>`;

  return `
    <div class="count-grid">
      <div class="count-card">
        <strong>${total}</strong>
        <span>Bag Size</span>
      </div>
      <div class="count-card">
        <strong>${state.cubes.draws.length}</strong>
        <span>Cubes Pulled</span>
      </div>
      <div class="count-card">
        <strong>${state.cubes.replacement ? "On" : "Off"}</strong>
        <span>Replacement</span>
      </div>
    </div>

    <div class="dual-table-grid">
      <div class="output-panel inset-panel">
        <div class="output-heading compact-heading">
          <h3>Bag Distribution</h3>
          <p>Lesson 2 inspired and editable</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Count</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>${bagRows}</tbody>
          </table>
        </div>
      </div>

      <div class="output-panel inset-panel">
        <div class="output-heading compact-heading">
          <h3>Sample Distribution</h3>
          <p>${state.cubes.draws.length ? "Observed from pulls" : "Pull cubes to collect data"}</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Frequency</th>
                <th>Relative Frequency</th>
              </tr>
            </thead>
            <tbody>${sampleRows}</tbody>
          </table>
        </div>
      </div>
    </div>

    ${renderCubeBars(active, drawCounts, state.cubes.draws.length)}
  `;
}

function renderCubeBars(active, drawCounts, totalDraws) {
  if (!totalDraws) return makeEmpty("Pull cubes to compare the color frequencies in your sample.");

  return `
    <div class="cube-bar-grid">
      ${active.map((item) => {
        const count = drawCounts.get(item.label) || 0;
        const value = totalDraws ? count / totalDraws : 0;
        return `
          <div class="ratio-item" style="border-left-color:${item.color}">
            <strong>${count}</strong>
            <span>${item.label}</span>
            <div class="meter" aria-hidden="true"><span style="--value:${value * 100}%; background:${item.color}"></span></div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function bindEvents() {
  $$(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activity = button.dataset.activity;
      renderActivity();
    });
  });

  $$(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.experimental.mode = button.dataset.mode;
      renderMode();
    });
  });

  $("#coin-toss-button").addEventListener("click", tossCoins);
  $("#coin-clear-button").addEventListener("click", clearCoin);
  $("#coin-detail-view").addEventListener("change", (event) => {
    state.coin.view = event.target.value;
    renderCoin();
  });

  $("#poem-pick-one").addEventListener("click", () => pickPoemWords(1));
  $("#poem-clear").addEventListener("click", clearPoemWords);

  $("#preset-select").addEventListener("change", resetPresetSpinner);
  $("#preset-spin").addEventListener("click", spinPreset);
  $("#preset-clear").addEventListener("click", clearPreset);
  $("#preset-new-spinner").addEventListener("click", resetPresetSpinner);
  bindOutputControls("preset", state.experimental.preset, renderPreset);

  $("#custom-spin").addEventListener("click", spinCustom);
  $("#custom-clear").addEventListener("click", clearCustom);
  $("#custom-apply-split").addEventListener("click", applyCustomSplit);
  $("#custom-add").addEventListener("click", addCustomSlice);
  $("#custom-remove").addEventListener("click", removeCustomSlice);
  bindOutputControls("custom", state.experimental.custom, renderCustom);
  $("#custom-slice-editor").addEventListener("change", (event) => {
    const labelIndex = event.target.dataset.sliceLabel;
    const weightIndex = event.target.dataset.sliceWeight;
    if (labelIndex !== undefined) {
      const label = event.target.value;
      updateCustomSlice(Number(labelIndex), { label, color: COLORS[label] });
    }
    if (weightIndex !== undefined) {
      updateCustomSlice(Number(weightIndex), { weight: Math.min(Math.max(Number(event.target.value) || 1, 1), 12) });
    }
  });
  $("#custom-slice-editor").addEventListener("click", (event) => {
    const removeIndex = event.target.dataset.sliceRemove;
    if (removeIndex === undefined) return;
    if (state.experimental.custom.slices.length <= 1) {
      $("#custom-last-result").textContent = "Keep at least one slice on the spinner.";
      return;
    }
    state.experimental.custom.slices.splice(Number(removeIndex), 1);
    state.experimental.custom.results = [];
    $("#custom-last-result").textContent = "Spinner changed; results cleared.";
    renderCustom();
  });

  $$("input[name='dice-count']").forEach((input) => {
    input.addEventListener("change", () => {
      const dice = state.experimental.dice;
      dice.count = getRadioValue("dice-count");
      dice.results = [];
      dice.lastFaces = Array.from({ length: dice.count }, (_, index) => dice.lastFaces[index] || dice.faces[0]);
      $("#dice-last-result").textContent = "Dice changed; results cleared.";
      renderDice();
    });
  });
  $("#dice-roll").addEventListener("click", rollDice);
  $("#dice-clear").addEventListener("click", clearDice);
  $("#dice-new").addEventListener("click", resetDice);
  bindOutputControls("dice", state.experimental.dice, renderDice);
  $("#dice-make").addEventListener("click", () => {
    state.experimental.dice.editorOpen = !state.experimental.dice.editorOpen;
    renderDice();
  });
  $("#dice-face-editor").addEventListener("input", (event) => {
    const faceIndex = event.target.dataset.diceFace;
    if (faceIndex === undefined) return;
    state.experimental.dice.faces[Number(faceIndex)] = event.target.value.trim() || "?";
    state.experimental.dice.results = [];
    $("#dice-last-result").textContent = "Dice changed; results cleared.";
    renderDiceVisuals();
    $("#dice-results").innerHTML = renderDiceResults();
  });

  $("#penny-pull-1").addEventListener("click", () => pullPennies(1));
  $("#penny-pull-5").addEventListener("click", () => pullPennies(5));
  $("#penny-pull-10").addEventListener("click", () => pullPennies(10));
  $("#penny-reset").addEventListener("click", resetPennies);
  $("#penny-show-tables").addEventListener("change", (event) => {
    state.pennies.showTables = event.target.checked;
    renderPennies();
  });
  $("#penny-show-milestones").addEventListener("change", (event) => {
    state.pennies.showMilestones = event.target.checked;
    renderPennies();
  });

  $("#skatepark-pull").addEventListener("click", () => pullSkateParkTimes(getSkateParkPullCount()));
  $("#skatepark-clear").addEventListener("click", clearSkateParkData);
  $$("input[name='skatepark-pull-count']").forEach((input) => {
    input.addEventListener("change", () => {
      const isCustom = input.value === "custom";
      $("#skatepark-custom-label").style.display = isCustom ? "" : "none";
    });
  });

  $("#cube-draw-1").addEventListener("click", () => drawCubes(1));
  $("#cube-draw-5").addEventListener("click", () => drawCubes(5));
  $("#cube-draw-10").addEventListener("click", () => drawCubes(10));
  $("#cube-reset-results").addEventListener("click", clearCubeResults);
  $("#cube-reset-setup").addEventListener("click", resetCubeSetup);
  $("#cube-apply-total").addEventListener("click", scaleCubeCountsToTarget);
  $("#cube-replacement-toggle").addEventListener("click", () => {
    state.cubes.replacement = !state.cubes.replacement;
    state.cubes.draws = [];
    state.cubes.current = null;
    rebuildCubeBag();
    $("#cube-status").textContent = `Sampling will now happen ${state.cubes.replacement ? "with" : "without"} replacement. Results were cleared.`;
    renderCubes();
  });
  $("#cube-color-editor").addEventListener("change", (event) => {
    const enabledIndex = event.target.dataset.cubeEnabled;
    const countIndex = event.target.dataset.cubeCount;
    if (enabledIndex !== undefined) {
      const enabled = event.target.checked;
      const index = Number(enabledIndex);
      updateCubeColor(index, {
        enabled,
        count: enabled ? Math.max(1, state.cubes.colors[index].count || 1) : 0,
      });
    }
    if (countIndex !== undefined) {
      const nextCount = clamp(Math.floor(Number(event.target.value) || 0), 0, 500);
      updateCubeColor(Number(countIndex), { count: nextCount });
    }
  });
}

function bindOutputControls(prefix, settings, renderFn) {
  $(`#${prefix}-output-view`).addEventListener("change", (event) => {
    settings.outputView = event.target.value;
    renderFn();
  });
  $(`#${prefix}-theoretical-toggle`).addEventListener("click", () => {
    settings.showTheoretical = !settings.showTheoretical;
    renderFn();
  });
}

function renderStaticControls() {
  $("#preset-select").innerHTML = SPINNER_PRESETS.map((preset) => `
    <option value="${preset.id}">${preset.name}</option>
  `).join("");

  $("#custom-split-select").innerHTML = SPINNER_SPLITS.map((denominator) => `
    <option value="${denominator}">1/${denominator} each (${denominator} slices)</option>
  `).join("");
  $("#custom-split-select").value = "4";
}

function init() {
  renderStaticControls();
  bindEvents();
  renderActivity();
  renderMode();
  renderCoin();
  renderPoem();
  renderPreset();
  renderCustom();
  renderDice();
  renderPennies();
  renderCubes();
  renderSkatePark();
}

init();
