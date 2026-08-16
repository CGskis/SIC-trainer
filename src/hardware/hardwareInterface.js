export const InputSource = Object.freeze({ UI: "UI", KEYBOARD: "KEYBOARD", HARDWARE: "HARDWARE", AI: "AI", REPLAY: "REPLAY", SYSTEM: "SYSTEM" });

export function createHardwareActionAdapter(dispatch) {
  return {
    receive(event) {
      if (!event?.type || !event?.action) throw new Error("Hardware event requires a type and mapped action.");
      return dispatch(event.action, InputSource.HARDWARE);
    }
  };
}
