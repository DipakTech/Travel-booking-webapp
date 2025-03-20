import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Download } from "lucide-react";
import { Metadata } from "next";
import { ReviewList } from "@/components/dashboard/reviews/ReviewList";

export const metadata: Metadata = {
  title: "Reviews | Travel Booking Dashboard",
  description: "Manage all customer reviews for guides and destinations",
};

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer reviews for guides and destinations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/dashboard/reviews/new">
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
          <CardDescription>
            View and manage all customer reviews. Filter by type or status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 w-[400px]">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <ReviewList type="all" />
            </TabsContent>
            <TabsContent value="guides" className="mt-6">
              <ReviewList type="guides" />
            </TabsContent>
            <TabsContent value="destinations" className="mt-6">
              <ReviewList type="destinations" />
            </TabsContent>
            <TabsContent value="flagged" className="mt-6">
              <ReviewList type="flagged" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
