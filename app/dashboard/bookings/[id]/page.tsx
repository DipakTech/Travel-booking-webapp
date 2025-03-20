import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookingDetails } from "@/components/dashboard/bookings/BookingDetails";

export const metadata: Metadata = {
  title: "Booking Details | Travel Booking Dashboard",
  description: "View and manage booking details",
};

// Mock data - in a real app, this would come from a database
const bookings = [
  {
    id: "B001",
    destinationName: "Everest Base Camp Trek",
    destinationId: "D001",
    location: "Nepal",
    customerName: "Alex Morgan",
    customerEmail: "alex.morgan@example.com",
    customerPhone: "+1 234 567 8901",
    customerAvatar: "/avatars/01.png",
    startDate: "2023-10-15",
    endDate: "2023-10-28",
    travelers: 2,
    totalAmount: 3200,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-09-05",
    updatedAt: "2023-09-06",
    notes: "Customer requested vegetarian meals throughout the trek.",
    guideRequired: true,
    guideAssigned: "John Sherpa",
    itinerary: [
      { day: 1, description: "Arrival in Kathmandu" },
      { day: 2, description: "Flight to Lukla and trek to Phakding" },
      { day: 3, description: "Trek to Namche Bazaar" },
      { day: 4, description: "Acclimatization day in Namche" },
      { day: 5, description: "Trek to Tengboche" },
    ],
    specialRequirements:
      "Vegetarian meals required. Extra oxygen tanks for high altitude.",
  },
];

export default function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const booking = bookings.find((b) => b.id === params.id);

  if (!booking) {
    notFound();
  }

  // Function to format date in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Booking #{booking.id}
          </h2>
          <p className="text-muted-foreground">
            Created on {formatDate(booking.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/bookings/${booking.id}/edit`}>
              Edit Booking
            </Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href={`/dashboard/bookings/${booking.id}/cancel`}>
              Cancel Booking
            </Link>
          </Button>
        </div>
      </div>

      <BookingDetails booking={booking} />
    </div>
  );
}
