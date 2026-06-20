/**
 * Generate participant avatars via fal (Nano Banana Pro / Nano Banana 2).
 * Run: node --env-file=.env.local scripts/generate-avatars.mjs
 * Saves to public/avatars/<id>.png. Per decision D11: dignified, consistent,
 * lightly-stylised editorial portraits (not photoreal); PSD = anonymous silhouette.
 */
import { fal } from "@fal-ai/client";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

fal.config({ credentials: process.env.FAL_KEY });

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "avatars");

const STYLE =
  "Dignified editorial portrait illustration in a refined, painterly style with soft muted colours and a warm neutral studio background. Head and shoulders, three-quarter view, calm and authoritative expression, professional business attire. Tasteful and sophisticated, clearly an illustration — not photorealistic. No text, no logos, no watermarks.";

const PEOPLE = [
  { id: "EDD", desc: "A composed Emirati man in his 50s with short greying hair and a neatly trimmed beard, wearing a dark navy suit." },
  { id: "EKD", desc: "A poised Emirati woman in her 40s wearing an elegant cream headscarf and modern professional attire." },
  { id: "MTA", desc: "A focused Emirati man in his 40s, clean-shaven, wearing a charcoal suit and open-collar shirt." },
  { id: "HSA", desc: "A confident woman in her 40s with shoulder-length dark hair, wearing a tailored slate-blue blazer." },
  { id: "PSD", desc: "An anonymous, featureless silhouette of a person in a suit, in soft shadow, representing a confidential restricted participant." },
];

await mkdir(OUT, { recursive: true });

for (const p of PEOPLE) {
  process.stdout.write(`Generating ${p.id} … `);
  const result = await fal.subscribe("fal-ai/nano-banana-pro", {
    input: {
      prompt: `${p.desc} ${STYLE}`,
      num_images: 1,
      aspect_ratio: "1:1",
      output_format: "png",
      resolution: "1K",
    },
  });
  const url = result?.data?.images?.[0]?.url;
  if (!url) {
    console.log("no image returned", JSON.stringify(result?.data)?.slice(0, 200));
    continue;
  }
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(OUT, `${p.id}.png`), buf);
  console.log(`saved public/avatars/${p.id}.png (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log("Done.");
