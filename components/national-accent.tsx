/**
 * A restrained nod to the UAE: a thin hairline in the national colours (a red
 * lead, then green / white / black) along the very top edge. Easy to miss, but
 * there. Decorative only.
 */
export default function NationalAccent({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-[2px] w-full shrink-0 ${className}`} aria-hidden>
      <div style={{ width: 16, background: "#ce1126" }} />
      <div className="flex-1" style={{ background: "#00732f" }} />
      <div className="flex-1" style={{ background: "#e9e8e4" }} />
      <div className="flex-1" style={{ background: "#1a1a1a" }} />
    </div>
  );
}
