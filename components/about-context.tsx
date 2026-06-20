"use client";

import { createContext, useContext } from "react";

/** Open the "For reviewers" window from anywhere (header button, empty states, etc.). */
export const AboutContext = createContext<{ open: () => void }>({ open: () => {} });

export const useAbout = () => useContext(AboutContext);
