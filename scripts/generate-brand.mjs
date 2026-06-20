/**
 * Generate brand imagery via fal (Nano Banana Pro).
 * Run: node --env-file=.env.local scripts/generate-brand.mjs
 * - public/avatars/CHAIR.png : the chair's profile portrait (the user)
 * - public/manarah-hero.png  : an on-brand hero for the about window / microsite
 */
import { fal } from "@fal-ai/client";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

fal.config({ credentials: process.env.FAL_KEY });
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const JOBS = [
  {
    file: "avatars/CHAIR.png",
    aspect: "1:1",
    resolution: "1K",
    prompt:
      "A distinguished Emirati man in his late 50s, dignified, short silver hair and a neatly trimmed grey beard, wearing a dark formal suit, calm and authoritative, the chair of a senior government committee. Dignified editorial portrait illustration in a refined painterly style, soft muted colours, warm neutral studio background, head and shoulders, three-quarter view. Tasteful and sophisticated, clearly an illustration, not photorealistic. No text, no logos, no watermarks.",
  },
  {
    file: "manarah-hero.png",
    aspect: "16:9",
    resolution: "2K",
    prompt:
      "A refined editorial illustration representing a unified Abu Dhabi government digital-services programme: an elegant abstract network of interconnected service nodes over soft modern geometric architecture, with a subtle silhouette of a contemporary Abu Dhabi skyline at dawn. Warm institutional palette of cream, bronze and deep navy. Calm, dignified, premium, abstract. Clearly an illustration, not photorealistic. No text, no logos, no people, no watermarks.",
  },
];

await mkdir(join(PUBLIC, "avatars"), { recursive: true });
for (const j of JOBS) {
  process.stdout.write(`Generating ${j.file} … `);
  const r = await fal.subscribe("fal-ai/nano-banana-pro", {
    input: { prompt: j.prompt, num_images: 1, aspect_ratio: j.aspect, output_format: "png", resolution: j.resolution },
  });
  const url = r?.data?.images?.[0]?.url;
  if (!url) {
    console.log("no image returned");
    continue;
  }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(join(PUBLIC, j.file), buf);
  console.log(`saved public/${j.file} (${(buf.length / 1024).toFixed(0)} KB)`);
}
console.log("Done.");
