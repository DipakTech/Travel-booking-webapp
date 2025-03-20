import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Function to get status badge
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
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Function to get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Booking #{booking.id}
            </h2>
            <div className="flex items-center gap-2">
              {getStatusBadge(booking.status)}
              {getPaymentBadge(booking.paymentStatus)}
            </div>
          </div>
          <p className="text-muted-foreground">
            Created on {formatDate(booking.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Booking</Button>
          <Button variant="destructive">Cancel Booking</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-12 w-12">
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
              <div>
                <h3 className="font-semibold">{booking.customerName}</h3>
                <p className="text-sm text-muted-foreground">
                  Customer ID: C001
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.customerPhone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-1">{booking.destinationName}</h3>
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{booking.location}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Start Date</span>
                </div>
                <span className="font-medium">
                  {formatDate(booking.startDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">End Date</span>
                </div>
                <span className="font-medium">
                  {formatDate(booking.endDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Travelers</span>
                </div>
                <span className="font-medium">{booking.travelers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">
                ${booking.totalAmount.toLocaleString()}
              </span>
              {getPaymentBadge(booking.paymentStatus)}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Base Price</span>
                <span>${(booking.totalAmount * 0.8).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Guide Fee</span>
                <span>${(booking.totalAmount * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Taxes & Fees</span>
                <span>${(booking.totalAmount * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  ${booking.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Guide Required
                  </p>
                  <p className="font-medium">
                    {booking.guideRequired ? "Yes" : "No"}
                  </p>
                </div>
                {booking.guideRequired && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Guide Assigned
                    </p>
                    <p className="font-medium">{booking.guideAssigned}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Special Requirements</h3>
              <p>{booking.specialRequirements || "None specified"}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="itinerary" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-medium mb-4">Trip Itinerary</h3>
          <div className="space-y-4">
            {booking.itinerary.map((item) => (
              <div key={item.day} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    Day {item.day}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="notes" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-medium mb-4">Notes & Comments</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm mb-2 text-muted-foreground">
                Added on {formatDate(booking.createdAt)}
              </p>
              <p>{booking.notes}</p>
            </div>
            <div className="pt-4">
              <textarea
                className="w-full p-3 border rounded-md h-24"
                placeholder="Add a note about this booking..."
              />
              <div className="flex justify-end mt-2">
                <Button>Add Note</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
