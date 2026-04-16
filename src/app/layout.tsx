import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevFolio – Showcase Your Developer Journey",
    template: "%s | DevFolio",
  },
  description:
    "The premium portfolio platform for developers. Showcase your projects, get discovered by top companies, and accelerate your career.",
  keywords: ["developer portfolio", "software engineer", "showcase projects", "tech jobs"],
  authors: [{ name: "DevFolio" }],
  creator: "DevFolio",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://devfolio.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "DevFolio – Showcase Your Developer Journey",
    description:
      "The premium portfolio platform for developers. Showcase your projects, get discovered by top companies.",
    siteName: "DevFolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFolio – Showcase Your Developer Journey",
    description: "The premium portfolio platform for developers.",
    creator: "@devfolio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
