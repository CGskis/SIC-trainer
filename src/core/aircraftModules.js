const required = ["id", "name", "category", "controls"];

export function defineAircraftModule(module) {
  for (const key of required) if (!module?.[key]) throw new Error(`Aircraft module requires ${key}.`);
  if (!Array.isArray(module.controls) || new Set(module.controls.map((control) => control.id)).size !== module.controls.length) {
    throw new Error("Aircraft module controls must have unique IDs.");
  }
  return Object.freeze({ ...module, controls: Object.freeze(module.controls.map((control) => Object.freeze({ ...control }))) });
}

export const syntheticA321StyleModule = defineAircraftModule({
  id: "synthetic-a321-style-test-panel",
  name: "Synthetic A321-style test panel",
  category: "SYNTHETIC_TEST_ONLY",
  disclaimer: "Development/test geometry only. It contains no real aircraft procedure data.",
  controls: [
    { id: "CONTROL_01", label: "Synthetic control 01", kind: "SWITCH", initialValue: "OFF" },
    { id: "ENCODER_02", label: "Synthetic encoder 02", kind: "ENCODER", initialValue: 0 },
    { id: "LEVER_01", label: "Synthetic lever 01", kind: "LEVER", initialValue: 0 }
  ]
});

export function createModuleRegistry(modules = [syntheticA321StyleModule]) {
  const byId = new Map(modules.map((module) => [module.id, defineAircraftModule(module)]));
  return Object.freeze({ list: () => [...byId.values()], get: (id) => byId.get(id) ?? null });
}
