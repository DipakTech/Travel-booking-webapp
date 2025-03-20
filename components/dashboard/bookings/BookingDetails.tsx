import React from "react";
import { format } from "date-fns";
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
import {
  CalendarDays,
  MapPin,
  Users,
  CreditCard,
  Phone,
  Mail,
  Clipboard,
  Check,
  X,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BookingDetailsProps {
  booking: {
    id: string;
    destinationName: string;
    destinationId: string;
    location: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAvatar?: string;
    startDate: string;
    endDate: string;
    travelers: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
    guideRequired?: boolean;
    guideAssigned?: string;
    itinerary?: { day: number; description: string }[];
    specialRequirements?: string;
  };
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  // Function to format date in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to calculate duration
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="h-3.5 w-3.5 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="h-3.5 w-3.5 mr-1" />
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
            <CreditCard className="h-3.5 w-3.5 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <CreditCard className="h-3.5 w-3.5 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="customer">Customer</TabsTrigger>
        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Destination Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Destination</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-1">
                {booking.destinationName}
              </h3>
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
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <span className="font-medium">
                    {calculateDuration(booking.startDate, booking.endDate)} days
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

          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {getStatusBadge(booking.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment</span>
                {getPaymentBadge(booking.paymentStatus)}
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Booking ID</span>
                <span className="font-mono text-sm">{booking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm">{formatDate(booking.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm">{formatDate(booking.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="font-semibold">
                  ${booking.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Per Traveler</span>
                <span className="text-sm">
                  $
                  {Math.round(
                    booking.totalAmount / booking.travelers,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Per Day</span>
                <span className="text-sm">
                  $
                  {Math.round(
                    booking.totalAmount /
                      calculateDuration(booking.startDate, booking.endDate),
                  ).toLocaleString()}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="mt-4 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Status</span>
                  {getPaymentBadge(booking.paymentStatus)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guide Information */}
        {booking.guideRequired && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tour Guide</CardTitle>
              <CardDescription>
                A tour guide has been assigned to this booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {booking.guideAssigned
                      ? booking.guideAssigned
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                      : "TG"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {booking.guideAssigned || "Not yet assigned"}
                  </p>
                  <p className="text-sm text-muted-foreground">Tour Guide</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="customer" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>
              Contact details for {booking.customerName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {booking.customerAvatar ? (
                  <AvatarImage
                    src={booking.customerAvatar}
                    alt={booking.customerName}
                  />
                ) : null}
                <AvatarFallback className="text-lg">
                  {booking.customerName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {booking.customerName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Customer ID: C{booking.id.substring(1)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Contact Information</h4>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${booking.customerEmail}`}
                    className="text-sm hover:underline"
                  >
                    {booking.customerEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${booking.customerPhone}`}
                    className="text-sm hover:underline"
                  >
                    {booking.customerPhone}
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Booking History</h4>
                <div className="text-sm">
                  First booking: {formatDate(booking.createdAt)}
                </div>
                <div className="text-sm">Total trips: 1</div>
              </div>
            </div>

            {booking.specialRequirements && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">
                  Special Requirements
                </h4>
                <p className="text-sm">{booking.specialRequirements}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="itinerary" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Travel Itinerary</CardTitle>
            <CardDescription>Day-by-day breakdown of the trip</CardDescription>
          </CardHeader>
          <CardContent>
            {booking.itinerary && booking.itinerary.length > 0 ? (
              <div className="space-y-4">
                {booking.itinerary.map((day) => (
                  <div key={day.day} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary">
                        {day.day}
                      </div>
                      {day.day < booking.itinerary!.length && (
                        <div className="h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="flex flex-col pb-6">
                      <h4 className="text-sm font-medium">Day {day.day}</h4>
                      <p className="text-sm text-muted-foreground">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No itinerary has been provided for this booking.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notes & Additional Information</CardTitle>
            <CardDescription>
              Internal notes and customer requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Internal Notes</h4>
              {booking.notes ? (
                <p className="text-sm">{booking.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No internal notes have been added.
                </p>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Special Requirements</h4>
              {booking.specialRequirements ? (
                <p className="text-sm">{booking.specialRequirements}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No special requirements have been specified.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
