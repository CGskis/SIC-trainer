import assert from "node:assert/strict";
import test from "node:test";
import { syntheticScenario } from "../src/data/syntheticScenario.js";
import { createScenarioSession, dispatchAction, InvalidScenarioActionError } from "../src/engine/scenarioEngine.js";
import { scoreScenario } from "../src/scoring/scoreScenario.js";

function deterministicClock() {
  let second = 0;
  return () => `2026-01-01T00:00:0${second++}.000Z`;
}

test("scenario follows its explicit state transitions to completion", () => {
  const clock = deterministicClock();
  let session = createScenarioSession(syntheticScenario, { clock });
  session = dispatchAction(syntheticScenario, session, "START", { clock });
  assert.equal(session.state, "BRIEFING");
  session = dispatchAction(syntheticScenario, session, "ACKNOWLEDGE_BRIEF", { clock });
  assert.equal(session.state, "PANEL_REVIEW");
  session = dispatchAction(syntheticScenario, session, "COMPLETE_PANEL_REVIEW", { clock });
  session = dispatchAction(syntheticScenario, session, "CONFIRM_HANDOFF", { clock });
  assert.equal(session.state, "COMPLETE");
});

test("invalid actions are rejected and captured in the error event payload", () => {
  const clock = deterministicClock();
  const session = createScenarioSession(syntheticScenario, { clock });
  assert.throws(() => dispatchAction(syntheticScenario, session, "CONFIRM_HANDOFF", { clock }), (error) => {
    assert.ok(error instanceof InvalidScenarioActionError);
    assert.equal(error.events.at(-1).type, "INVALID_ACTION");
    assert.equal(error.events.at(-1).action, "CONFIRM_HANDOFF");
    return true;
  });
});

test("event log has ordered, timestamped session and completed-action events", () => {
  const clock = deterministicClock();
  let session = createScenarioSession(syntheticScenario, { clock });
  session = dispatchAction(syntheticScenario, session, "START", { clock });
  assert.deepEqual(session.events, [
    { sequence: 1, at: "2026-01-01T00:00:00.000Z", type: "SESSION_CREATED", state: "READY" },
    { sequence: 2, at: "2026-01-01T00:00:01.000Z", type: "ACTION_COMPLETED", action: "START", from: "READY", to: "BRIEFING", source: "UI" }
  ]);
});

test("scoring is deterministic and rewards only completed defined actions", () => {
  const clock = deterministicClock();
  let session = createScenarioSession(syntheticScenario, { clock });
  session = dispatchAction(syntheticScenario, session, "START", { clock });
  session = dispatchAction(syntheticScenario, session, "ACKNOWLEDGE_BRIEF", { clock });
  const partial = scoreScenario(syntheticScenario, session);
  assert.deepEqual({ earned: partial.earned, possible: partial.possible, percentage: partial.percentage, complete: partial.complete }, { earned: 35, possible: 100, percentage: 35, complete: false });
  session = dispatchAction(syntheticScenario, session, "COMPLETE_PANEL_REVIEW", { clock });
  session = dispatchAction(syntheticScenario, session, "CONFIRM_HANDOFF", { clock });
  assert.equal(scoreScenario(syntheticScenario, session).earned, 100);
});
