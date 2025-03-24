import { useRecentBookings } from "@/lib/hooks/use-bookings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RecentBookingsProps {
  className?: string;
}

export function RecentBookings({ className }: RecentBookingsProps) {
  const { data, isLoading, error } = useRecentBookings();

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Latest booking activity across your platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center animate-pulse">
                <div className="h-9 w-9 rounded-full bg-muted mr-4"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-3 w-48 bg-muted rounded"></div>
                </div>
                <div className="h-6 w-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Latest booking activity across your platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load recent bookings. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Format currency
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get the status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Latest booking activity across your platform.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/bookings">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data &&
            data.map((booking) => (
              <div key={booking.id} className="flex items-center">
                <Avatar className="h-9 w-9 mr-4">
                  <AvatarImage
                    src={booking.customer.avatar || undefined}
                    alt={booking.customer.name}
                  />
                  <AvatarFallback>
                    {getInitials(booking.customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">
                    {booking.customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.destination.name}, {booking.destination.location} •{" "}
                    {booking.createdAt &&
                      formatDistanceToNow(new Date(booking.createdAt), {
                        addSuffix: true,
                      })}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <Badge
                    variant="outline"
                    className={getStatusColor(booking.status)}
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-sm font-medium mt-1">
                    {booking.payment &&
                      formatCurrency(
                        booking.payment.totalAmount,
                        booking.payment.currency,
                      )}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
