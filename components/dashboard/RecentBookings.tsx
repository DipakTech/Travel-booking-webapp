"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/lib/hooks/use-dashboard";
import { useBookings } from "@/lib/hooks/use-bookings";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentBookings() {
  const { data: bookingsData, isLoading } = useBookings({
    limit: 5,
  });

  if (isLoading || !bookingsData) {
    return (
      <div className="space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="ml-auto h-6 w-20" />
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookingsData.bookings.map((booking) => (
        <div key={booking.id} className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={booking.customer.avatar || ""}
              alt={booking.customer.name}
            />
            <AvatarFallback>
              {booking.customer.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-medium leading-none">{booking.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {booking.destination.name}
            </p>
          </div>
          <div className="ml-auto">
            <Badge
              className="font-normal"
              variant={
                booking.status === "confirmed"
                  ? "default"
                  : booking.status === "pending"
                  ? "secondary"
                  : booking.status === "cancelled"
                  ? "destructive"
                  : "outline"
              }
            >
              {booking.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
