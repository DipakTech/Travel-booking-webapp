"use client";

import { Button } from "@/components/ui/button";
import { MobileMenuProps } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";

export function MobileMenu({
  isOpen,
  onClose,
  routes,
  session,
  onSignOut,
}: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] lg:hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-blue-500/20 dark:bg-blue-900/30 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Mobile Menu Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-sm bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 shadow-2xl flex flex-col"
          >
            <div className="flex flex-col h-full overflow-y-auto pt-20 pb-6">
              <div className="flex-1 space-y-1 px-6">
                {routes.map((route, idx) => (
                  <motion.div
                    key={route.href}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.1 }}
                  >
                    <Link
                      href={route.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all",
                        pathname === route.href
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                      )}
                    >
                      <route.icon
                        className={cn(
                          "h-5 w-5",
                          pathname === route.href
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400",
                        )}
                      />
                      <span className="font-medium">{route.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Authentication Buttons */}
              {!session?.user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: routes.length * 0.1 + 0.3 }}
                  className="mt-8 space-y-3 px-6"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-center h-12 text-base border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    asChild
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    className="w-full justify-center h-12 text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </motion.div>
              )}

              {/* User Info on Mobile */}
              {session?.user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: routes.length * 0.1 + 0.3 }}
                  className="mt-auto px-6 pt-6 border-t border-blue-100 dark:border-blue-900"
                >
                  <div className="flex items-center gap-3 mb-4 px-4">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User avatar"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={onSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
