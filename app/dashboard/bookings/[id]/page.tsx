"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Phone, Ban, Share, Printer } from "lucide-react";
import Link from "next/link";
import { useBooking } from "@/lib/hooks/use-bookings";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Helper function to format date
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to format currency
const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Status badge styling
const getStatusStyles = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "refunded":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    default:
      return "";
  }
};

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  // Fetch booking data
  const { data: booking, isLoading, error } = useBooking(bookingId);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load booking data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/bookings">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Booking #{booking.bookingNumber}
            </h2>
            <p className="text-muted-foreground">
              {formatDate(booking.dates.startDate)} -{" "}
              {formatDate(booking.dates.endDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/bookings/${bookingId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Booking
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/bookings/${bookingId}/contact`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Customer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Booking
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">
                  <Share className="h-4 w-4 mr-2" />
                  Share Booking
                </Link>
              </DropdownMenuItem>
              {booking.status !== "cancelled" && (
                <DropdownMenuItem
                  asChild
                  className="text-red-600 focus:text-red-600"
                >
                  <Link href={`/dashboard/bookings/${bookingId}/cancel`}>
                    <Ban className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <Badge className={getStatusStyles(booking.status)}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Booking Details</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Booking Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destination</CardTitle>
              <CardDescription>{booking.destination.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.destination.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Duration</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.duration} days
                    </p>
                  </div>
                </div>

                {booking.guide && (
                  <div>
                    <h3 className="font-medium">Guide</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {booking.guide.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{booking.guide.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Check-in Date</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.dates.startDate)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Check-out Date</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.dates.endDate)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Adults</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.travelers.adults}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Children</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.travelers.children}
                  </p>
                </div>
                {booking.travelers.infants > 0 && (
                  <div>
                    <h3 className="font-medium">Infants</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.travelers.infants}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">Total Travelers</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.travelers.adults +
                      booking.travelers.children +
                      booking.travelers.infants}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Only show activities if they exist */}
          {booking.activities && booking.activities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
                <CardDescription>
                  Planned activities for this trip
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary pl-4 pb-4"
                    >
                      <h3 className="font-medium">{activity.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {/* {activity.description} */}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Customer Tab */}
        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  {booking.customer.avatar && (
                    <AvatarImage src={booking.customer.avatar} />
                  )}
                  <AvatarFallback>
                    {booking.customer.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">
                    {booking.customer.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.customer.email}
                  </p>
                  {booking.customer.phone && (
                    <p className="text-sm text-muted-foreground">
                      {booking.customer.phone}
                    </p>
                  )}
                  {booking.customer.nationality && (
                    <p className="text-sm text-muted-foreground">
                      Nationality: {booking.customer.nationality}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {booking.customer.address && (
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm">{booking.customer.address.street}</p>
                  <p className="text-sm">
                    {booking.customer.address.city},{" "}
                    {booking.customer.address.state}{" "}
                    {booking.customer.address.postalCode}
                  </p>
                  <p className="text-sm">{booking.customer.address.country}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {booking.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {booking.specialRequests}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>
                Payment status:{" "}
                <span className="capitalize">{booking.payment.status}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Total Amount</h3>
                  <p className="text-xl font-bold">
                    {formatCurrency(
                      booking.payment.totalAmount,
                      booking.payment.currency,
                    )}
                  </p>
                </div>

                {booking.payment.depositAmount &&
                  booking.payment.depositAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Deposit Paid</h3>
                      <p className="text-sm">
                        {formatCurrency(
                          booking.payment.depositAmount,
                          booking.payment.currency,
                        )}
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {booking.payment.transactions &&
            booking.payment.transactions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {booking.payment.transactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium capitalize">
                            {transaction.status}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={
                              transaction.status === "refunded"
                                ? "text-red-600"
                                : ""
                            }
                          >
                            {transaction.status === "refunded" ? "-" : ""}
                            {formatCurrency(
                              transaction.amount,
                              booking.payment.currency,
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {transaction.method}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Notes</CardTitle>
              <CardDescription>
                Internal notes about this booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {booking.notes && booking.notes.length > 0 ? (
                <div className="space-y-4">
                  {booking.notes.map((note, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-muted-foreground/30 pl-4 py-2"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">{note.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(note.date)}
                        </p>
                      </div>
                      <p className="text-sm mt-1">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No notes have been added to this booking.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
