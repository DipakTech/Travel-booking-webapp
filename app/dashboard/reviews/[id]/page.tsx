"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Review } from "@/components/dashboard/reviews/ReviewList";
import { ReviewResponseForm } from "@/components/dashboard/reviews/ReviewResponseForm";

export default function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?id=${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch review");
        }
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setReview(data.reviews[0]);
        } else {
          notFound();
        }
      } catch (err) {
        setError("Error loading review. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [params.id]);

  const handleStatusChange = async (status: Review["status"]) => {
    if (!review) return;

    try {
      setActionLoading(true);
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: review.id,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review status");
      }

      setReview({
        ...review,
        status,
      });
    } catch (err) {
      setError("Failed to update review status. Please try again.");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!review) return;

    try {
      setActionLoading(true);
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: review.id,
          status: "deleted",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      router.push("/dashboard/reviews");
    } catch (err) {
      setError("Failed to delete review. Please try again.");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResponseSubmit = async (data: { response: string }) => {
    if (!review) return;

    try {
      setActionLoading(true);
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: review.id,
          response: data.response,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit response");
      }

      setReview({
        ...review,
        response: data.response,
      });

      return true;
    } catch (err) {
      setError("Failed to submit response. Please try again.");
      console.error(err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: Review["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      case "flagged":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200"
          >
            Flagged
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-5 w-5",
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/reviews">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertTriangle className="h-10 w-10 text-orange-500 mb-4" />
              <h2 className="text-xl font-semibold">Error Loading Review</h2>
              <p className="text-muted-foreground mt-2">
                {error || "Review not found"}
              </p>
              <Button className="mt-6" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/reviews">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {review.status !== "approved" && (
            <Button
              size="sm"
              variant="outline"
              className="text-green-600"
              onClick={() => handleStatusChange("approved")}
              disabled={actionLoading}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          )}
          {review.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600"
              onClick={() => handleStatusChange("rejected")}
              disabled={actionLoading}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          )}
          {review.status !== "flagged" && (
            <Button
              size="sm"
              variant="outline"
              className="text-orange-600"
              onClick={() => handleStatusChange("flagged")}
              disabled={actionLoading}
            >
              <Flag className="h-4 w-4 mr-1" />
              Flag
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600"
                disabled={actionLoading}
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Review</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 focus:ring-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Review Details Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{review.entityName}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <span className="capitalize mr-2">{review.type}</span>
                  {getStatusBadge(review.status)}
                </CardDescription>
              </div>
              <div>{renderStars(review.rating)}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={review.userAvatar} alt={review.userName} />
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.userName}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(review.date).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4 bg-muted/40">
              <p className="whitespace-pre-line">{review.comment}</p>
            </div>
          </CardContent>
        </Card>

        {/* Management Response Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Management Response</CardTitle>
            <CardDescription>
              {review.response
                ? "The response shown to the customer"
                : "Respond to this review to address customer feedback"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {review.response ? (
              <div className="rounded-md border p-4 bg-muted/40">
                <p className="whitespace-pre-line">{review.response}</p>
              </div>
            ) : (
              <ReviewResponseForm
                reviewId={review.id}
                onSuccess={handleResponseSubmit}
              />
            )}
          </CardContent>
          {review.response && (
            <CardFooter className="justify-end pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReview({ ...review, response: null })}
              >
                Edit Response
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Entity Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {review.type === "guide" ? "Guide" : "Destination"} Details
            </CardTitle>
            <CardDescription>
              Additional information about the {review.type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{review.entityName}</span>
                <Link
                  href={`/dashboard/${
                    review.type === "guide" ? "guides" : "destinations"
                  }/${review.entityId}`}
                >
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </Link>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ID:</span>
                <span>{review.entityId}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{review.type}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Timeline</CardTitle>
            <CardDescription>History of changes to this review</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-muted-foreground/20 ml-3 space-y-6">
              <li className="mb-6 ml-6">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-green-500"></div>
                <h3 className="mb-1 flex items-center text-sm font-semibold">
                  Review Submitted
                  <Badge
                    variant="outline"
                    className="ml-2 bg-green-50 text-green-600 border-green-200"
                  >
                    Created
                  </Badge>
                </h3>
                <time className="mb-2 block text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleString()}
                </time>
                <p className="text-sm text-muted-foreground">
                  Customer submitted a {review.rating}-star review
                </p>
              </li>

              {/* Status change examples - in a real app these would be from history data */}
              {review.status === "flagged" && (
                <li className="mb-6 ml-6">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-orange-500"></div>
                  <h3 className="mb-1 flex items-center text-sm font-semibold">
                    Review Flagged
                    <Badge
                      variant="outline"
                      className="ml-2 bg-orange-50 text-orange-600 border-orange-200"
                    >
                      Flagged
                    </Badge>
                  </h3>
                  <time className="mb-2 block text-xs text-muted-foreground">
                    {new Date(
                      new Date(review.date).getTime() + 24 * 60 * 60 * 1000,
                    ).toLocaleString()}
                  </time>
                  <p className="text-sm text-muted-foreground">
                    Review was flagged for further investigation
                  </p>
                </li>
              )}

              {review.status === "approved" && (
                <li className="mb-6 ml-6">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-green-500"></div>
                  <h3 className="mb-1 flex items-center text-sm font-semibold">
                    Review Approved
                    <Badge
                      variant="outline"
                      className="ml-2 bg-green-50 text-green-600 border-green-200"
                    >
                      Approved
                    </Badge>
                  </h3>
                  <time className="mb-2 block text-xs text-muted-foreground">
                    {new Date(
                      new Date(review.date).getTime() + 36 * 60 * 60 * 1000,
                    ).toLocaleString()}
                  </time>
                  <p className="text-sm text-muted-foreground">
                    Review was approved and published
                  </p>
                </li>
              )}

              {review.response && (
                <li className="mb-6 ml-6">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-blue-500"></div>
                  <h3 className="mb-1 flex items-center text-sm font-semibold">
                    Response Added
                    <Badge
                      variant="outline"
                      className="ml-2 bg-blue-50 text-blue-600 border-blue-200"
                    >
                      Response
                    </Badge>
                  </h3>
                  <time className="mb-2 block text-xs text-muted-foreground">
                    {new Date(
                      new Date(review.date).getTime() + 48 * 60 * 60 * 1000,
                    ).toLocaleString()}
                  </time>
                  <p className="text-sm text-muted-foreground">
                    Management response was added to the review
                  </p>
                </li>
              )}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
