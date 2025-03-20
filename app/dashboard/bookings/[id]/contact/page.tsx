"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  },
];

// Form schema
const contactFormSchema = z.object({
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  contactMethod: z.enum(["email", "sms", "both"], {
    required_error: "Please select a contact method.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactBookingPage({
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

  // Initialize form
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: booking
        ? `Information about your booking to ${booking.destination}`
        : "",
      contactMethod: "email",
      message: "",
    },
  });

  // Update form values when booking is loaded
  useEffect(() => {
    if (booking) {
      form.setValue(
        "subject",
        `Information about your booking to ${booking.destination}`,
      );
    }
  }, [booking, form]);

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    if (!booking) return;

    setIsSubmitting(true);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${booking.customer.name}.`,
      });

      // Redirect back to booking details
      router.push(`/dashboard/bookings/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold tracking-tight">
            Contact Customer
          </h1>
          <p className="text-muted-foreground">
            Send a message to {booking.customer.name} regarding their booking to{" "}
            {booking.destination}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>
              Review the customer&apos;s contact information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">Name</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {booking.customer.name}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {booking.customer.email}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {booking.customer.phone}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
            <CardDescription>
              Compose your message to the customer.
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contact method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="both">Both Email & SMS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your message here..."
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
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
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
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </span>
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
