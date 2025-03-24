import { useBookingStats } from "@/lib/hooks/use-bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  Package,
  Check,
  Users,
  CreditCard,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface BookingStatsProps {
  className?: string;
}

export function BookingStats({ className }: BookingStatsProps) {
  const { data, isLoading, error } = useBookingStats();

  // Loading state
  if (isLoading || !data) {
    return (
      <div
        className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="h-4 w-24 bg-muted rounded"></CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-7 w-16 bg-muted rounded"></div>
              <div className="h-3 w-28 bg-muted rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load booking statistics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            {data.monthlyGrowthRate >= 0 ? "+" : ""}
            {formatPercentage(data.monthlyGrowthRate)} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Confirmed Bookings
          </CardTitle>
          <Check className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.statusCounts.confirmed}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.totalBookings > 0
              ? formatPercentage(
                  (data.statusCounts.confirmed / data.totalBookings) * 100,
                )
              : "0%"}{" "}
            confirmation rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Travelers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalTravelers}</div>
          <p className="text-xs text-muted-foreground">
            {data.avgTravelersPerBooking.toFixed(2)} travelers per booking
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(data.averageBookingValue)} avg. booking value
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
