"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useCreateGuide } from "@/lib/hooks/use-guides";
import { GuideForm } from "@/components/dashboard/guides/GuideForm";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = {
  title: "Add New Guide | Travel Booking Dashboard",
  description: "Add a new tour guide to the system",
};

export default function AddGuidePage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Add New Guide"
        text="Create a new guide profile with all necessary details."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/guides">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Guides
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Guide Information</CardTitle>
          <CardDescription>
            Enter the guide&apos;s details. All fields marked with * are
            required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <AddGuideForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function AddGuideForm() {
  const router = useRouter();
  const { mutate: createGuide, isPending } = useCreateGuide();

  const handleSubmit = async (data: any) => {
    createGuide(data, {
      onSuccess: () => {
        router.push("/dashboard/guides");
      },
    });
  };

  return <GuideForm onSubmit={handleSubmit} isLoading={isPending} />;
}
