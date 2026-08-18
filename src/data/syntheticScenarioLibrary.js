import { syntheticScenario } from "./syntheticScenario.js";
import { syntheticRecoveryScenario } from "./syntheticRecoveryScenario.js";

function syntheticExercise(id, title, theme) {
  return {
    id, version: "1.0.0", title, theme,
    disclaimer: "Synthetic test content only. This is not an aircraft procedure.",
    initialState: "READY",
    states: {
      READY: { label: "Ready", availableActions: ["START"] },
      OBSERVE: { label: `Observe ${theme}`, availableActions: ["ACKNOWLEDGE_SYNTHETIC_EVENT"] },
      RESPOND: { label: "Complete fictional response", availableActions: ["COMPLETE_SYNTHETIC_RESPONSE"] },
      COMPLETE: { label: "Complete", availableActions: [] }
    },
    transitions: { READY: { START: "OBSERVE" }, OBSERVE: { ACKNOWLEDGE_SYNTHETIC_EVENT: "RESPOND" }, RESPOND: { COMPLETE_SYNTHETIC_RESPONSE: "COMPLETE" } },
    actionLabels: { START: "Start scenario", ACKNOWLEDGE_SYNTHETIC_EVENT: "Acknowledge synthetic event", COMPLETE_SYNTHETIC_RESPONSE: "Complete synthetic response" },
    scoring: { ACKNOWLEDGE_SYNTHETIC_EVENT: 45, COMPLETE_SYNTHETIC_RESPONSE: 55 },
    randomization: { eventDelaySeconds: { min: 5, max: 20 } }
  };
}

export const syntheticScenarioLibrary = [
  syntheticScenario,
  syntheticRecoveryScenario,
  syntheticExercise("synthetic-monitoring-001", "Synthetic Monitoring", "a generic indication"),
  syntheticExercise("synthetic-panel-scan-001", "Synthetic Panel Scan", "a fictional panel pattern"),
  syntheticExercise("synthetic-communication-001", "Synthetic Communication", "a fictional communication cue"),
  syntheticExercise("synthetic-distraction-001", "Synthetic Distraction", "a distraction cue"),
  syntheticExercise("synthetic-selection-001", "Synthetic Control Selection", "a control-selection cue"),
  syntheticExercise("synthetic-phase-change-001", "Synthetic Phase Change", "a phase transition"),
  syntheticExercise("synthetic-indications-001", "Synthetic Multiple Indications", "multiple fictional indications"),
  { ...syntheticExercise("synthetic-instructor-001", "Synthetic Instructor Event", "an instructor-injected cue"), instructorInjectableEvents: [{ id: "SYNTHETIC_CUE", label: "Inject synthetic cue" }] }
];
