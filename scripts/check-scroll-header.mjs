import assert from 'node:assert/strict';
import {demoById, demoDefaults, demoFrames} from '../src/demos/catalog.js';
import {rest, retarget, springAt} from '../src/intake-studies/motion.js';
import {
  autoHeaderAt, headerVisibility, initialHeader, scrollLimit, settleHeader, trackHeader,
} from '../src/intake-studies/scroll-header.js';

const id = 'demo-scroll-header';
assert.equal(demoById(id).code, '295');
assert.equal(demoById(id).trigger, '滚动');
assert.equal(demoDefaults(id).images.length, 0);

let state = initialHeader;
for (const position of [12, 30, 33, 200, 194, 185]) state = trackHeader(state, position);
assert.equal(state.hidden, true, 'small reversal keeps header hidden');
state = trackHeader(state, 172);
assert.equal(state.hidden, false, 'accumulated reverse travel reveals header away from the top');
for (const position of [140, 146, 151]) state = trackHeader(state, position);
assert.equal(state.hidden, false, 'small downward reversals stay visible');
state = trackHeader(state, 170);
assert.equal(state.hidden, true, 'deliberate downward scroll hides header again');
assert.deepEqual(trackHeader(state, 0), initialHeader);

for (const fps of [25, 30, 60]) {
  for (const speed of [.5, 1, 2]) {
    const period = demoFrames({...demoDefaults(id), speed}, fps);
    const frames = Array.from({length:period}, (_, frame) => autoHeaderAt(frame / fps * speed));
    assert.deepEqual(frames[0], frames.at(-1), 'loop seam');
    assert(frames.every(({position,visibility}) => position >= 0 && position <= scrollLimit && visibility >= 0 && visibility <= 1));
    assert(frames.some(({position,visibility}) => position >= 500 && visibility < .02), 'header hides during downscroll');
    assert(frames.some(({position,visibility}, i) => i / fps * speed > 4 && position > 230 && visibility > .95), 'header returns before top');
    assert(frames.some(({visibility}) => visibility > .3 && visibility < .7), 'visible intermediate motion');

    const hide = retarget(rest(1), 0, period - 2, fps / speed, period);
    const reveal = retarget(hide, 1, 2, fps / speed, period);
    const atReversal = springAt(hide, 2, fps / speed, period);
    assert.deepEqual({position:reveal.from, velocity:reveal.velocity}, atReversal);
    const settled = settleHeader(reveal, Math.ceil(2 + 1.5 * fps / speed), fps, period, speed);
    assert.equal(settled.from, 1);
    assert.equal(settled.velocity, 0);
    assert.equal(headerVisibility(hide, 2, fps, period, speed, true), 1);
    assert.equal(autoHeaderAt(2.5, true).visibility, 1);
  }
}

console.log('PASS 295: accumulated direction threshold, reveal before top, bounded motion, interruption velocity, clock wrap and reduced motion.');
