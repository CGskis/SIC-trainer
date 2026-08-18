export const GazeRegion = Object.freeze(["OUTSIDE_FORWARD", "LEFT_WINDOW", "RIGHT_WINDOW", "PRIMARY_INSTRUMENTS", "ENGINE_INSTRUMENTS", "RADIOS", "CHECKLIST", "SWITCH_PANEL", "LEFT_ENGINE", "RIGHT_ENGINE", "EFB", "OTHER"]);

export function createGazeSession() { return { activeRegion: null, events: [], firstLookAt: {}, totalDwellMs: {}, visits: {} }; }

export function recordGazeChange(session, region, at) {
  if (!GazeRegion.includes(region)) throw new Error("Unknown gaze region.");
  if (session.activeRegion === region) return session;
  const events = [...session.events];
  const totalDwellMs = { ...session.totalDwellMs };
  if (session.activeRegion) {
    const entered = [...events].reverse().find((event) => event.type === "GAZE_ENTER" && event.region === session.activeRegion);
    const dwellMs = Math.max(0, Date.parse(at) - Date.parse(entered.at));
    events.push({ type: "GAZE_EXIT", region: session.activeRegion, at, dwellMs, source: "SIMULATED_GAZE" });
    totalDwellMs[session.activeRegion] = (totalDwellMs[session.activeRegion] ?? 0) + dwellMs;
  }
  events.push({ type: "GAZE_ENTER", region, at, source: "SIMULATED_GAZE" });
  return { activeRegion: region, events, firstLookAt: { ...session.firstLookAt, [region]: session.firstLookAt[region] ?? at }, totalDwellMs, visits: { ...session.visits, [region]: (session.visits[region] ?? 0) + 1 } };
}
