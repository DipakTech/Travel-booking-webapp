"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  CreditCard,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

// Mock data - in a real app, this would come from a database fetch
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
    notes: "Customer requested vegetarian meals throughout the trek.",
    guideRequired: true,
    guideAssigned: "John Sherpa",
    specialRequirements:
      "Vegetarian meals required. Extra oxygen tanks for high altitude.",
  },
];

// Validation schema
const formSchema = z.object({
  destinationName: z.string().min(1, {
    message: "Destination name is required",
  }),
  location: z.string().min(1, {
    message: "Location is required",
  }),
  customerName: z.string().min(1, {
    message: "Customer name is required",
  }),
  customerEmail: z.string().email({
    message: "Invalid email address",
  }),
  customerPhone: z.string().min(1, {
    message: "Phone number is required",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  travelers: z.coerce.number().int().min(1, {
    message: "At least 1 traveler is required",
  }),
  totalAmount: z.coerce.number().min(0, {
    message: "Total amount must be a positive number",
  }),
  status: z.enum(["confirmed", "pending", "cancelled"], {
    required_error: "Status is required",
  }),
  paymentStatus: z.enum(["paid", "pending", "refunded"], {
    required_error: "Payment status is required",
  }),
  notes: z.string().optional(),
  guideRequired: z.boolean().default(false),
  guideAssigned: z.string().optional(),
  specialRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // In a real app, you would fetch the booking data from an API
  useEffect(() => {
    const fetchedBooking = bookings.find((b) => b.id === params.id);

    if (fetchedBooking) {
      setBooking(fetchedBooking);
    }

    setLoading(false);
  }, [params.id]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinationName: booking?.destinationName || "",
      location: booking?.location || "",
      customerName: booking?.customerName || "",
      customerEmail: booking?.customerEmail || "",
      customerPhone: booking?.customerPhone || "",
      startDate: booking?.startDate ? new Date(booking.startDate) : undefined,
      endDate: booking?.endDate ? new Date(booking.endDate) : undefined,
      travelers: booking?.travelers || 1,
      totalAmount: booking?.totalAmount || 0,
      status:
        (booking?.status as "confirmed" | "pending" | "cancelled") || "pending",
      paymentStatus:
        (booking?.paymentStatus as "paid" | "pending" | "refunded") ||
        "pending",
      notes: booking?.notes || "",
      guideRequired: booking?.guideRequired || false,
      guideAssigned: booking?.guideAssigned || "",
      specialRequirements: booking?.specialRequirements || "",
    },
  });

  // Update form values when booking data is loaded
  useEffect(() => {
    if (booking) {
      form.reset({
        destinationName: booking.destinationName,
        location: booking.location,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
        travelers: booking.travelers,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        notes: booking.notes || "",
        guideRequired: booking.guideRequired || false,
        guideAssigned: booking.guideAssigned || "",
        specialRequirements: booking.specialRequirements || "",
      });
    }
  }, [booking, form]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  function onSubmit(data: FormValues) {
    setIsSaving(true);

    // In a real app, you would send the data to an API
    console.log("Updating booking with data:", data);

    // Simulate API delay
    setTimeout(() => {
      setIsSaving(false);
      router.push(`/dashboard/bookings/${params.id}`);
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/bookings/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Edit Booking #{booking.id}
            </h2>
            <p className="text-muted-foreground">
              Update booking details and customer information
            </p>
          </div>
        </div>
        <Button type="submit" form="booking-form" disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Form {...form}>
        <form
          id="booking-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Destination Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Destination Information</CardTitle>
                <CardDescription>
                  Update the destination details for this booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="destinationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter destination name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="travelers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Travelers</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Update customer contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Booking Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>
                Update the status and additional details of this booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select booking status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="guideRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Guide Required</FormLabel>
                      <FormDescription>
                        Check if the customer requires a guide for this booking
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("guideRequired") && (
                <FormField
                  control={form.control}
                  name="guideAssigned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned Guide</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter assigned guide's name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="specialRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any special requirements or accommodation needs"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes about this booking"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/bookings/${params.id}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
