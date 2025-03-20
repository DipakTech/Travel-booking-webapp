import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SearchX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReviewNotFound() {
  return (
    <div className="space-y-6">
      <Link href="/dashboard/reviews">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Button>
      </Link>

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <SearchX className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Review Not Found</CardTitle>
          <CardDescription>
            The review you are looking for does not exist or has been removed
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="space-y-2 text-center mb-6">
            <p className="text-muted-foreground">
              Check if you have the correct review ID or browse all reviews to
              find what you&apos;re looking for.
            </p>
          </div>
          <Link href="/dashboard/reviews">
            <Button>View All Reviews</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
