import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Source parts keep uploads manageable; the published site serves one normal MP4.
const root = new URL('../', import.meta.url);
const parts = await Promise.all([1, 2, 3, 4].map((part) =>
  readFile(new URL(`assets-source/video/club-reel/club-reel.mp4.part${part}`, root)),
));
const video = Buffer.concat(parts);
const expectedHash = '5f5900379e7eda8129c3a6fb2ab598d13116792f02a31b2ec8ea8258fd928b45';
if (video.length !== 32880664 || createHash('sha256').update(video).digest('hex') !== expectedHash) {
  throw new Error('Club reel source is incomplete or damaged.');
}
const destination = new URL('public/media/reels/club-reel.mp4', root);
await mkdir(new URL('./', destination), { recursive: true });
const temporary = `${fileURLToPath(destination)}.tmp`;
await writeFile(temporary, video);
await rename(temporary, destination);
console.log('Club reel prepared: 1080 × 1920, 30 fps.');
