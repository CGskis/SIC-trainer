export class InvalidScenarioActionError extends Error {
  constructor(state, action) {
    super(`Action "${action}" is not available while in state "${state}".`);
    this.name = "InvalidScenarioActionError";
  }
}

function appendEvent(session, event, clock) {
  return [
    ...session.events,
    {
      sequence: session.events.length + 1,
      at: clock(),
      ...event
    }
  ];
}

export function createScenarioSession(scenario, { clock = () => new Date().toISOString() } = {}) {
  const session = {
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    state: scenario.initialState,
    events: []
  };

  return {
    ...session,
    events: appendEvent(session, { type: "SESSION_CREATED", state: session.state }, clock)
  };
}

export function getAvailableActions(scenario, session) {
  return scenario.states[session.state].availableActions;
}

export function dispatchAction(scenario, session, action, { clock = () => new Date().toISOString() } = {}) {
  const nextState = scenario.transitions[session.state]?.[action];

  if (!nextState) {
    const invalidEvents = appendEvent(
      session,
      { type: "INVALID_ACTION", state: session.state, action },
      clock
    );
    const error = new InvalidScenarioActionError(session.state, action);
    error.events = invalidEvents;
    throw error;
  }

  const transitioned = {
    ...session,
    state: nextState
  };

  return {
    ...transitioned,
    events: appendEvent(
      session,
      { type: "ACTION_COMPLETED", action, from: session.state, to: nextState },
      clock
    )
  };
}
