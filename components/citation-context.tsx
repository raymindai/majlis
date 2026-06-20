"use client";

import { createContext, useContext } from "react";
import type { Citation } from "@/lib/mock";

export const CitationContext = createContext<{ open: (c: Citation) => void }>({ open: () => {} });

export const useCitation = () => useContext(CitationContext);
