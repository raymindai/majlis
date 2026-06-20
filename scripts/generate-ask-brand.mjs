/**
 * Generate the faint brand backdrop for the Ask Majlis panel header via fal (Nano Banana Pro).
 * Run: node --env-file=.env.local scripts/generate-ask-brand.mjs
 * Saves public/ask-majlis-brand.png (converted to .jpg afterwards).
 */
import { fal } from "@fal-ai/client";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

fal.config({ credentials: process.env.FAL_KEY });
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const prompt =
  "A calm, premium abstract brand backdrop for an AI assistant named Majlis. Subtle Arabic girih geometry interwoven with softly glowing interconnected nodes, evoking both a majlis gathering space and quiet machine intelligence. Warm institutional palette of cream, sand and bronze with faint deep-navy accents. Very soft, low-contrast, mostly light, gentle glow, suitable as a faint header background. Elegant, minimal, dignified, editorial. Clearly an abstract illustration, not photorealistic. No text, no logos, no people, no watermarks.";

process.stdout.write("Generating ask-majlis-brand … ");
const r = await fal.subscribe("fal-ai/nano-banana-pro", {
  input: { prompt, num_images: 1, aspect_ratio: "16:9", output_format: "png", resolution: "1K" },
});
const url = r?.data?.images?.[0]?.url;
if (!url) {
  console.log("no image returned");
  process.exit(1);
}
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
await writeFile(join(PUBLIC, "ask-majlis-brand.png"), buf);
console.log(`saved public/ask-majlis-brand.png (${(buf.length / 1024).toFixed(0)} KB)`);
