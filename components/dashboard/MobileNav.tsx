import Link from "next/link";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl">Travel Booking</span>
          </Link>
        </div>
        <div className="flex flex-col gap-3 mt-8 px-7">
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          <Link href="/dashboard/destinations" className="text-sm font-medium">
            Destinations
          </Link>
          <Link href="/dashboard/guides" className="text-sm font-medium">
            Guides
          </Link>
          <Link href="/dashboard/bookings" className="text-sm font-medium">
            Bookings
          </Link>
          <Link href="/dashboard/settings" className="text-sm font-medium">
            Settings
          </Link>
        </div>
        <div className="flex flex-col gap-3 mt-8 px-7 pt-6 border-t">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/book" className="text-sm font-medium">
            Book
          </Link>
          <Link href="/destinations" className="text-sm font-medium">
            Destinations
          </Link>
          <Link href="/contact" className="text-sm font-medium">
            Support
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
