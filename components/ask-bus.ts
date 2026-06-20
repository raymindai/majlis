export const ASK_EVENT = "majlis-ask";

/** Send a question to the persistent chat panel from anywhere in the app. */
export function askMajlis(question: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: question }));
  }
}
