"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef, MouseEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  User,
  Settings,
  Menu,
  X,
  Home,
  Map,
  Globe,
  Headphones,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const routes = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/guides",
    label: "Find Guides",
    icon: Map,
  },
  {
    href: "/destinations",
    label: "Destinations",
    icon: Globe,
  },
  {
    href: "/services",
    label: "Services",
    icon: Headphones,
  },
  {
    href: "/community",
    label: "Community",
    icon: Users,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-white/50 dark:bg-gray-950/50 backdrop-blur-md",
        // scrolled
        //   ? "bg-white/80 dark:bg-gray-900/85 backdrop-blur-lg shadow-sm"
        //   : "bg-white/50 dark:bg-gray-950/50 backdrop-blur-md",
        "border-b border-gray-200/20 dark:border-gray-800/20",
      )}
      ref={navRef}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center gap-2">
            <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden">
              <Image
                src="/logo.png"
                alt="Nepal Guide Connect"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden sm:inline-block">
              Guide Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary relative py-2 group",
                  pathname === route.href
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-300",
                )}
              >
                <span className="relative z-10">{route.label}</span>
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                    pathname === route.href
                      ? "bg-primary scale-x-100"
                      : "bg-primary/70",
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Right Side: Theme Toggle & Auth */}
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />

            {/* User Menu or Auth Buttons */}
            {status === "loading" ? (
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 p-0 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
                  >
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User avatar"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 mt-2 rounded-xl p-2"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center cursor-pointer text-red-600 dark:text-red-400 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                  asChild
                >
                  <Link href="/auth/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex lg:hidden rounded-full h-9 w-9 p-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </nav>
      </Container>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
            >
              <div className="flex flex-col h-full overflow-y-auto pt-20 pb-8 px-6">
                <div className="space-y-1">
                  {routes.map((route, idx) => (
                    <motion.div
                      key={route.href}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 + 0.1 }}
                    >
                      <Link
                        href={route.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all",
                          pathname === route.href
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40",
                        )}
                      >
                        <route.icon
                          className={cn(
                            "h-5 w-5",
                            pathname === route.href
                              ? "text-primary"
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
                    className="mt-8 space-y-3"
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-center h-12 text-base"
                      asChild
                    >
                      <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button
                      className="w-full justify-center h-12 text-base bg-primary hover:bg-primary/90 text-white"
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
                    className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-800"
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
                          <div className="h-full w-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
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
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={() => signOut()}
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
    </header>
  );
}
