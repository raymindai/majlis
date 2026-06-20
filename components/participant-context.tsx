"use client";

import { createContext, useContext } from "react";

/** Open the participant detail drawer from anywhere (the room, cards, distribution…). */
export const ParticipantContext = createContext<{ open: (id: string | null) => void }>({ open: () => {} });

export const useParticipant = () => useContext(ParticipantContext);
