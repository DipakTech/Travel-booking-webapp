"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDestinations } from "@/lib/hooks/use-destinations";
import { useGuides } from "@/lib/hooks/use-guides";
import { Booking, bookingSchema } from "@/lib/schema/booking";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = bookingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

type FormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  booking?: Booking;
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
}

// Define destination and guide types that include the properties we need
interface FormDestination {
  id: string;
  name: string;
  title?: string; // Some APIs might return title instead of name
}

interface FormGuide {
  id: string;
  name: string;
}

export function BookingForm({
  booking,
  onSubmit,
  isSubmitting = false,
}: BookingFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const { data: destinationsData, isLoading: isLoadingDestinations } =
    useDestinations();
  const { data: guidesData, isLoading: isLoadingGuides } = useGuides();

  // Ensure guides and destinations are always treated as arrays and have the right shape
  const guides: FormGuide[] =
    guidesData?.guides?.map((guide) => ({
      id: guide.id || "", // Ensure id is a string, not undefined
      name: guide.name || "Unknown Guide",
    })) || [];

  const destinations: FormDestination[] =
    destinationsData?.destinations?.map((dest) => ({
      id: dest.id || "", // Ensure id is a string, not undefined
      name: dest.title || "Unknown Destination", // Some APIs might use title instead of name
    })) || [];

  // Initialize form with default values or existing booking data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: booking || {
      bookingNumber: `B${Math.floor(Math.random() * 90000) + 10000}`,
      status: "pending",
      customer: {
        id: "",
        name: "",
        email: "",
        phone: "",
      },
      destination: {
        id: "",
        name: "",
      },
      dates: {
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      duration: 7,
      travelers: {
        adults: 1,
        children: 0,
        infants: 0,
        total: 1,
      },
      payment: {
        totalAmount: 0,
        currency: "USD",
        status: "pending",
      },
    },
  });

  // Update total travelers when adults, children, or infants change
  const watchAdults = form.watch("travelers.adults");
  const watchChildren = form.watch("travelers.children");
  const watchInfants = form.watch("travelers.infants");

  // Update total travelers when individual counts change
  const updateTotalTravelers = () => {
    const total =
      (watchAdults || 0) + (watchChildren || 0) + (watchInfants || 0);
    form.setValue("travelers.total", total);
  };

  // Update total when any traveler count changes
  useState(() => {
    updateTotalTravelers();
  });

  const handleSubmit = (data: FormValues) => {
    console.log(data);
    // Update total travelers before submission
    updateTotalTravelers();

    // Ensure dates are Date objects
    if (data.dates) {
      if (data.dates.startDate && !(data.dates.startDate instanceof Date)) {
        data.dates.startDate = new Date(data.dates.startDate);
      }
      if (data.dates.endDate && !(data.dates.endDate instanceof Date)) {
        data.dates.endDate = new Date(data.dates.endDate);
      }
    }

    // Convert other dates (accommodations, transportation, etc.)
    if (data.accommodations) {
      data.accommodations = data.accommodations.map((accommodation) => ({
        ...accommodation,
        checkIn: accommodation.checkIn
          ? new Date(accommodation.checkIn)
          : undefined,
        checkOut: accommodation.checkOut
          ? new Date(accommodation.checkOut)
          : undefined,
      }));
    }

    if (data.transportation) {
      data.transportation = data.transportation.map((transport) => ({
        ...transport,
        departureDate: transport.departureDate
          ? new Date(transport.departureDate)
          : undefined,
        arrivalDate: transport.arrivalDate
          ? new Date(transport.arrivalDate)
          : undefined,
      }));
    }

    if (data.activities) {
      data.activities = data.activities.map((activity) => ({
        ...activity,
        date: activity.date ? new Date(activity.date) : new Date(),
      }));
    }

    if (data.payment) {
      if (data.payment.balanceDueDate) {
        data.payment.balanceDueDate = new Date(data.payment.balanceDueDate);
      }
      if (data.payment.transactions) {
        data.payment.transactions = data.payment.transactions.map(
          (transaction) => ({
            ...transaction,
            date: transaction.date ? new Date(transaction.date) : new Date(),
          }),
        );
      }
    }

    if (data.documents) {
      data.documents = data.documents.map((document) => ({
        ...document,
        uploadDate: document.uploadDate
          ? new Date(document.uploadDate)
          : new Date(),
      }));
    }

    if (data.notes) {
      data.notes = data.notes.map((note) => ({
        ...note,
        date: note.date ? new Date(note.date) : new Date(),
      }));
    }

    // Do not allow undefined values for required fields
    if (data.customer && !data.customer.name) {
      data.customer.name = ""; // Empty string instead of undefined
    }

    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="travelers">Travelers</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bookingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customer.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Destination & Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="destination.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Find destination name based on ID
                          const selected = destinations.find(
                            (d) => d.id === value,
                          );
                          if (selected) {
                            form.setValue("destination.name", selected.name);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingDestinations ? (
                            <div className="flex justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            destinations.map((destination) => (
                              <SelectItem
                                key={destination.id}
                                value={destination.id}
                              >
                                {destination.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guide.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guide (Optional)</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Find guide name based on ID
                          const selected = guides.find((g) => g.id === value);
                          if (selected) {
                            form.setValue("guide.name", selected.name);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select guide" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingGuides ? (
                            <div className="flex justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            guides.map((guide) => (
                              <SelectItem key={guide.id} value={guide.id}>
                                {guide.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dates.startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                          date={
                            field.value ? new Date(field.value) : new Date()
                          }
                          setDate={(date) => field.onChange(date)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dates.endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <DatePicker
                          date={
                            field.value ? new Date(field.value) : new Date()
                          }
                          setDate={(date) => field.onChange(date)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value ? parseFloat(value) : undefined,
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travelers Tab */}
          <TabsContent value="travelers" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Traveler Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="travelers.adults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adults</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                              setTimeout(updateTotalTravelers, 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="travelers.children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Children (2-12)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                              setTimeout(updateTotalTravelers, 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="travelers.infants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Infants (0-2)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                              setTimeout(updateTotalTravelers, 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="travelers.total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Travelers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          readOnly
                          className="bg-muted"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements or requests..."
                          className="min-h-32"
                          {...field}
                          value={field.value?.join("\n") || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value) {
                              field.onChange(value.split("\n").filter(Boolean));
                            } else {
                              field.onChange([]);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activities & Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This section will be expanded in a future update to allow
                  adding and managing activities, accommodations, and
                  transportation.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="payment.totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? parseFloat(value) : 0);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payment.currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="payment.status"
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment.depositAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Amount (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value ? parseFloat(value) : undefined,
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment.depositPaid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Deposit Paid</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Navigate to previous tab or stay on first tab
              const tabs = ["basic", "travelers", "itinerary", "payment"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
            disabled={activeTab === "basic"}
          >
            Previous
          </Button>

          <Button
            type="button"
            onClick={() => {
              // Navigate to next tab or submit if on last tab
              const tabs = ["basic", "travelers", "itinerary", "payment"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              } else {
                form.handleSubmit(handleSubmit)();
              }
            }}
          >
            {activeTab === "payment" ? "Submit" : "Next"}
          </Button>

          {activeTab === "payment" && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {booking ? "Update Booking" : "Create Booking"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
