"use client";

import { createContext, useContext, type ReactNode } from "react";

export type DetailLevel = 1 | 2 | 3; // 1 = Headlines, 2 = Brief, 3 = Full

export const DetailContext = createContext<{ level: DetailLevel; setLevel: (l: DetailLevel) => void }>({
  level: 3,
  setLevel: () => {},
});

export const useDetail = () => useContext(DetailContext);

/** Renders its children only when the current detail level is at least `min`. */
export function DetailGate({ min = 1, children }: { min?: DetailLevel; children: ReactNode }) {
  const { level } = useDetail();
  if (level < min) return null;
  return <>{children}</>;
}
