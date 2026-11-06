import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f5f0e0",
};

export const metadata: Metadata = {
  title: "OLTRE LO SGUARDO OLTRE LA PELLE — Segni e testimonianze",
  description:
    "Archivio visivo, sonoro e narrativo dedicato alle memorie impresse sul corpo: cicatrici, nei, rughe, tatuaggi e tracce del tempo.",
  keywords: ["Oltre lo Sguardo Oltre la Pelle", "Segni e testimonianze", "Archivio", "Oltre", "Macro", "Micro", "Fotografia", "Audio"],
  openGraph: {
    title: "OLTRE LO SGUARDO OLTRE LA PELLE — Segni e testimonianze",
    description: "Archivio visivo, sonoro e narrativo dedicato alle memorie del corpo.",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="overflow-hidden">
      <body className="w-screen h-screen overflow-hidden bg-[#f5f0e0] text-[#523719] antialiased select-none">
        {children}
      </body>
    </html>
  );
}
