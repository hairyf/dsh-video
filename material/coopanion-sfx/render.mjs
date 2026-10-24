// SPDX-License-Identifier: AGPL-3.0-or-later
// Run with ego-browser nodejs -e "await import('file:///E:/projects/dsh-video/material/coopanion-sfx/render.mjs')"
const { default: assert } = await import('node:assert/strict');
const { readFile, writeFile } = await import('node:fs/promises');
const { createHash } = await import('node:crypto');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const source = await readFile(new URL('./sound.js', import.meta.url), 'utf8');
assert.equal(hash(source), 'b09c754008dd79509711aba1a5b6e052e1ab39962445aba0e43118f8d54edac3');
assert.equal(hash(await readFile(new URL('./LICENSE', import.meta.url))), '8d56b405468aad11f87ab5763f901e276e08d9646ff5c8481b1762b6b789e9ed');
const names = ['tick', 'pop', 'select', 'grab', 'squeak', 'poke', 'jump', 'land', 'sparkle', 'happy'];
const sampleRate = 48000, tailSamples = 1440, seed = 0x434f4f50;
const task = await taskSpace(11);
console.log({ existingTabs: (await task.tabs()).map(({ label, url, active }) => ({ label, url, active })) });
const page = await task.newPage();
console.log({ spaceId: task.spaceId, page: page.label });
const metrics = [];
try {
  assert.equal(await page.url(), 'about:blank');
  assert((await task.tabs()).find((tab) => tab.label === page.label)?.active, 'The render Page must be active');
  const browser = await page.evaluate(() => ({ userAgent: navigator.userAgent, hidden: document.hidden }));
  assert.equal(browser.hidden, false, 'Do not bypass the source visibility guard');
  console.log({ ...browser, sampleRate, channels: 1, bits: 16, seed, volume: 0.55, tailSamples });
  for (const name of names) {
    const { samples, repeatMaxFloatDelta } = await page.evaluate(async ({ source, name, sampleRate, seed, tailSamples }) => {
      if (document.hidden) throw new Error('Render Page became hidden');
      const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      const originalContext = window.AudioContext, originalRandom = Math.random;
      const quantize = (x) => Math.round(x * (x < 0 ? 32768 : 32767));
      try {
        const { createSfx } = await import(url);
        let reference, repeatMaxFloatDelta = 0;
        for (let pass = 0; pass < 2; pass++) {
          let state = seed;
          Math.random = () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
          // ponytail: 2s ceiling for these <=0.4s sounds; raise it for longer source sounds.
          const ctx = new OfflineAudioContext(1, sampleRate * 2, sampleRate);
          ctx.resume = () => Promise.resolve(); // Offline starts suspended; only startRendering starts it.
          window.AudioContext = function () { return ctx; };
          let compressors = 0;
          const nativeCompressor = ctx.createDynamicsCompressor.bind(ctx);
          ctx.createDynamicsCompressor = () => { compressors++; return nativeCompressor(); };
          const sfx = createSfx({ volume: 0.55 });
          sfx.unlock();
          sfx.play(name); // No extra args: land is the original soft landing.
          if (compressors !== 1) throw new Error('Expected the original native compressor');
          const rendered = (await ctx.startRendering()).getChannelData(0);
          if (reference) {
            // Native multi-voice mixing can round differently below one PCM step; require exact output PCM.
            for (let i = 0; i < rendered.length; i++) {
              repeatMaxFloatDelta = Math.max(repeatMaxFloatDelta, Math.abs(rendered[i] - reference[i]));
              if (quantize(rendered[i]) !== quantize(reference[i])) throw new Error(`${name}: PCM is not deterministic`);
            }
          } else reference = rendered;
        }
        let end = reference.length;
        while (end && quantize(reference[end - 1]) === 0) end--;
        if (!end || end + tailSamples >= reference.length) throw new Error(`${name}: silent or render window too short`);
        return { samples: Array.from(reference.subarray(0, end + tailSamples)), repeatMaxFloatDelta };
      } finally {
        window.AudioContext = originalContext;
        Math.random = originalRandom;
        URL.revokeObjectURL(url);
      }
    }, { source, name, sampleRate, seed, tailSamples });

    const wav = Buffer.alloc(44 + samples.length * 2);
    wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
    wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(sampleRate, 24); wav.writeUInt32LE(sampleRate * 2, 28);
    wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
    wav.write('data', 36); wav.writeUInt32LE(samples.length * 2, 40);
    let peak = 0, floatPeak = 0, energy = 0;
    for (let i = 0; i < samples.length; i++) {
      const value = samples[i];
      assert(Number.isFinite(value) && Math.abs(value) < 1, `${name}: invalid or clipping sample`);
      floatPeak = Math.max(floatPeak, Math.abs(value));
      const pcm = Math.round(value * (value < 0 ? 32768 : 32767));
      wav.writeInt16LE(pcm, 44 + i * 2);
      peak = Math.max(peak, Math.abs(pcm / 32768));
      energy += (pcm / 32768) ** 2;
    }
    const rms = Math.sqrt(energy / samples.length);
    assert(peak > 0 && peak < 1 && rms > 0, `${name}: silent or clipping PCM`);
    assert(wav.subarray(wav.length - tailSamples * 2).every((byte) => byte === 0), `${name}: missing 30ms zero tail`);
    const file = new URL(`../../public/sfx/coopanion-${name}.wav`, import.meta.url);
    let existing;
    try { existing = await readFile(file); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (existing) assert(existing.equals(wav), `${name}: existing output differs; inspect before replacing`);
    else await writeFile(file, wav, { flag: 'wx' });
    const saved = await readFile(file);
    assert(saved.equals(wav), `${name}: WAV readback mismatch`);
    assert.equal(saved.readUInt16LE(20), 1);
    assert.equal(saved.readUInt16LE(22), 1);
    assert.equal(saved.readUInt32LE(24), 48000);
    assert.equal(saved.readUInt16LE(34), 16);
    assert.equal(saved.readUInt32LE(40), saved.length - 44);
    metrics.push({ name, samples: samples.length, seconds: samples.length / sampleRate, peak, floatPeak, rms, bytes: wav.length, sha256: hash(saved), repeatMaxFloatDelta });
  }
  assert.equal(metrics.length, 10);
  console.log('name,samples,seconds,peak,float_peak,rms,bytes,sha256,repeat_max_float_delta');
  for (const m of metrics) console.log([m.name, m.samples, m.seconds.toFixed(6), m.peak.toFixed(9), m.floatPeak.toFixed(9), m.rms.toFixed(9), m.bytes, m.sha256, m.repeatMaxFloatDelta].join(','));
  console.log({ verified: 10, deterministicPassesPerSound: 2, totalBytes: metrics.reduce((n, m) => n + m.bytes, 0) });
} finally {
  await page.close(); // Own Page only. Never operate p1 or finish the shared TaskSpace.
  console.log({ closedOwnPage: page.label, spaceId: task.spaceId });
}
