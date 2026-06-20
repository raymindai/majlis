"use client";

import { createContext, useContext } from "react";
import type { Citation } from "@/lib/mock";

export type CitePos = { x: number; y: number };

export const CitationContext = createContext<{ open: (c: Citation | null, pos?: CitePos) => void }>({ open: () => {} });

export const useCitation = () => useContext(CitationContext);
