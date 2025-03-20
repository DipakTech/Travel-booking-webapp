import { Metadata } from "next";
import { BookingForm } from "@/components/dashboard/bookings/BookingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New Booking | Travel Booking Dashboard",
  description: "Create a new booking",
};

export default function NewBookingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">New Booking</h2>
          <p className="text-muted-foreground">
            Create a new booking for a customer
          </p>
        </div>
      </div>

      <BookingForm
        onSubmit={(data) => {
          // In a real application, this would send the data to an API
          console.log(data);
          // And then redirect to the bookings list
        }}
      />
    </div>
  );
}
