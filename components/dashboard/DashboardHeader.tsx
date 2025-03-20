import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { UserNav } from "./UserNav";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <MobileNav />
      <div className="flex-1" />
      <nav className="hidden gap-2 md:flex">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/book">Book</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/destinations">Destinations</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/contact">Support</Link>
        </Button>
      </nav>
      <UserNav />
    </header>
  );
}
