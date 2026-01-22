import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelFont = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PictoChat Clone",
  description: "A clone of the Nintendo DS PictoChat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pixelFont.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
