import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  destination: string;
  image: string;
  date: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  amount: number;
}

const bookings: Booking[] = [
  {
    id: "B12345",
    destination: "Bali, Indonesia",
    image: "/destinations/bali.jpg",
    date: "May 24, 2023",
    status: "upcoming",
    amount: 1240,
  },
  {
    id: "B12346",
    destination: "Paris, France",
    image: "/destinations/paris.jpg",
    date: "April 10, 2023",
    status: "completed",
    amount: 1780,
  },
  {
    id: "B12347",
    destination: "Tokyo, Japan",
    image: "/destinations/tokyo.jpg",
    date: "March 15, 2023",
    status: "completed",
    amount: 2100,
  },
  {
    id: "B12348",
    destination: "New York, USA",
    image: "/destinations/newyork.jpg",
    date: "February 3, 2023",
    status: "cancelled",
    amount: 1450,
  },
];

export function RecentBookings() {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={booking.image} alt={booking.destination} />
            <AvatarFallback>
              {booking.destination.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {booking.destination}
            </p>
            <p className="text-sm text-muted-foreground">{booking.date}</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <Badge
              variant={
                booking.status === "upcoming"
                  ? "outline"
                  : booking.status === "ongoing"
                  ? "default"
                  : booking.status === "completed"
                  ? "secondary"
                  : "destructive"
              }
              className="capitalize"
            >
              {booking.status}
            </Badge>
            <p className="text-sm font-medium">${booking.amount}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
