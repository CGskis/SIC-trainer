export function hashSeed(seed) {
  let value = 2166136261;
  for (const character of String(seed)) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  return value >>> 0;
}

export function createSeededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function resolveSeededRanges(seed, ranges = {}) {
  const random = createSeededRandom(seed);
  return Object.fromEntries(Object.entries(ranges).map(([key, range]) => {
    const minimum = range.min ?? 0;
    const maximum = range.max ?? minimum;
    return [key, minimum + Math.floor(random() * (maximum - minimum + 1))];
  }));
}
