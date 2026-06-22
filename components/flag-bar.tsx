import { C } from "@/components/theme";

// UAE flag colours, in flag order: red (the hoist band), then green, white, black.
const UAE = ["#CE1126", "#00732F", "#FFFFFF", "#000000"];

/**
 * A slim UAE flag-colour bar: a dignified national accent flush at the base of the
 * frame. Decorative only, and dir="ltr" so the flag orientation never mirrors in RTL.
 */
export default function FlagBar() {
  return (
    <div dir="ltr" aria-hidden className="shrink-0 flex h-[3px] w-full" style={{ borderTop: `1px solid ${C.line}` }}>
      {UAE.map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  );
}
