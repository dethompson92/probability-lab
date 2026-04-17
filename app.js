const COLORS = {
  Red: "#d62828",
  Yellow: "#f4d35e",
  Green: "#007f5f",
  Blue: "#0096c7",
};

const state = {
  activity: "coin",
  coin: {
    tosses: [],
    view: "list",
  },
  experimental: {
    mode: "preset",
    preset: {
      slices: [
        { label: "Red", color: COLORS.Red, weight: 1 },
        { label: "Yellow", color: COLORS.Yellow, weight: 1 },
        { label: "Green", color: COLORS.Green, weight: 1 },
        { label: "Blue", color: COLORS.Blue, weight: 1 },
      ],
      results: [],
      rotation: 0,
    },
    custom: {
      slices: [
        { label: "Red", color: COLORS.Red, weight: 3 },
        { label: "Yellow", color: COLORS.Yellow, weight: 3 },
        { label: "Green", color: COLORS.Green, weight: 3 },
        { label: "Blue", color: COLORS.Blue, weight: 3 },
      ],
      results: [],
      rotation: 0,
    },
    dice: {
      count: 2,
      faces: ["1", "2", "3", "4", "5", "6"],
      results: [],
      lastFaces: ["1", "1"],
      editorOpen: false,
    },
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const formatDecimal = (value) => Number.isFinite(value) ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : "0";
const percent = (value) => `${(value * 100).toFixed(1)}%`;

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? Number(checked.value) : 1;
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
  const tossCount = Math.min(Math.max(Math.floor(requested || 1), 1), 10000);
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

  $$(".chip[data-coin-view]").forEach((button) => {
    const active = button.dataset.coinView === state.coin.view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (!total) {
    $("#coin-output").innerHTML = makeEmpty("Toss the coin to start a new list of results.");
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

function renderRatioItem(label, count, total, color) {
  const value = total ? count / total : 0;
  return `
    <div class="ratio-item" style="border-left-color: ${color}">
      <strong>${count}/${total}</strong>
      <span>${label}: ${formatDecimal(value)} or ${percent(value)}</span>
      <div class="meter" aria-hidden="true"><span style="--value: ${value * 100}%; background: ${color}"></span></div>
    </div>
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
    if (angle >= 359.999) {
      return `
        <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${slice.color}" stroke="#17211f" stroke-width="5"></circle>
        <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
          fill="${slice.label === "Yellow" ? "#17211f" : "#ffffff"}" font-size="18" font-weight="800">${slice.label}</text>
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
        fill="${slice.label === "Yellow" ? "#17211f" : "#ffffff"}" font-size="14" font-weight="800">${slice.label}</text>
    `;
  }).join("") + `
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#17211f" stroke-width="5"></circle>
    <circle cx="${cx}" cy="${cy}" r="9" fill="#17211f"></circle>
  `;
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
  const count = getRadioValue("preset-spin-count");
  const results = spinMany(state.experimental.preset.slices, count);
  state.experimental.preset.results.push(...results);
  state.experimental.preset.rotation += 720 + Math.random() * 720;
  $("#preset-last-result").textContent = `${count} ${count === 1 ? "spin" : "spins"} added. Last spin: ${results[results.length - 1]}.`;
  renderPreset();
}

function spinCustom() {
  const count = getRadioValue("custom-spin-count");
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
  state.experimental.preset.slices = [
    { label: "Red", color: COLORS.Red, weight: 1 },
    { label: "Yellow", color: COLORS.Yellow, weight: 1 },
    { label: "Green", color: COLORS.Green, weight: 1 },
    { label: "Blue", color: COLORS.Blue, weight: 1 },
  ];
  clearPreset();
}

function renderPreset() {
  const preset = state.experimental.preset;
  drawSpinner($("#preset-spinner-svg"), preset.slices, preset.rotation);
  $("#preset-total-label").textContent = `${preset.results.length} ${preset.results.length === 1 ? "spin" : "spins"}`;
  $("#preset-tally").innerHTML = renderTallyTable(preset.results, preset.slices);
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
  $("#custom-last-result").textContent = "Spinner changed; tally cleared.";
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
  $("#custom-last-result").textContent = "Spinner changed; tally cleared.";
  renderCustom();
}

function updateCustomSlice(index, updates) {
  const slice = state.experimental.custom.slices[index];
  state.experimental.custom.slices[index] = {
    ...slice,
    ...updates,
  };
  state.experimental.custom.results = [];
  $("#custom-last-result").textContent = "Spinner changed; tally cleared.";
  renderCustom();
}

function clearCustom() {
  state.experimental.custom.results = [];
  $("#custom-last-result").textContent = "Ready to spin.";
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
              ${Object.keys(COLORS).map((label) => `
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
  $("#custom-tally").innerHTML = renderTallyTable(custom.results, summarizeSlices(custom.slices));
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

function renderTallyTable(results, outcomes) {
  if (!results.length) {
    return makeEmpty("Run the experiment to collect data.");
  }

  const counts = countBy(results);
  const total = results.length;
  const totalWeight = outcomes.reduce((sum, item) => sum + item.weight, 0);
  const rows = outcomes.map((outcome) => {
    const count = counts.get(outcome.label) || 0;
    const observed = total ? count / total : 0;
    const theoretical = totalWeight ? outcome.weight / totalWeight : 0;
    return {
      ...outcome,
      count,
      observed,
      theoretical,
    };
  });

  return `
    <div class="table-wrap">
      <table class="tally-table">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Tally</th>
            <th>Count</th>
            <th>Relative Frequency</th>
            <th>Theoretical</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td><span class="swatch" style="display:inline-block; background:${row.color}"></span> ${row.label}</td>
              <td class="tally-marks">${makeTally(row.count)}</td>
              <td>${row.count}</td>
              <td>${formatDecimal(row.observed)} (${percent(row.observed)})</td>
              <td>${formatDecimal(row.theoretical)} (${percent(row.theoretical)})</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function makeTally(count) {
  if (!count) return "0";
  const groups = Math.floor(count / 5);
  const remainder = count % 5;
  return `${"||||/ ".repeat(groups)}${"|".repeat(remainder)}`.trim();
}

function rollDice() {
  const dice = state.experimental.dice;
  dice.count = getRadioValue("dice-count");
  const count = getRadioValue("dice-roll-count");
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
  renderDiceVisuals();
  renderDiceEditor();
  $("#dice-tally").innerHTML = renderDiceTally();
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

function renderDiceTally() {
  const dice = state.experimental.dice;
  if (!dice.results.length) {
    return makeEmpty("Roll the dice to collect data.");
  }

  const counts = countBy(dice.results);
  const outcomes = dice.count === 1 ? oneDieOutcomes(dice.faces) : twoDiceOutcomes(dice.faces);
  const total = dice.results.length;
  return `
    <div class="table-wrap">
      <table class="tally-table">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Tally</th>
            <th>Count</th>
            <th>Relative Frequency</th>
            <th>Theoretical</th>
          </tr>
        </thead>
        <tbody>
          ${outcomes.map((outcome) => {
            const count = counts.get(outcome.label) || 0;
            const observed = count / total;
            return `
              <tr>
                <td>${escapeHtml(outcome.label)}</td>
                <td class="tally-marks">${makeTally(count)}</td>
                <td>${count}</td>
                <td>${formatDecimal(observed)} (${percent(observed)})</td>
                <td>${formatDecimal(outcome.probability)} (${percent(outcome.probability)})</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
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
  $$(".chip[data-coin-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.coin.view = button.dataset.coinView;
      renderCoin();
    });
  });

  $("#preset-spin").addEventListener("click", spinPreset);
  $("#preset-clear").addEventListener("click", clearPreset);
  $("#preset-new-spinner").addEventListener("click", resetPresetSpinner);

  $("#custom-spin").addEventListener("click", spinCustom);
  $("#custom-clear").addEventListener("click", clearCustom);
  $("#custom-add").addEventListener("click", addCustomSlice);
  $("#custom-remove").addEventListener("click", removeCustomSlice);
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
    $("#custom-last-result").textContent = "Spinner changed; tally cleared.";
    renderCustom();
  });

  $$('input[name="dice-count"]').forEach((input) => {
    input.addEventListener("change", () => {
      const dice = state.experimental.dice;
      dice.count = getRadioValue("dice-count");
      dice.results = [];
      dice.lastFaces = Array.from({ length: dice.count }, (_, index) => dice.lastFaces[index] || dice.faces[0]);
      $("#dice-last-result").textContent = "Dice changed; tally cleared.";
      renderDice();
    });
  });
  $("#dice-roll").addEventListener("click", rollDice);
  $("#dice-clear").addEventListener("click", clearDice);
  $("#dice-new").addEventListener("click", resetDice);
  $("#dice-make").addEventListener("click", () => {
    state.experimental.dice.editorOpen = !state.experimental.dice.editorOpen;
    renderDice();
  });
  $("#dice-face-editor").addEventListener("input", (event) => {
    const faceIndex = event.target.dataset.diceFace;
    if (faceIndex === undefined) return;
    state.experimental.dice.faces[Number(faceIndex)] = event.target.value.trim() || "?";
    state.experimental.dice.results = [];
    $("#dice-last-result").textContent = "Dice changed; tally cleared.";
    renderDiceVisuals();
    $("#dice-tally").innerHTML = renderDiceTally();
  });
}

function init() {
  bindEvents();
  renderActivity();
  renderMode();
  renderCoin();
  renderPreset();
  renderCustom();
  renderDice();
}

init();
