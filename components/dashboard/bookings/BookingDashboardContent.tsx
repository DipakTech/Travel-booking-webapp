"use client";

import { BookingStats } from "@/components/dashboard/bookings/BookingStats";
import { RecentBookings } from "@/components/dashboard/bookings/RecentBookings";
import { BookingList } from "@/components/dashboard/bookings/BookingList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function BookingDashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage bookings, view statistics, and track reservations.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/bookings/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Booking
          </Link>
        </Button>
      </div>

      <BookingStats />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        {/* <BookingList className="md:col-span-2 lg:col-span-4" /> */}
        <BookingList className="md:col-span-2 lg:col-span-12" />
      </div>
      <RecentBookings className="md:col-span-1 lg:col-span-3" />
    </div>
  );
}
