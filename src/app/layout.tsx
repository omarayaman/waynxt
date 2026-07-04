import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    icon: "/icons/waynxt.svg",
  },
};

import { AuthProvider } from "@/providers/AuthProvider";
import FloatingAiButton from "@/components/FloatingAiButton";
import { ToasterProvider } from "@/components/ToasterProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <AuthProvider>
            {children}
            <FloatingAiButton />
            <ToasterProvider />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
