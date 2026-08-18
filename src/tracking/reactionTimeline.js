export function calculateReactionTimeline(events) {
  const byType = (type) => events.find((event) => event.type === type)?.at ?? null;
  const occurred = byType("EVENT_OCCURRED"), gaze = byType("GAZE_ENTER"), acknowledgement = byType("VERBAL_ACKNOWLEDGEMENT"), action = byType("FIRST_CONTROL_ACTION"), correct = byType("CORRECT_RESPONSE");
  const delta = (from, to) => from && to ? Date.parse(to) - Date.parse(from) : null;
  return { eventOccurredAt: occurred, firstGazeAt: gaze, verbalAcknowledgementAt: acknowledgement, firstControlActionAt: action, correctResponseAt: correct, eventToGazeMs: delta(occurred, gaze), gazeToAcknowledgementMs: delta(gaze, acknowledgement), acknowledgementToActionMs: delta(acknowledgement, action), totalResponseMs: delta(occurred, correct) };
}
