"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Send } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBooking } from "@/lib/hooks/use-bookings";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Email form schema
const emailFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  includeBookingDetails: z.boolean().default(true),
});

// SMS form schema
const smsFormSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(160, "SMS messages are limited to 160 characters"),
});

export default function ContactCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("email");
  const [isSending, setIsSending] = useState(false);

  // Fetch booking data
  const { data: booking, isLoading, error } = useBooking(bookingId);

  // Email form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      subject: "",
      message: "",
      includeBookingDetails: true,
    },
  });

  // SMS form
  const smsForm = useForm<z.infer<typeof smsFormSchema>>({
    resolver: zodResolver(smsFormSchema),
    defaultValues: {
      message: "",
    },
  });

  // Handle email submission
  const handleEmailSubmit = async (data: z.infer<typeof emailFormSchema>) => {
    setIsSending(true);

    try {
      // In a real app, you would send this data to an API endpoint
      console.log("Sending email:", {
        to: booking?.customer.email,
        subject: data.subject,
        message: data.message,
        includeBookingDetails: data.includeBookingDetails,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Email sent",
        description: `Email successfully sent to ${booking?.customer.name}.`,
      });

      router.push(`/dashboard/bookings/${bookingId}`);
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "There was a problem sending the email.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle SMS submission
  const handleSMSSubmit = async (data: z.infer<typeof smsFormSchema>) => {
    setIsSending(true);

    try {
      // In a real app, you would send this data to an API endpoint
      console.log("Sending SMS:", {
        to: booking?.customer.phone,
        message: data.message,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "SMS sent",
        description: `SMS successfully sent to ${booking?.customer.name}.`,
      });

      router.push(`/dashboard/bookings/${bookingId}`);
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast({
        title: "Error",
        description: "There was a problem sending the SMS.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
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

  // Check if we have contact information
  const hasEmail = Boolean(booking.customer.email);
  const hasPhone = Boolean(booking.customer.phone);

  // If neither email nor phone are available
  if (!hasEmail && !hasPhone) {
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
              Contact Customer
            </h2>
            <p className="text-muted-foreground">
              Booking #{booking.bookingNumber} - {booking.customer.name}
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Contact Information</AlertTitle>
          <AlertDescription>
            This customer does not have any contact information available.
            Please update the booking with valid contact details.
          </AlertDescription>
        </Alert>

        <div className="flex justify-end">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/bookings/${bookingId}/edit`}>
              Update Customer Information
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
          <h2 className="text-2xl font-bold tracking-tight">
            Contact Customer
          </h2>
          <p className="text-muted-foreground">
            Booking #{booking.bookingNumber} - {booking.customer.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Contact Information</CardTitle>
          <CardDescription>
            Available methods to contact this customer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasEmail && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{booking.customer.email}</span>
            </div>
          )}
          {hasPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{booking.customer.phone}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="email" disabled={!hasEmail}>
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" disabled={!hasPhone}>
            SMS
          </TabsTrigger>
        </TabsList>

        {/* Email Tab */}
        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Email</CardTitle>
              <CardDescription>Send an email to the customer</CardDescription>
            </CardHeader>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email subject..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message here..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={emailForm.control}
                    name="includeBookingDetails"
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
                          <FormLabel>Include booking details</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSending || !hasEmail}>
                    {isSending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send SMS</CardTitle>
              <CardDescription>
                Send an SMS to the customer's phone
              </CardDescription>
            </CardHeader>
            <Form {...smsForm}>
              <form onSubmit={smsForm.handleSubmit(handleSMSSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={smsForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (160 characters max)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message here..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground pt-1">
                          {field.value.length}/160 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Message Templates</FormLabel>
                    <RadioGroup
                      defaultValue="none"
                      onValueChange={(value) => {
                        if (value === "none") return;
                        smsForm.setValue("message", value);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="none" />
                        <FormLabel htmlFor="none">None</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={`Hello ${booking.customer.name}, your booking #${booking.bookingNumber} has been confirmed. Thank you for choosing our service!`}
                          id="confirmation"
                        />
                        <FormLabel htmlFor="confirmation">
                          Booking Confirmation
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={`Hello ${booking.customer.name}, this is a reminder that your trip to ${booking.destination.name} begins in 3 days. Please contact us if you have any questions.`}
                          id="reminder"
                        />
                        <FormLabel htmlFor="reminder">Trip Reminder</FormLabel>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSending || !hasPhone}>
                    {isSending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Send className="mr-2 h-4 w-4" />
                    Send SMS
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
