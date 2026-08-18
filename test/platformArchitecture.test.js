import assert from "node:assert/strict";
import test from "node:test";
import { syntheticA321StyleModule, createModuleRegistry } from "../src/core/aircraftModules.js";
import { createSeededRandom, resolveSeededRanges } from "../src/core/seededRandom.js";
import { createControlChangedEvent } from "../src/hardware/hardwareInterface.js";
import { createHardwareState, applyControlChanged, findPhysicalMismatches } from "../src/hardware/hardwareState.js";
import { createHardwareSelfTest, verifySelfTestEvent, isSelfTestComplete } from "../src/hardware/selfTest.js";
import { createGazeSession, recordGazeChange } from "../src/tracking/gaze.js";
import { calculateReactionTimeline } from "../src/tracking/reactionTimeline.js";
import { createInstructorSession, injectSyntheticEvent } from "../src/instructor/instructorController.js";
import { syntheticScenarioLibrary } from "../src/data/syntheticScenarioLibrary.js";

test("aircraft modules are replaceable and synthetic library has ten scenarios", () => {
  const registry = createModuleRegistry();
  assert.equal(registry.get(syntheticA321StyleModule.id).controls.length, 3);
  assert.equal(syntheticScenarioLibrary.length, 10);
  assert.ok(syntheticScenarioLibrary.every((scenario) => scenario.disclaimer.includes("Synthetic") || scenario.disclaimer.includes("fictional")));
});

test("seeded randomization is repeatable", () => {
  assert.deepEqual([createSeededRandom("same")(), createSeededRandom("same")()], [createSeededRandom("same")(), createSeededRandom("same")()]);
  assert.deepEqual(resolveSeededRanges("run-1", { delay: { min: 2, max: 8 } }), resolveSeededRanges("run-1", { delay: { min: 2, max: 8 } }));
});

test("hardware input changes physical state but not scenario state", () => {
  let state = createHardwareState(syntheticA321StyleModule);
  const event = createControlChangedEvent({ controlId: "CONTROL_01", moduleId: state.moduleId, previousValue: "OFF", newValue: "ON", timestamp: "2026-01-01T00:00:00.000Z", source: "ESP32" });
  state = applyControlChanged(state, event);
  assert.equal(state.controls.CONTROL_01, "ON");
  assert.deepEqual(findPhysicalMismatches(state, { CONTROL_01: "OFF" }), [{ controlId: "CONTROL_01", expectedValue: "OFF", actualValue: "ON" }]);
});

test("self-test only advances for its expected physical event", () => {
  let selfTest = createHardwareSelfTest(syntheticA321StyleModule);
  selfTest = verifySelfTestEvent(selfTest, { type: "CONTROL_CHANGED", controlId: "ENCODER_02" });
  assert.equal(selfTest.stepIndex, 0);
  for (const controlId of ["CONTROL_01", "ENCODER_02", "LEVER_01"]) selfTest = verifySelfTestEvent(selfTest, { type: "CONTROL_CHANGED", controlId });
  assert.ok(isSelfTestComplete(selfTest));
});

test("simulated gaze logs transitions and reaction timing stays descriptive", () => {
  let gaze = createGazeSession();
  gaze = recordGazeChange(gaze, "OUTSIDE_FORWARD", "2026-01-01T00:00:00.000Z");
  gaze = recordGazeChange(gaze, "PRIMARY_INSTRUMENTS", "2026-01-01T00:00:02.000Z");
  assert.equal(gaze.totalDwellMs.OUTSIDE_FORWARD, 2000);
  const timeline = calculateReactionTimeline([{ type: "EVENT_OCCURRED", at: "2026-01-01T00:00:00.000Z" }, { type: "GAZE_ENTER", at: "2026-01-01T00:00:01.000Z" }, { type: "CORRECT_RESPONSE", at: "2026-01-01T00:00:05.000Z" }]);
  assert.equal(timeline.eventToGazeMs, 1000); assert.equal(timeline.totalResponseMs, 5000);
});

test("instructor can inject only declared synthetic events", () => {
  const scenario = syntheticScenarioLibrary.find((item) => item.id === "synthetic-instructor-001");
  const updated = injectSyntheticEvent(scenario, createInstructorSession(), "SYNTHETIC_CUE", "2026-01-01T00:00:00.000Z");
  assert.equal(updated.injectedEvents.length, 1);
  assert.throws(() => injectSyntheticEvent(scenario, updated, "NOT_ALLOWED", "2026-01-01T00:00:00.000Z"));
});
