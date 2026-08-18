export function createInstructorSession() { return { paused: false, notes: [], injectedEvents: [] }; }
export function setInstructorPaused(session, paused) { return { ...session, paused }; }
export function addInstructorNote(session, text, at) { return { ...session, notes: [...session.notes, { type: "INSTRUCTOR_NOTE", text, at, source: "INSTRUCTOR" }] }; }
export function injectSyntheticEvent(scenario, session, eventId, at) {
  const definition = scenario.instructorInjectableEvents?.find((event) => event.id === eventId);
  if (!definition) throw new Error("This synthetic event is not approved for this scenario.");
  return { ...session, injectedEvents: [...session.injectedEvents, { type: "SYNTHETIC_EVENT_INJECTED", eventId, at, source: "INSTRUCTOR" }] };
}
