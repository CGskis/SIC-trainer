import { syntheticScenario } from "/src/data/syntheticScenario.js";
import { createScenarioSession, dispatchAction, getAvailableActions } from "/src/engine/scenarioEngine.js";
import { scoreScenario } from "/src/scoring/scoreScenario.js";

let session = createScenarioSession(syntheticScenario);
const stateElement = document.querySelector("#state");
const actionsElement = document.querySelector("#actions");
const eventsElement = document.querySelector("#events");
const scoreElement = document.querySelector("#score");
const scoreItemsElement = document.querySelector("#score-items");
const errorElement = document.querySelector("#error");

function render() {
  const score = scoreScenario(syntheticScenario, session);
  stateElement.textContent = `${session.state} — ${syntheticScenario.states[session.state].label}`;
  actionsElement.replaceChildren(...getAvailableActions(syntheticScenario, session).map((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = syntheticScenario.actionLabels[action];
    button.addEventListener("click", () => {
      try { session = dispatchAction(syntheticScenario, session, action); errorElement.textContent = ""; }
      catch (error) { errorElement.textContent = error.message; }
      render();
    });
    return button;
  }));
  scoreElement.textContent = `${score.earned} / ${score.possible} points (${score.percentage}%)${score.complete ? " — complete" : ""}`;
  scoreItemsElement.replaceChildren(...score.items.map((item) => {
    const line = document.createElement("li");
    line.textContent = `${syntheticScenario.actionLabels[item.action]}: ${item.earned}/${item.points}`;
    return line;
  }));
  eventsElement.replaceChildren(...session.events.map((event) => {
    const line = document.createElement("li");
    line.textContent = `#${event.sequence} ${event.type} · ${event.action ?? event.state ?? ""}`;
    return line;
  }));
}

render();
