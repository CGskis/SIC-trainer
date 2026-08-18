export function createHardwareSelfTest(module) {
  return { moduleId: module.id, stepIndex: 0, steps: module.controls.map((control) => ({ controlId: control.id, instruction: instructionFor(control.kind), complete: false })) };
}

function instructionFor(kind) {
  return kind === "ENCODER" ? "Rotate" : kind === "LEVER" ? "Move" : "Flip";
}

export function verifySelfTestEvent(test, event) {
  const expected = test.steps[test.stepIndex];
  if (!expected || event.type !== "CONTROL_CHANGED" || event.controlId !== expected.controlId) return test;
  const steps = test.steps.map((step, index) => index === test.stepIndex ? { ...step, complete: true } : step);
  return { ...test, steps, stepIndex: test.stepIndex + 1 };
}

export function isSelfTestComplete(test) { return test.stepIndex >= test.steps.length; }
