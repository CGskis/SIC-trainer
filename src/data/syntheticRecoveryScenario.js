export const syntheticRecoveryScenario = {
  id: "synthetic-recovery-001",
  version: "1.0.0",
  title: "Synthetic Recovery Path",
  disclaimer: "This fictional exercise contains no real-world aircraft procedures.",
  initialState: "READY",
  states: {
    READY: { label: "Ready to start", availableActions: ["START"] },
    BRIEFING: { label: "Choose a fictional review path", availableActions: ["CHOOSE_STANDARD_PATH", "CHOOSE_RECOVERY_PATH"] },
    STANDARD_REVIEW: { label: "Complete the standard placeholder review", availableActions: ["COMPLETE_STANDARD_REVIEW"] },
    INCORRECT_ACTION: { label: "Fictional incorrect choice detected", availableActions: ["ACKNOWLEDGE_MISSTEP"] },
    RECOVERY: { label: "Complete the fictional recovery review", availableActions: ["COMPLETE_RECOVERY"] },
    HANDOFF: { label: "Confirm the fictional team handoff", availableActions: ["CONFIRM_HANDOFF"] },
    COMPLETE: { label: "Scenario complete", availableActions: [] }
  },
  transitions: {
    READY: { START: "BRIEFING" },
    BRIEFING: { CHOOSE_STANDARD_PATH: "STANDARD_REVIEW", CHOOSE_RECOVERY_PATH: "INCORRECT_ACTION" },
    STANDARD_REVIEW: { COMPLETE_STANDARD_REVIEW: "HANDOFF" },
    INCORRECT_ACTION: { ACKNOWLEDGE_MISSTEP: "RECOVERY" },
    RECOVERY: { COMPLETE_RECOVERY: "HANDOFF" },
    HANDOFF: { CONFIRM_HANDOFF: "COMPLETE" }
  },
  actionLabels: {
    START: "Start scenario",
    CHOOSE_STANDARD_PATH: "Choose standard path",
    CHOOSE_RECOVERY_PATH: "Choose fictional incorrect path",
    COMPLETE_STANDARD_REVIEW: "Complete placeholder review",
    ACKNOWLEDGE_MISSTEP: "Acknowledge fictional misstep",
    COMPLETE_RECOVERY: "Complete recovery review",
    CONFIRM_HANDOFF: "Confirm handoff"
  },
  scoring: {
    ACKNOWLEDGE_MISSTEP: 25,
    COMPLETE_RECOVERY: 45,
    CONFIRM_HANDOFF: 30
  }
};
