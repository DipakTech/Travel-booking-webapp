import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";
import { UserNav } from "./UserNav";
import { ReactNode } from "react";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}

export function DashboardNavHeader() {
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
