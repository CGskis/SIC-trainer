export const InputSource = Object.freeze({ UI: "UI", ESP32: "ESP32", KEYBOARD: "KEYBOARD", REPLAY: "REPLAY", INSTRUCTOR: "INSTRUCTOR" });

export function createControlChangedEvent({ controlId, moduleId, previousValue, newValue, timestamp, source }) {
  if (!controlId || !moduleId || !timestamp || !Object.values(InputSource).includes(source)) throw new Error("Invalid CONTROL_CHANGED event.");
  return Object.freeze({ type: "CONTROL_CHANGED", controlId, moduleId, previousValue, newValue, timestamp, source });
}

// Physical input is logged here; only the scenario engine can change scenario state.
export function createHardwareEventReceiver(receive) {
  return { receive(event) { if (event?.type !== "CONTROL_CHANGED") throw new Error("Unsupported hardware event."); return receive(event); } };
}
