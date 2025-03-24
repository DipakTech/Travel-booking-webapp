import { Metadata } from "next";
import { BookingDashboardContent } from "@/components/dashboard/bookings/BookingDashboardContent";

export const metadata: Metadata = {
  title: "Bookings Management",
  description:
    "Manage your travel bookings, view statistics, and track reservations.",
};

export default function BookingsPage() {
  return <BookingDashboardContent />;
}
