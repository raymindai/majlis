/** A small, accurate UAE flag mark: red hoist, with green / white / black bands. */
export default function UaeFlag({ h = 12, className = "" }: { h?: number; className?: string }) {
  return (
    <svg
      width={h * 2}
      height={h}
      viewBox="0 0 24 12"
      className={className}
      role="img"
      aria-label="United Arab Emirates"
      style={{ borderRadius: 2, boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12)", display: "block", flexShrink: 0 }}
    >
      <rect width="24" height="12" fill="#ffffff" />
      <rect x="6" width="18" height="4" fill="#00732f" />
      <rect x="6" y="8" width="18" height="4" fill="#000000" />
      <rect width="6" height="12" fill="#ce1126" />
    </svg>
  );
}
