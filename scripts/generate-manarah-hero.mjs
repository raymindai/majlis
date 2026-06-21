/**
 * Generate the Manarah programme identity image via fal (Nano Banana Pro).
 * "Manarah" (منارة) means beacon / lighthouse, so the motif is a guiding light
 * unifying a network of public services. Used in the About Manarah panel and the
 * reviewer guide banner.
 * Run: node --env-file=.env.local scripts/generate-manarah-hero.mjs
 * Saves public/manarah-beacon.png (convert to .jpg afterwards with sips).
 */
import { fal } from "@fal-ai/client";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

fal.config({ credentials: process.env.FAL_KEY });
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const prompt =
  "A dignified, premium editorial illustration representing 'Manarah' (Arabic for beacon or lighthouse), the visual identity of a cross-government digital-services programme in Abu Dhabi. A luminous stylised beacon at the centre casting a calm warm light, radiating into a soft geometric network of interconnected civic nodes interwoven with gentle Arabic girih patterning, evoking unified public services guided by a single guiding light. Warm institutional palette: cream and sand background, brushed bronze and brass gold highlights, faint deep-navy accents, soft golden glow. Minimal, calm, low contrast, mostly light, generous negative space at the top. Elegant abstract illustration, not photorealistic, editorial and restrained. No text, no logos, no people, no watermarks.";

process.stdout.write("Generating manarah-beacon … ");
const r = await fal.subscribe("fal-ai/nano-banana-pro", {
  input: { prompt, num_images: 1, aspect_ratio: "16:9", output_format: "png", resolution: "1K" },
});
const url = r?.data?.images?.[0]?.url;
if (!url) {
  console.log("no image returned");
  process.exit(1);
}
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
await writeFile(join(PUBLIC, "manarah-beacon.png"), buf);
console.log(`saved public/manarah-beacon.png (${(buf.length / 1024).toFixed(0)} KB)`);
