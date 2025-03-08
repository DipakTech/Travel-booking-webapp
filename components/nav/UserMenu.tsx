"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenuProps } from "./types";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function UserMenu({ session, status, onSignOut }: UserMenuProps) {
  if (status === "loading") {
    return (
      <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
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
    );
  }

  return (
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
      <DropdownMenuContent align="end" className="w-60 mt-2 rounded-xl p-2">
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
          onClick={onSignOut}
          className="flex items-center cursor-pointer text-red-600 dark:text-red-400 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
