"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, CheckCircle, XCircle, Flag, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Review {
  id: string;
  type: "guide" | "destination";
  entityId: string;
  entityName: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  response: string | null;
}

interface ReviewListProps {
  type: "all" | "guides" | "destinations" | "flagged";
}

export function ReviewList({ type }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.reviews || []);
      setError(null);
    } catch (err) {
      setError("Error loading reviews. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((review) => review.id));
    }
  };

  const toggleSelectReview = (id: string) => {
    if (selectedReviews.includes(id)) {
      setSelectedReviews(selectedReviews.filter((reviewId) => reviewId !== id));
    } else {
      setSelectedReviews([...selectedReviews, id]);
    }
  };

  const handleBulkAction = async (
    action: "approve" | "reject" | "flag" | "delete",
  ) => {
    try {
      setLoading(true);
      // In a real app, this would be a bulk API call
      await Promise.all(
        selectedReviews.map((id) =>
          fetch("/api/reviews", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              status:
                action === "delete"
                  ? "deleted"
                  : action === "approve"
                  ? "approved"
                  : action === "reject"
                  ? "rejected"
                  : "flagged",
            }),
          }),
        ),
      );

      // Update local state based on action
      if (action === "delete") {
        setReviews(
          reviews.filter((review) => !selectedReviews.includes(review.id)),
        );
      } else {
        setReviews(
          reviews.map((review) => {
            if (selectedReviews.includes(review.id)) {
              return {
                ...review,
                status:
                  action === "approve"
                    ? "approved"
                    : action === "reject"
                    ? "rejected"
                    : "flagged",
              };
            }
            return review;
          }),
        );
      }

      setSelectedReviews([]);
    } catch (err) {
      setError("Failed to process reviews. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
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
              "h-4 w-4",
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return <div className="flex justify-center py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedReviews.length > 0 && (
        <div className="bg-muted p-2 rounded-md flex items-center justify-between">
          <span>{selectedReviews.length} reviews selected</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("approve")}
              className="text-green-600"
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("reject")}
              className="text-red-600"
            >
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("flag")}
              className="text-orange-600"
            >
              <Flag className="h-4 w-4 mr-1" /> Flag
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("delete")}
              className="text-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    selectedReviews.length === reviews.length &&
                    reviews.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead className="hidden md:table-cell">For</TableHead>
              <TableHead className="hidden md:table-cell">Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedReviews.includes(review.id)}
                    onCheckedChange={() => toggleSelectReview(review.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.userAvatar}
                        alt={review.userName}
                      />
                      <AvatarFallback>
                        {review.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium truncate max-w-[120px]">
                      {review.userName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {review.entityName}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {review.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {renderStars(review.rating)}
                </TableCell>
                <TableCell>
                  <p className="truncate max-w-[200px] text-sm">
                    {review.comment}
                  </p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/reviews/${review.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("approve")}
                        className="text-green-600"
                      >
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("reject")}
                        className="text-red-600"
                      >
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("flag")}
                        className="text-orange-600"
                      >
                        Flag
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("delete")}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
