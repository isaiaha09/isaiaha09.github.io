import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { GlassColorMotion } from "@/components/glass-color-motion";
import { ParticleBackground } from "@/components/particle-background";
import "./globals.css";

export const metadata: Metadata = {
  title: "IASAPPS — Websites & iOS Apps",
  description:
    "Selected websites and iOS apps by Isaiah, an independent builder in Ventura County, California.",
  applicationName: "IASAPPS Portfolio",
  icons: {
    icon: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  preload("/particle-poster-wide.webp", { as: "image", type: "image/webp", media: "(min-width: 681px)" });
  preload("/particle-poster-mobile.webp", { as: "image", type: "image/webp", media: "(max-width: 680px)" });

  return (
    <html lang="en">
      <body>
        <ParticleBackground />
        <GlassColorMotion />
        {children}
      </body>
    </html>
  );
}
