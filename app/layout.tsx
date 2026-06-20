import type { Metadata } from "next";
import { inter, newsreader } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Majlis, Briefing companion",
  description: "An AI briefing companion for high-stakes government meetings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
