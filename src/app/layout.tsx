import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { DataProvider } from "@/components/providers/data-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RetraiteSpirit - Gestion des Retraites d'Église",
  description: "Plateforme de gestion des retraites spirituelles d'église",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <DataProvider>
            {children}
            <Toaster position="top-right" richColors />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
