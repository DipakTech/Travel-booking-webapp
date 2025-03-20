"use client";

import Sidebar from "@/components/dashboard/sidebar";
import TopNav from "@/components/dashboard/top-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-[#0F0F12] dark:border-[#1F1F23]">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation */}
            <header className="h-14 border-b shrink-0">
              <TopNav />
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-auto">
              <ScrollArea className="h-full">
                <div className="container py-6 md:py-8 px-4 lg:px-6 lg:py-10">
                  {children}
                </div>
              </ScrollArea>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
