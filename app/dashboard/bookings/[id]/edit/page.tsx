"use client";

import { useParams, useRouter } from "next/navigation";
import { BookingForm } from "@/components/dashboard/bookings/BookingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useBooking, useUpdateBooking } from "@/lib/hooks/use-bookings";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function EditBookingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { toast } = useToast();

  // Fetch booking data
  const { data: booking, isLoading, error } = useBooking(bookingId);

  // Setup mutation for updating booking
  const updateBooking = useUpdateBooking(bookingId);

  // Handle form submission
  const handleSubmit = async (data: any) => {
    try {
      await updateBooking.mutateAsync(data);
      toast({
        title: "Booking updated",
        description: "The booking has been successfully updated.",
      });
      router.push(`/dashboard/bookings/${bookingId}`);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: "There was a problem updating the booking.",
        variant: "destructive",
      });
    }
  };

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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/bookings/${bookingId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Booking</h2>
          <p className="text-muted-foreground">
            Booking #{booking.bookingNumber}
          </p>
        </div>
      </div>

      <BookingForm
        booking={booking}
        onSubmit={handleSubmit}
        isSubmitting={updateBooking.isPending}
      />
    </div>
  );
}
