import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destination Details | Travel Booking Dashboard",
  description: "View and manage destination details",
};

export default function DestinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
