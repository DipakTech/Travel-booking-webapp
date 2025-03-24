import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  CalendarDays,
  Users,
  MapPin,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useBookings } from "@/lib/hooks/use-bookings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface BookingListProps {
  filters?: {
    search?: string;
    status?: string;
    destination?: string;
    guide?: string;
    startDate?: string;
    endDate?: string;
  };
  className?: string;
}

export function BookingList({ filters, className }: BookingListProps) {
  // Fetch bookings data using the hook
  const { data, isLoading, error } = useBookings(filters);

  // Function to format date in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to get status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Completed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("flex justify-center items-center py-8", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load bookings. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Handle empty state
  if (!data?.bookings || data.bookings.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        No bookings found with the current filters.
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Travelers</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {booking.customer.avatar ? (
                      <AvatarImage
                        src={booking.customer.avatar}
                        alt={booking.customer.name}
                      />
                    ) : null}
                    <AvatarFallback>
                      {booking.customer.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.customer.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {booking.customer.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {booking.destination.name}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3.5 w-3.5" />
                    {booking.destination.location}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(booking.dates.startDate.toString())}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      to {formatDate(booking.dates.endDate.toString())}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {booking.travelers.total}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />$
                  {booking.payment.totalAmount.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/dashboard/bookings/${booking.id}`}>
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/bookings/${booking.id}/edit`}>
                        Edit Booking
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/bookings/${booking.id}/contact`}>
                        Contact Customer
                      </Link>
                    </DropdownMenuItem>
                    {booking.status === "pending" && (
                      <DropdownMenuItem>Confirm Booking</DropdownMenuItem>
                    )}
                    {booking.status !== "cancelled" && (
                      <DropdownMenuItem className="text-red-600">
                        <Link href={`/dashboard/bookings/${booking.id}/cancel`}>
                          Cancel Booking
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
