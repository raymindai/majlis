export const ABOUT_PROGRAMME_EVENT = "majlis-about-programme";

/** Open the "About Manarah" panel from anywhere (the rail anchor calls this). */
export function openAboutProgramme() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(ABOUT_PROGRAMME_EVENT));
}
