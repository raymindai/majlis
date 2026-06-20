"use client";

import { createContext, useContext } from "react";

export type ParticipantPos = { x: number; y: number };

/** Open the participant profile popover from anywhere, anchored near the click point. */
export const ParticipantContext = createContext<{ open: (id: string | null, pos?: ParticipantPos) => void }>({ open: () => {} });

export const useParticipant = () => useContext(ParticipantContext);
