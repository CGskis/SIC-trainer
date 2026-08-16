export const syntheticScenario = {
  id: "synthetic-handoff-001",
  version: "1.0.0",
  title: "Synthetic Team Handoff",
  disclaimer: "This fictional exercise contains no real-world aircraft procedures.",
  initialState: "READY",
  states: {
    READY: {
      label: "Ready to start",
      availableActions: ["START"]
    },
    BRIEFING: {
      label: "Read the fictional exercise brief",
      availableActions: ["ACKNOWLEDGE_BRIEF"]
    },
    PANEL_REVIEW: {
      label: "Complete the placeholder panel review",
      availableActions: ["COMPLETE_PANEL_REVIEW"]
    },
    HANDOFF: {
      label: "Confirm the fictional team handoff",
      availableActions: ["CONFIRM_HANDOFF"]
    },
    COMPLETE: {
      label: "Scenario complete",
      availableActions: []
    }
  },
  transitions: {
    READY: {
      START: "BRIEFING"
    },
    BRIEFING: {
      ACKNOWLEDGE_BRIEF: "PANEL_REVIEW"
    },
    PANEL_REVIEW: {
      COMPLETE_PANEL_REVIEW: "HANDOFF"
    },
    HANDOFF: {
      CONFIRM_HANDOFF: "COMPLETE"
    }
  },
  actionLabels: {
    START: "Start scenario",
    ACKNOWLEDGE_BRIEF: "Acknowledge brief",
    COMPLETE_PANEL_REVIEW: "Complete placeholder review",
    CONFIRM_HANDOFF: "Confirm handoff"
  },
  scoring: {
    ACKNOWLEDGE_BRIEF: 35,
    COMPLETE_PANEL_REVIEW: 35,
    CONFIRM_HANDOFF: 30
  }
};
