import {readFileSync, realpathSync, statSync} from 'node:fs';
for (const p of ['src/Film.tsx', 'src/Composition.tsx', 'remotion.config.ts']) {
 const s = readFileSync(p, 'utf8');
 console.log({path:realpathSync(p),mtime:statSync(p).mtime.toISOString(),film:s.match(/FILM_FRAMES = \d+/)?.[0],simulation:s.includes('SimulatedClip'),cache:s.includes('setCachingEnabled(false)')});
}
