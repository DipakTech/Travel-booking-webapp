"use client";

import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Map, Globe, Headphones, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";
import { Route } from "./types";

const routes: Route[] = [
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
  const navRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const offset = window.scrollY;
  //     setScrolled(offset > 10);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
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
    <div className="relative">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ",
          "bg-white/50 dark:bg-gray-950/50 backdrop-blur-md",
          // scrolled &&
          //   "bg-white/80 dark:bg-gray-900/85 backdrop-blur-lg shadow-sm",
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
            <DesktopMenu routes={routes} pathname={pathname} />

            {/* Right Side: Theme Toggle & Auth */}
            <div className="flex items-center gap-3 md:gap-4">
              <ThemeToggle />
              <UserMenu
                session={session}
                status={status}
                onSignOut={() => signOut()}
              />

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

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          routes={routes}
          session={session}
          onSignOut={() => signOut()}
        />
      </header>
    </div>
  );
}
