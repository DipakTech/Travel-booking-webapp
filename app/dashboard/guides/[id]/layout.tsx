import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide Details | Travel Booking Dashboard",
  description: "View and manage guide details",
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
