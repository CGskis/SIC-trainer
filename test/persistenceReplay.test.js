import assert from "node:assert/strict";
import test from "node:test";
import { syntheticRecoveryScenario } from "../src/data/syntheticRecoveryScenario.js";
import { createScenarioSession, dispatchAction } from "../src/engine/scenarioEngine.js";
import { deserializeSession, serializeSession } from "../src/persistence/sessionStore.js";
import { replaySession } from "../src/persistence/replaySession.js";
import { scoreScenario } from "../src/scoring/scoreScenario.js";

function clock() { let tick = 0; return () => `2026-01-02T00:00:0${tick++}.000Z`; }

test("recovery path explicitly records a fictional incorrect choice before recovery", () => {
  const now = clock();
  let session = createScenarioSession(syntheticRecoveryScenario, { clock: now });
  for (const action of ["START", "CHOOSE_RECOVERY_PATH", "ACKNOWLEDGE_MISSTEP", "COMPLETE_RECOVERY", "CONFIRM_HANDOFF"]) {
    session = dispatchAction(syntheticRecoveryScenario, session, action, { clock: now });
  }
  assert.equal(session.state, "COMPLETE");
  assert.deepEqual(session.events.map((event) => event.to).filter(Boolean), ["BRIEFING", "INCORRECT_ACTION", "RECOVERY", "HANDOFF", "COMPLETE"]);
});

test("a saved and loaded session deterministically replays to the same state, event log, and score", () => {
  const now = clock();
  let session = createScenarioSession(syntheticRecoveryScenario, { clock: now });
  for (const action of ["START", "CHOOSE_RECOVERY_PATH", "ACKNOWLEDGE_MISSTEP", "COMPLETE_RECOVERY", "CONFIRM_HANDOFF"]) {
    session = dispatchAction(syntheticRecoveryScenario, session, action, { clock: now });
  }
  const loaded = deserializeSession(serializeSession(session));
  const replayed = replaySession(syntheticRecoveryScenario, loaded);
  assert.deepEqual(replayed, session);
  assert.deepEqual(scoreScenario(syntheticRecoveryScenario, replayed), scoreScenario(syntheticRecoveryScenario, session));
});
