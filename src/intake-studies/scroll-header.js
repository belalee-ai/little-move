import {clamp, mod, rest, retarget, springAt} from './motion.js';

export const scrollLimit = 644;
const topThreshold = 32;
const directionThreshold = 26;
const cycleSeconds = 8;
const settleSeconds = 1.5;

export const initialHeader = {anchor: 0, hidden: false};

// Remember the furthest point reached in the current state. Short reversals
// do not toggle the header, but several small scroll events can add up.
export function trackHeader(state, position) {
  if (position <= topThreshold) return initialHeader;
  if (state.hidden) {
    if (state.anchor - position >= directionThreshold) return {anchor: position, hidden: false};
    return {anchor: Math.max(state.anchor, position), hidden: true};
  }
  if (position - state.anchor >= directionThreshold) return {anchor: position, hidden: true};
  return {anchor: Math.min(state.anchor, position), hidden: false};
}

export function headerVisibility(command, frame, fps, period, speed, reduced = false) {
  if (reduced) return 1;
  if (mod(frame - command.frame, period) * speed / fps >= settleSeconds) return command.target;
  return clamp(springAt(command, frame, fps / speed, period).position);
}

const scrollLegs = [
  [.65, 2.25, 0, 540],
  [3, 4, 540, 255],
  [4.65, 5.55, 255, 610],
  [6, 7.35, 610, 0],
];

function scrollPosition(time) {
  let position = 0;
  for (const [start, end, from, to] of scrollLegs) {
    if (time < start) break;
    if (time < end) {
      const progress = (time - start) / (end - start);
      const eased = progress ** 3 * (10 + progress * (-15 + 6 * progress));
      return from + (to - from) * eased;
    }
    position = to;
  }
  return position;
}

// Sample the same direction tracker once on a fixed clock, so different
// export frame rates share the same reversal times and scroll positions.
const sampleRate = 120;
const sampleCount = cycleSeconds * sampleRate;
const headerCues = [rest(1)];
let tracking = initialHeader;
for (let frame = 1; frame < sampleCount; frame++) {
  const next = trackHeader(tracking, scrollPosition(frame / sampleRate));
  if (next.hidden !== tracking.hidden) {
    headerCues.push(retarget(headerCues.at(-1), next.hidden ? 0 : 1, frame, sampleRate, sampleCount));
  }
  tracking = next;
}

export function autoHeaderAt(time, reduced = false) {
  const local = mod(time, cycleSeconds);
  const frame = local * sampleRate;
  const command = headerCues.findLast(cue => cue.frame <= frame);
  return {
    position: scrollPosition(local),
    visibility: headerVisibility(command, frame, sampleRate, sampleCount, 1, reduced),
  };
}

export function settleHeader(command, frame, fps, period, speed) {
  if (command.from === command.target && command.velocity === 0) return command;
  if (mod(frame - command.frame, period) * speed / fps < settleSeconds) return command;
  return {...rest(command.target), frame};
}
