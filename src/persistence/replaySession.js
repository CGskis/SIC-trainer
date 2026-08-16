import { createScenarioSession, dispatchAction } from "../engine/scenarioEngine.js";

export function replaySession(scenario, savedSession) {
  const [created, ...events] = savedSession.events;
  if (created?.type !== "SESSION_CREATED" || created.state !== scenario.initialState) {
    throw new Error("Saved event log does not match this scenario.");
  }

  let replayed = createScenarioSession(scenario, { clock: () => created.at });
  for (const event of events) {
    if (event.type !== "ACTION_COMPLETED") continue;
    replayed = dispatchAction(scenario, replayed, event.action, { clock: () => event.at, source: event.source ?? "REPLAY" });
    const actual = replayed.events.at(-1);
    if (actual.from !== event.from || actual.to !== event.to) {
      throw new Error("Saved event log contains an invalid transition.");
    }
  }
  return replayed;
}
