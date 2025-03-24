import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Guides | Expert Local Guides",
  description:
    "Connect with certified local guides who will help you explore safely and authentically. Find the perfect guide for your next adventure.",
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
