"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Mock bookings data
const mockBookings = [
  {
    id: "1",
    customer: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
    },
    destination: "Paris, France",
    startDate: "2023-11-15",
    endDate: "2023-11-22",
    status: "confirmed",
    travelers: 2,
    totalAmount: 2450,
    paymentStatus: "paid",
  },
  {
    id: "2",
    customer: {
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "+1 (555) 987-6543",
    },
    destination: "Tokyo, Japan",
    startDate: "2023-12-05",
    endDate: "2023-12-15",
    status: "pending",
    travelers: 1,
    totalAmount: 3200,
    paymentStatus: "deposit",
  },
];

// Form schema
const cancelFormSchema = z.object({
  reason: z.enum(
    ["customer_request", "emergency", "scheduling_conflict", "other"],
    {
      required_error: "Please select a cancellation reason.",
    },
  ),
  refundAmount: z.number().min(0, {
    message: "Refund amount cannot be negative.",
  }),
  notes: z.string().min(10, {
    message: "Notes must be at least 10 characters.",
  }),
});

export default function CancelBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<(typeof mockBookings)[0] | undefined>(
    undefined,
  );

  // Find the booking by ID
  useEffect(() => {
    const foundBooking = mockBookings.find((b) => b.id === params.id);
    if (!foundBooking) {
      router.push("/dashboard/bookings");
    } else {
      setBooking(foundBooking);
    }
  }, [params.id, router]);

  // Calculate default refund amount (75% of total if status is confirmed)
  const defaultRefundAmount = booking
    ? booking.status === "confirmed"
      ? Math.round(booking.totalAmount * 0.75)
      : booking.totalAmount
    : 0;

  // Initialize form
  const form = useForm<z.infer<typeof cancelFormSchema>>({
    resolver: zodResolver(cancelFormSchema),
    defaultValues: {
      reason: "customer_request",
      refundAmount: defaultRefundAmount,
      notes: "",
    },
  });

  // Update form values when booking is loaded
  useEffect(() => {
    if (booking) {
      form.setValue("refundAmount", defaultRefundAmount);
    }
  }, [booking, defaultRefundAmount, form]);

  async function onSubmit(values: z.infer<typeof cancelFormSchema>) {
    if (!booking) return;

    setIsSubmitting(true);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      toast({
        title: "Booking cancelled",
        description: `The booking for ${booking.customer.name} has been cancelled.`,
      });

      // Redirect back to booking details
      router.push(`/dashboard/bookings/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was a problem cancelling the booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-10">Loading booking details...</div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link
          href={`/dashboard/bookings/${params.id}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to booking details
        </Link>
      </div>

      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cancel Booking</h1>
          <p className="text-muted-foreground">
            Cancel the booking for {booking.customer.name} to{" "}
            {booking.destination}
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Cancelling this booking will notify the customer. This action cannot
            be undone.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
            <CardDescription>
              Review the booking details before cancellation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <h3 className="font-medium">Customer</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {booking.customer.name}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Destination</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {booking.destination}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Travel Period</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(booking.startDate)} -{" "}
                    {formatDate(booking.endDate)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Total Amount</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${booking.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <h3 className="font-medium">Status</h3>
                  <div className="mt-1">
                    <Badge
                      variant={
                        booking.status === "confirmed" ? "default" : "outline"
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Payment</h3>
                  <div className="mt-1">
                    <Badge
                      variant={
                        booking.paymentStatus === "paid" ? "success" : "warning"
                      }
                    >
                      {booking.paymentStatus.charAt(0).toUpperCase() +
                        booking.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Travelers</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {booking.travelers}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancellation Details</CardTitle>
            <CardDescription>
              Provide details about the cancellation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Reason</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cancellation reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="customer_request">
                            Customer Request
                          </SelectItem>
                          <SelectItem value="emergency">
                            Emergency / Force Majeure
                          </SelectItem>
                          <SelectItem value="scheduling_conflict">
                            Scheduling Conflict
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refundAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Amount ($)</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min={0}
                          max={booking.totalAmount}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Maximum refund amount: $
                        {booking.totalAmount.toLocaleString()}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter details about the cancellation..."
                          className="h-32 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/bookings/${params.id}`)
                    }
                  >
                    Keep Booking
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Cancelling...
                      </span>
                    ) : (
                      <span className="flex items-center">Cancel Booking</span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
