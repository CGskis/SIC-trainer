import { InputSource } from "./hardwareInterface.js";

export function createHardwareState(module) {
  return { moduleId: module.id, controls: Object.fromEntries(module.controls.map((control) => [control.id, control.initialValue])), events: [] };
}

export function applyControlChanged(state, event) {
  if (event.type !== "CONTROL_CHANGED") throw new Error("Expected CONTROL_CHANGED event.");
  if (event.moduleId !== state.moduleId) throw new Error("Hardware event module does not match active module.");
  if (!Object.hasOwn(state.controls, event.controlId)) throw new Error("Unknown control ID.");
  return { ...state, controls: { ...state.controls, [event.controlId]: event.newValue }, events: [...state.events, event] };
}

export function findPhysicalMismatches(state, requiredPositions = {}) {
  return Object.entries(requiredPositions).filter(([controlId, expectedValue]) => state.controls[controlId] !== expectedValue)
    .map(([controlId, expectedValue]) => ({ controlId, expectedValue, actualValue: state.controls[controlId] }));
}

export function isHardwareReady(state, requiredPositions) { return findPhysicalMismatches(state, requiredPositions).length === 0; }

export { InputSource };
