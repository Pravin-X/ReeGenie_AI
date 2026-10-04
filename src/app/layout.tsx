import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReelGenie AI | The Ultimate D2C Content Engine",
  description: "Automate your viral content strategy. 1 product photo in, 5 viral Reel scripts out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <div className="h-1 w-full flex">
          {/* Pixel art banner */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 ${
                i % 4 === 0
                  ? "bg-gold"
                  : i % 4 === 1
                  ? "bg-blue"
                  : i % 4 === 2
                  ? "bg-text"
                  : "bg-muted"
              }`}
            ></div>
          ))}
        </div>
        {children}
      </body>
    </html>
  );
}
