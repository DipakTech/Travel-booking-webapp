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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Booking {
  id: string;
  destinationName: string;
  location: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled";
}

const bookings: Booking[] = [
  {
    id: "B001",
    destinationName: "Everest Base Camp Trek",
    location: "Nepal",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    customerAvatar: "/avatars/01.png",
    startDate: "2023-10-15",
    endDate: "2023-10-28",
    travelers: 2,
    totalAmount: 3200,
    status: "confirmed",
  },
  {
    id: "B002",
    destinationName: "Annapurna Circuit",
    location: "Nepal",
    customerName: "Chris Johnson",
    customerEmail: "chris.j@example.com",
    startDate: "2023-11-05",
    endDate: "2023-11-20",
    travelers: 4,
    totalAmount: 5800,
    status: "pending",
  },
  {
    id: "B003",
    destinationName: "Chitwan National Park Safari",
    location: "Nepal",
    customerName: "Sarah Williams",
    customerEmail: "sarah.w@example.com",
    customerAvatar: "/avatars/03.png",
    startDate: "2023-09-25",
    endDate: "2023-09-30",
    travelers: 2,
    totalAmount: 1200,
    status: "confirmed",
  },
  {
    id: "B004",
    destinationName: "Upper Mustang Trek",
    location: "Nepal",
    customerName: "Michael Davies",
    customerEmail: "m.davies@example.com",
    startDate: "2023-10-08",
    endDate: "2023-10-18",
    travelers: 1,
    totalAmount: 2100,
    status: "cancelled",
  },
  {
    id: "B005",
    destinationName: "Langtang Valley Trek",
    location: "Nepal",
    customerName: "Emma Wilson",
    customerEmail: "emma.w@example.com",
    customerAvatar: "/avatars/05.png",
    startDate: "2023-11-12",
    endDate: "2023-11-22",
    travelers: 3,
    totalAmount: 3600,
    status: "confirmed",
  },
];

export function BookingList() {
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
  const getStatusBadge = (status: Booking["status"]) => {
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
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
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
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {booking.customerAvatar ? (
                      <AvatarImage
                        src={booking.customerAvatar}
                        alt={booking.customerName}
                      />
                    ) : null}
                    <AvatarFallback>
                      {booking.customerName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.customerName}</span>
                    <span className="text-sm text-muted-foreground">
                      {booking.customerEmail}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{booking.destinationName}</span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3.5 w-3.5" />
                    {booking.location}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(booking.startDate)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      to {formatDate(booking.endDate)}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {booking.travelers}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />$
                  {booking.totalAmount.toLocaleString()}
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
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                    <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                    {booking.status === "pending" && (
                      <DropdownMenuItem>Confirm Booking</DropdownMenuItem>
                    )}
                    {booking.status !== "cancelled" && (
                      <DropdownMenuItem className="text-red-600">
                        Cancel Booking
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
