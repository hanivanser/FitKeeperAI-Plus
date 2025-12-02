import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitKeeper AI+",
  description: "Tu progreso, tu ritmo, tu victoria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900`}>
        {children}
      </body>
    </html>
  );
}