import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nepal Guide Connect",
  description:
    "Connect with verified local guides for authentic Nepal experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
              <Navbar />
              <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
                {children}
              </main>
            </div>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
