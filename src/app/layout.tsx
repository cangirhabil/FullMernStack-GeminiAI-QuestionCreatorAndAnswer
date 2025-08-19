import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/auth-provider";
import { LangProvider } from "@/components/providers/lang-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Interview Question Creator",
  description: "AI-powered interview question generator from PDF documents",
  keywords: "interview, questions, AI, PDF, preparation, job interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} font-sans antialiased h-full bg-gray-50`}
      >
        <LangProvider>
          <AuthProvider>
            <div className="min-h-screen">{children}</div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
