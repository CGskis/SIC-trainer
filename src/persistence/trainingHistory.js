const SCHEMA_VERSION = 1;
const HISTORY_KEY = "sic-trainer:history";
export function createSessionRecord({ session, scenario, applicationVersion, startedAt, endedAt, randomSeed = null }) {
  return { schemaVersion: SCHEMA_VERSION, sessionId: crypto.randomUUID(), applicationVersion, scenarioId: scenario.id, scenarioVersion: scenario.version, randomSeed, inputEvents: session.events, finalState: session.state, finalScore: null, durationMs: new Date(endedAt).getTime() - new Date(startedAt).getTime(), errors: session.events.filter((event) => event.type === "INVALID_ACTION") };
}
export function createTrainingHistoryStore(storage = globalThis.localStorage) {
  return { list: () => JSON.parse(storage.getItem(HISTORY_KEY) ?? "[]"), add(record) { const records = this.list(); storage.setItem(HISTORY_KEY, JSON.stringify([record, ...records])); return record; } };
}
