import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudioNow Talent Search",
  description: "Internal StudioNow talent search prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f3f3f1] text-zinc-950">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
