"use client";

import { BookingForm } from "@/components/dashboard/bookings/BookingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateBooking } from "@/lib/hooks/use-bookings";
import { toast } from "sonner";

export default function NewBookingPage() {
  const router = useRouter();
  const { mutate: createBooking, isPending } = useCreateBooking();

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
          createBooking(data, {
            onSuccess: () => {
              toast.success("Booking created successfully");
              router.push("/dashboard/bookings");
              router.refresh();
            },
            onError: (error) => {
              toast.error(error.message || "Failed to create booking");
            },
          });
        }}
        isSubmitting={isPending}
      />
    </div>
  );
}
