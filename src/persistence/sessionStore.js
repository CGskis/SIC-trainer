const FORMAT_VERSION = 1;

export function serializeSession(session) {
  return JSON.stringify({ formatVersion: FORMAT_VERSION, session });
}

export function deserializeSession(serialized) {
  const payload = JSON.parse(serialized);
  if (payload.formatVersion !== FORMAT_VERSION || !payload.session?.scenarioId || !Array.isArray(payload.session.events)) {
    throw new Error("Unsupported or invalid saved session.");
  }
  return payload.session;
}

export function createBrowserSessionStore(storage = globalThis.localStorage) {
  return {
    save(key, session) { storage.setItem(key, serializeSession(session)); },
    load(key) {
      const value = storage.getItem(key);
      return value === null ? null : deserializeSession(value);
    }
  };
}
