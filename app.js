const COLORS = {
  Red: "#d62828",
  Orange: "#f77f00",
  Yellow: "#f4d35e",
  Green: "#007f5f",
  Blue: "#0096c7",
  Purple: "#7b2cbf",
  Pink: "#ff8fab",
};

const COLOR_ORDER = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink"];
const SPINNER_SPLITS = [2, 3, 4, 5, 6, 8, 10, 12];
const MAX_TRIALS = 10000;

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

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const formatDecimal = (value) => Number.isFinite(value) ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : "0";
const percent = (value) => `${(value * 100).toFixed(1)}%`;

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

function renderActivity() {
  $$(".tab-button").forEach((button) => {
    const active = button.dataset.activity === state.activity;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  $("#coin-activity").classList.toggle("active", state.activity === "coin");
  $("#experimental-activity").classList.toggle("active", state.activity === "experimental");
  $("#poem-activity").classList.toggle("active", state.activity === "poem");
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
  return luminance > 0.58 ? "#17211f" : "#ffffff";
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
    if (target <= 0) {
      return slice.label;
    }
  }
  return slices[slices.length - 1].label;
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

function spinMany(slices, count) {
  return Array.from({ length: count }, () => weightedSpin(slices));
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
  if (!results.length) {
    return makeEmpty(emptyMessage);
  }

  const counts = countBy(results);
  const total = results.length;
  const rows = normalizeOutcomes(outcomes).map((outcome) => {
    const count = counts.get(outcome.label) || 0;
    const observed = total ? count / total : 0;
    return {
      ...outcome,
      count,
      observed,
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

  for (let i = 0; i < count; i += 1) {
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
          return positions[number].includes(place) ? `<span class="pip" style="grid-area:${gridArea(place)}"></span>` : "<span></span>";
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
  if (Number.isFinite(left) && Number.isFinite(right)) {
    return left - right;
  }
  return a.label.localeCompare(b.label);
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

  $$('input[name="dice-count"]').forEach((input) => {
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
}

init();
