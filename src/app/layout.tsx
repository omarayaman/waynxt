import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PUBLIC_ASSETS } from "@/lib/public-assets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waynx",
  description: "Waynx - The next generation travel experience",
  icons: {
    icon: PUBLIC_ASSETS.icons.waynxt,
  },
};

import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import FloatingAiButton from "@/components/FloatingAiButton";
import { ToasterProvider } from "@/components/ToasterProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { BootScreen } from "@/components/BootScreen";
import { BootSplash } from "@/components/BootSplash";
import { GoogleOAuthProviderWrapper } from "@/providers/GoogleOAuthProviderWrapper";
import NavbarHome from "@/app/(home)/NavbarHome";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <BootSplash />

        <div id="app-content" className="min-h-full flex flex-col bg-background text-foreground">
          <GoogleOAuthProviderWrapper>
            <ThemeProvider>
              <AuthProvider>
                <NavbarHome />
                {children}
                <FloatingAiButton />
                <ToasterProvider />
              </AuthProvider>
            </ThemeProvider>
          </GoogleOAuthProviderWrapper>
          <BootScreen />
        </div>
      </body>
    </html>
  );
}
