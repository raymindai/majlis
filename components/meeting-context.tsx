"use client";

import { createContext, useContext } from "react";

export type MeetingPos = { x: number; y: number };

/** Open a meeting-summary window from anywhere (named to avoid the rail's MeetingContext block). */
export const OpenMeetingContext = createContext<{ open: (id: string | null, pos?: MeetingPos) => void }>({ open: () => {} });

export const useOpenMeeting = () => useContext(OpenMeetingContext);
