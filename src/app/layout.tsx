import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskit — Plan Better. Do More. | Modern Productivity SaaS",
  description:
    "Taskit is a premium, modern task management platform designed to help you plan your day, prioritize what matters, and turn your tasks into real progress.",
  keywords: [
    "Taskit",
    "task manager",
    "productivity saas",
    "kanban board",
    "project management",
    "nextjs",
    "dark mode",
  ],
  authors: [{ name: "Taskit Team" }],
  icons: {
    icon: [
      { url: "/mascot-icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/mascot-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geistMono.variable}`} data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}

