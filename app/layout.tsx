import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { Navbar } from "@/components/nav/Navbar";
import { Analytics } from "@/components/Analytics";
import { Crisp } from "@/components/Crisp";
import { defaultMetadata } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Schema.org markup for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Nepal Guide Connect",
              url:
                process.env.NEXT_PUBLIC_APP_URL ||
                "https://travel.oneclickresult.com",
              logo: "/logo.png",
              description: defaultMetadata.description,
              sameAs: [
                "https://twitter.com/nepalguideconnect",
                "https://facebook.com/nepalguideconnect",
                "https://instagram.com/nepalguideconnect",
              ],
            }),
          }}
        />
      </head>
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
            <Analytics />
            <Crisp />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
