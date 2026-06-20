import Desk from "@/components/desk";

/**
 * Shared workspace for the three stages. Because this layout is preserved across
 * navigation between Before, During, and After (only the page segment swaps), the
 * Desk it holds keeps every floating window and note open until the user closes it.
 */
export default function StagesLayout({ children }: { children: React.ReactNode }) {
  return <Desk>{children}</Desk>;
}
