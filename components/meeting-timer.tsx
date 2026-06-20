"use client";

import { useEffect, useState } from "react";

/** A live elapsed clock for the in-session meeting, counting up from when it mounts. */
export default function MeetingTimer() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {mm}:{ss}
    </span>
  );
}
