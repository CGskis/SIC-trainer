import { syntheticScenario } from "/src/data/syntheticScenario.js";
import { syntheticRecoveryScenario } from "/src/data/syntheticRecoveryScenario.js";
import { createScenarioSession, dispatchAction, getAvailableActions } from "/src/engine/scenarioEngine.js";
import { createBrowserSessionStore } from "/src/persistence/sessionStore.js";
import { replaySession } from "/src/persistence/replaySession.js";
import { scoreScenario } from "/src/scoring/scoreScenario.js";

const scenarios = [syntheticScenario, syntheticRecoveryScenario];
const sessionStore = createBrowserSessionStore();
let scenario = syntheticScenario;
let session = createScenarioSession(scenario);
const scenarioSelect = document.querySelector("#scenario-select");
const saveSessionButton = document.querySelector("#save-session");
const replaySessionButton = document.querySelector("#replay-session");
const stateElement = document.querySelector("#state");
const actionsElement = document.querySelector("#actions");
const eventsElement = document.querySelector("#events");
const scoreElement = document.querySelector("#score");
const scoreItemsElement = document.querySelector("#score-items");
const errorElement = document.querySelector("#error");

for (const item of scenarios) {
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = item.title;
  scenarioSelect.append(option);
}

scenarioSelect.addEventListener("change", () => {
  scenario = scenarios.find((item) => item.id === scenarioSelect.value);
  session = createScenarioSession(scenario);
  errorElement.textContent = "";
  render();
});

saveSessionButton.addEventListener("click", () => {
  sessionStore.save(`sic-trainer:${scenario.id}`, session);
  errorElement.textContent = "Session saved locally.";
});

replaySessionButton.addEventListener("click", () => {
  const savedSession = sessionStore.load(`sic-trainer:${scenario.id}`);
  if (savedSession === null) { errorElement.textContent = "No saved session for this scenario."; return; }
  session = replaySession(scenario, savedSession);
  errorElement.textContent = "Saved event log replayed.";
  render();
});

function render() {
  const score = scoreScenario(scenario, session);
  document.querySelector("h1").textContent = scenario.title;
  stateElement.textContent = `${session.state} — ${scenario.states[session.state].label}`;
  actionsElement.replaceChildren(...getAvailableActions(scenario, session).map((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = scenario.actionLabels[action];
    button.addEventListener("click", () => {
      try { session = dispatchAction(scenario, session, action); errorElement.textContent = ""; }
      catch (error) { errorElement.textContent = error.message; }
      render();
    });
    return button;
  }));
  scoreElement.textContent = `${score.earned} / ${score.possible} points (${score.percentage}%)${score.complete ? " — complete" : ""}`;
  scoreItemsElement.replaceChildren(...score.items.map((item) => {
    const line = document.createElement("li");
    line.textContent = `${scenario.actionLabels[item.action]}: ${item.earned}/${item.points}`;
    return line;
  }));
  eventsElement.replaceChildren(...session.events.map((event) => {
    const line = document.createElement("li");
    line.textContent = `#${event.sequence} ${event.type} · ${event.action ?? event.state ?? ""}`;
    return line;
  }));
}

render();
