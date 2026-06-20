import type { Metadata } from "next";
import { arabic, inter, newsreader } from "@/lib/fonts";
import { LangProvider } from "@/components/lang-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Majlis, Briefing companion",
  description: "An AI briefing companion for high-stakes government meetings.",
};

// Set language direction and theme before paint, so there is no flash on load.
const noFlash = `(function(){try{var l=localStorage.getItem('majlis-lang')==='ar'?'ar':'en';document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';var t=localStorage.getItem('majlis-theme')==='dark'?'dark':'';if(t){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${arabic.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
