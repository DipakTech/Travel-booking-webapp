"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Ban } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBooking, useUpdateBooking } from "@/lib/hooks/use-bookings";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const cancelFormSchema = z.object({
  reason: z
    .string()
    .min(10, "Cancellation reason must be at least 10 characters"),
  refundType: z.enum(["full", "partial", "none"], {
    required_error: "Please select a refund type",
  }),
});

export default function CancelBookingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch booking data
  const { data: booking, isLoading, error } = useBooking(bookingId);

  // Setup mutation for updating booking
  const updateBooking = useUpdateBooking(bookingId);

  // Initialize form
  const form = useForm<z.infer<typeof cancelFormSchema>>({
    resolver: zodResolver(cancelFormSchema),
    defaultValues: {
      reason: "",
      refundType: "none",
    },
  });

  // Handle form submission
  const handleSubmit = async (data: z.infer<typeof cancelFormSchema>) => {
    setShowConfirmDialog(true);
  };

  // Handle actual cancellation
  const confirmCancellation = async () => {
    setIsCancelling(true);
    setShowConfirmDialog(false);

    const formData = form.getValues();

    try {
      // In a real app, you would send this data to an API endpoint
      const updatedData = {
        status: "cancelled" as "cancelled",
        notes: booking?.notes
          ? [
              ...booking.notes,
              {
                content: `Booking cancelled. Reason: ${formData.reason}. Refund type: ${formData.refundType}`,
                date: new Date(),
                author: "System",
              },
            ]
          : [
              {
                content: `Booking cancelled. Reason: ${formData.reason}. Refund type: ${formData.refundType}`,
                date: new Date(),
                author: "System",
              },
            ],
      };

      await updateBooking.mutateAsync(updatedData);

      toast({
        title: "Booking cancelled",
        description: `Booking #${booking?.bookingNumber} has been cancelled successfully.`,
      });

      router.push(`/dashboard/bookings/${bookingId}`);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "There was a problem cancelling the booking.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
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

  // Check if booking is already cancelled
  if (booking.status === "cancelled") {
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
            <h2 className="text-2xl font-bold tracking-tight">
              Cancel Booking
            </h2>
            <p className="text-muted-foreground">
              Booking #{booking.bookingNumber} - {booking.customer.name}
            </p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Already Cancelled</AlertTitle>
          <AlertDescription>
            This booking has already been cancelled and cannot be cancelled
            again.
          </AlertDescription>
        </Alert>

        <div className="flex justify-end">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/bookings/${bookingId}`}>
              Return to Booking
            </Link>
          </Button>
        </div>
      </div>
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
          <h2 className="text-2xl font-bold tracking-tight">Cancel Booking</h2>
          <p className="text-muted-foreground">
            Booking #{booking.bookingNumber} - {booking.customer.name}
          </p>
        </div>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          You are about to cancel this booking. This action cannot be undone.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
          <CardDescription>
            Review booking details before cancellation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Customer</p>
              <p className="text-sm text-muted-foreground">
                {booking.customer.name}
              </p>
            </div>
            <div>
              <p className="font-medium">Destination</p>
              <p className="text-sm text-muted-foreground">
                {booking.destination.name}
              </p>
            </div>
            <div>
              <p className="font-medium">Dates</p>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.dates.startDate).toLocaleDateString()} to{" "}
                {new Date(booking.dates.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className="text-sm text-muted-foreground capitalize">
                {booking.status}
              </p>
            </div>
            <div>
              <p className="font-medium">Total Amount</p>
              <p className="text-sm text-muted-foreground">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: booking.payment.currency,
                }).format(booking.payment.totalAmount)}
              </p>
            </div>
            <div>
              <p className="font-medium">Payment Status</p>
              <p className="text-sm text-muted-foreground capitalize">
                {booking.payment.status}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cancellation Details</CardTitle>
          <CardDescription>Provide a reason for cancellation</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Cancellation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please explain why this booking is being cancelled..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refundType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Option</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full" id="full-refund" />
                          <FormLabel
                            htmlFor="full-refund"
                            className="font-normal"
                          >
                            Full Refund
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="partial" id="partial-refund" />
                          <FormLabel
                            htmlFor="partial-refund"
                            className="font-normal"
                          >
                            Partial Refund
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="no-refund" />
                          <FormLabel
                            htmlFor="no-refund"
                            className="font-normal"
                          >
                            No Refund
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/bookings/${bookingId}`)}
              >
                Return to Booking
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isCancelling}
              >
                {isCancelling && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Ban className="mr-2 h-4 w-4" />
                Cancel Booking
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              <span className="font-medium">Booking:</span> #
              {booking.bookingNumber}
            </p>
            <p className="text-sm">
              <span className="font-medium">Customer:</span>{" "}
              {booking.customer.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Refund type:</span>{" "}
              {form.getValues("refundType")}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
