const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export const TRAIL_LIFETIME = 1.35;
export const FIELD_COLUMNS = 24;
export const FIELD_ROWS = 14;
const mod = (n, d) => ((n % d) + d) % d;
export function toFieldPoint(p) {
  return {...p, x: clamp((p.x * 800 - 40) / 720, 0, 1), y: clamp((p.y * 500 - 40) / 420, 0, 1), vx: p.vx * 800 / 720, vy: p.vy * 500 / 420};
}
export function fieldPointerAt(t) {
  const u = clamp((t - .7) / 5.6, 0, 1);
  const phase = u * Math.PI * 2;
  const active = t > .7 && t < 6.3;
  return {x: .5 - .32 * Math.cos(phase), y: .5 + .23 * Math.sin(phase * 2), vx: active ? .32 * Math.sin(phase) * Math.PI * 2 / 5.6 : 0, vy: active ? .46 * Math.cos(phase * 2) * Math.PI * 2 / 5.6 : 0, active};
}
export function fieldSamples(t) {
  const samples = [];
  for (let i = 0; i < 81; i++) {
    const age = i / 60, at = t - age, pt = fieldPointerAt(at);
    if (pt.active) samples.push({...pt, age, weight: 1 / 60});
  }
  return samples;
}
export function liveFieldSamples(points, frame, fps, period) {
  return points.map(p => ({...p, age: mod(frame - p.frame, period) / fps}))
    .filter(p => p.age < TRAIL_LIFETIME);
}
export function fieldOffsets(samples, strength = 1, reduced = false) {
  const result = [];
  const gain = reduced ? 0 : clamp(Number.isFinite(strength) ? strength : 1, 0, 1.5);
  for (let row = 0; row < FIELD_ROWS; row++) for (let col = 0; col < FIELD_COLUMNS; col++) {
    const x = (col + .5) / FIELD_COLUMNS, y = (row + .5) / FIELD_ROWS;
    let dx = 0, dy = 0;
    for (const sample of samples) {
      if (sample.age < 0 || sample.age >= TRAIL_LIFETIME) continue;
      const distance = ((sample.x - x) ** 2 + ((sample.y - y) * .62) ** 2);
      if (distance > .13) continue;
      // Continuous release envelope reaches zero with zero slope at the tail.
      const remaining = 1 - sample.age / TRAIL_LIFETIME;
      const envelope = Math.exp(-sample.age * 4) * remaining * remaining;
      const weight = Math.exp(-distance / .024) * envelope * clamp(sample.weight ?? 1 / 60, 0, .05) * 5.2;
      dx += sample.vx * weight * 112;
      dy += sample.vy * weight * 112;
    }
    result.push({x: col * 30, y: row * 30, dx: clamp(dx * gain, -72, 72), dy: clamp(dy * gain, -72, 72)});
  }
  return result;
}
