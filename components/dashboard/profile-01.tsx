"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";

export interface Profile01Props {
  avatar: string;
  name: string;
  email: string;
  signOut: () => void;
}

export default function Profile01({
  avatar,
  name,
  email,
  signOut,
}: Profile01Props) {
  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {email || "user@example.com"}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/dashboard/settings">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Settings
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/dashboard/profile">
              <User className="h-3.5 w-3.5 mr-1.5" />
              Profile
            </Link>
          </Button>
        </div>
      </div>
      <div className="p-2">
        <DropdownMenuItem asChild>
          <Link
            href="#"
            className="flex items-center gap-3 cursor-pointer w-full"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          className="text-red-500 hover:text-red-500 font-medium cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span>Log out</span>
        </DropdownMenuItem>
      </div>
    </div>
  );
}
