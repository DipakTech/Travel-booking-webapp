import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { GuideList } from "@/components/dashboard/guides/GuideList";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GuideStats } from "@/components/dashboard/guides/GuideStats";
import { TopRatedGuides } from "@/components/dashboard/guides/TopRatedGuides";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Guides | Travel Booking Dashboard",
  description: "Manage all guides and their profiles",
};

export default function GuidesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Guides"
        text="Manage guide profiles, view stats, and add new guides."
      >
        <Button asChild>
          <Link href="/dashboard/guides/add">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Guide
          </Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <GuideStats />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">All Guides</h2>
          <Suspense fallback={<Skeleton className="h-[450px] w-full" />}>
            <GuideList />
          </Suspense>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Rated Guides</h2>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <TopRatedGuides />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton className="h-28 w-full" key={i} />
      ))}
    </>
  );
}
