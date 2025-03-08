"use client";

import { DesktopMenuProps } from "./types";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DesktopMenu({ routes, pathname }: DesktopMenuProps) {
  return (
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
  );
}
