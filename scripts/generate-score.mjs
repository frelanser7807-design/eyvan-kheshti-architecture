import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public', 'assets', 'film', 'site-cinematic-score-v3.wav');
const sampleRate = 32000;
const duration = 48;
const frameCount = sampleRate * duration;
const left = new Float32Array(frameCount);
const right = new Float32Array(frameCount);
const tau = Math.PI * 2;
const beat = 60 / 132;
const bar = beat * 4;

// Original 132 BPM architectural pulse: dark analogue harmony, clipped electronic keys
// and a precise low-end pulse. It follows the reference's pace and energy without
// reproducing its melody, recording or identifiable musical phrase.
// There is no continuous noise layer, so it cannot read as wind or room hiss.
const progression = [
  [55.00, 82.41, 110.00, 130.81, 164.81],
  [43.65, 65.41, 87.31, 110.00, 130.81],
  [65.41, 98.00, 130.81, 164.81, 196.00],
  [49.00, 73.42, 98.00, 123.47, 146.83],
  [55.00, 82.41, 110.00, 130.81, 164.81],
  [43.65, 65.41, 87.31, 110.00, 130.81],
  [65.41, 98.00, 130.81, 164.81, 196.00],
  [49.00, 73.42, 98.00, 123.47, 146.83],
  [55.00, 82.41, 110.00, 130.81, 164.81],
  [43.65, 65.41, 87.31, 110.00, 130.81],
  [65.41, 98.00, 130.81, 164.81, 196.00],
  [49.00, 73.42, 98.00, 123.47, 146.83],
  [55.00, 82.41, 110.00, 130.81, 164.81],
  [43.65, 65.41, 87.31, 110.00, 130.81],
  [49.00, 73.42, 98.00, 123.47, 146.83],
  [55.00, 82.41, 110.00, 130.81, 164.81],
  [55.00, 82.41, 110.00, 130.81, 164.81],
  [43.65, 65.41, 87.31, 110.00, 130.81],
  [65.41, 98.00, 130.81, 164.81, 196.00],
  [49.00, 73.42, 98.00, 123.47, 146.83],
  [55.00, 82.41, 110.00, 130.81, 164.81],
  [43.65, 65.41, 87.31, 110.00, 130.81],
  [49.00, 73.42, 98.00, 123.47, 146.83],
  [55.00, 82.41, 110.00, 130.81, 164.81],
];

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smooth(value) {
  const x = clamp01(value);
  return x * x * (3 - (2 * x));
}

function tone(frequency, time, phase = 0) {
  const fundamental = Math.sin((tau * frequency * time) + phase);
  const second = Math.sin((tau * frequency * 2.002 * time) + phase + 0.24);
  const third = Math.sin((tau * frequency * 3.004 * time) + phase + 0.62);
  return fundamental + (second * 0.21) + (third * 0.07);
}

function pluck(frequency, age, phase = 0) {
  if (age < 0 || age > 0.88) return 0;
  const attack = smooth(age / 0.018);
  const envelope = attack * Math.exp(-4.9 * age);
  return envelope * (
    Math.sin((tau * frequency * age) + phase)
    + (0.42 * Math.sin((tau * frequency * 2.01 * age) + 0.3 + phase))
    + (0.13 * Math.sin((tau * frequency * 3.98 * age) + 0.65 + phase))
  );
}

for (let frame = 0; frame < frameCount; frame += 1) {
  const time = frame / sampleRate;
  const barIndex = Math.min(progression.length - 1, Math.floor(time / bar));
  const chord = progression[barIndex];
  const localBar = time - (barIndex * bar);
  const nextChord = progression[Math.min(progression.length - 1, barIndex + 1)];
  const crossfade = localBar > bar - 0.6 ? smooth((localBar - (bar - 0.6)) / 0.6) : 0;

  let stringsL = 0;
  let stringsR = 0;
  for (let voice = 0; voice < chord.length; voice += 1) {
    const weight = 1 / (1.3 + (voice * 0.72));
    const currentL = tone(chord[voice] * 0.9992, time, voice * 0.19) * weight;
    const currentR = tone(chord[voice] * 1.0008, time, 0.12 + (voice * 0.17)) * weight;
    const nextL = tone(nextChord[voice] * 0.999, time, voice * 0.17) * weight;
    const nextR = tone(nextChord[voice] * 1.001, time, 0.1 + (voice * 0.21)) * weight;
    stringsL += (currentL * (1 - crossfade)) + (nextL * crossfade);
    stringsR += (currentR * (1 - crossfade)) + (nextR * crossfade);
  }
  const stringBreath = 0.76 + (0.24 * Math.sin(tau * time / 4.4));

  let keysL = 0;
  let keysR = 0;
  for (let step = 0; step < 8; step += 1) {
    const noteAge = localBar - (step * beat / 2);
    const noteIndex = [2, 4, 3, 4, 1, 3, 4, 2][step];
    const frequency = chord[noteIndex] * (step === 3 || step === 6 ? 2 : 1);
    keysL += pluck(frequency, noteAge, step * 0.05);
    keysR += pluck(frequency * 1.001, noteAge - 0.012, 0.14 + (step * 0.05));
  }

  const bassAge = localBar % beat;
  const bassEnvelope = smooth(bassAge / 0.035) * Math.exp(-1.15 * bassAge);
  const bass = bassEnvelope * tone(chord[0], bassAge, 0.1);

  const pulseAge = localBar % beat;
  const pulseEnvelope = smooth(pulseAge / 0.008) * Math.exp(-13 * pulseAge);
  const pulse = pulseEnvelope * Math.sin(tau * (88 - (48 * clamp01(pulseAge / 0.14))) * pulseAge);

  const motifStart = (barIndex % 4 === 3) ? (bar - (beat * 1.25)) : 99;
  const motifAge = localBar - motifStart;
  const motif = pluck(chord[4] * 2, motifAge, 0.35) + (0.42 * pluck(chord[2] * 2, motifAge - (beat / 2), 0.55));

  const intro = smooth(time / 1.8);
  const outro = 1 - smooth((time - (duration - 1.8)) / 1.8);
  const master = intro * outro;
  const energy = 0.72 + (0.28 * smooth((time - 4) / 5));
  left[frame] = master * energy * ((stringsL * 0.038 * stringBreath) + (keysL * 0.1) + (bass * 0.13) + (pulse * 0.165) + (motif * 0.055));
  right[frame] = master * energy * ((stringsR * 0.038 * stringBreath) + (keysR * 0.1) + (bass * 0.125) + (pulse * 0.16) + (motif * 0.06));
}

const dryLeft = left.slice();
const dryRight = right.slice();
for (const [seconds, reflectionGain] of [[0.16, 0.17], [0.31, 0.11], [0.49, 0.065]]) {
  const delay = Math.floor(seconds * sampleRate);
  for (let frame = delay; frame < frameCount; frame += 1) {
    left[frame] += dryRight[frame - delay] * reflectionGain;
    right[frame] += dryLeft[frame - delay] * reflectionGain;
  }
}

let peak = 0;
let squareSum = 0;
for (let frame = 0; frame < frameCount; frame += 1) {
  peak = Math.max(peak, Math.abs(left[frame]), Math.abs(right[frame]));
  squareSum += ((left[frame] ** 2) + (right[frame] ** 2)) / 2;
}
const gain = peak ? 0.78 / peak : 1;
const rms = Math.sqrt(squareSum / frameCount) * gain;
const dataSize = frameCount * 4;
const buffer = Buffer.alloc(44 + dataSize);
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

for (let frame = 0; frame < frameCount; frame += 1) {
  buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(left[frame] * gain * 32767))), 44 + (frame * 4));
  buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(right[frame] * gain * 32767))), 46 + (frame * 4));
}

fs.writeFileSync(output, buffer);
console.log(`Created ${output}`);
console.log(`Original reference-inspired score · ${duration}s · 132 BPM · ${sampleRate}Hz stereo · peak -2.2 dBFS · RMS ${(20 * Math.log10(rms)).toFixed(1)} dBFS`);
