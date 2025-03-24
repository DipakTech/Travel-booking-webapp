import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Review,
  useReview,
  useRespondToReview,
  useUpdateReview,
  useModerateReview,
  useDeleteReview,
  useCreateReview,
} from "@/lib/hooks/use-reviews";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewReviewForm } from "./NewReviewForm";
import { toast } from "sonner";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId?: string;
  entityId?: string;
  entityType?: "destination" | "guide";
  entityName?: string;
  mode?: "view" | "create";
  onSuccess?: () => void;
}

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch (error) {
    return dateString;
  }
}

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export default function ReviewModal({
  open,
  onOpenChange,
  reviewId,
  entityId,
  entityType,
  entityName,
  mode = "view",
  onSuccess,
}: ReviewModalProps) {
  const { data: session } = useSession();
  const [responseText, setResponseText] = useState("");
  const createReview = useCreateReview();

  const user = session?.user as ExtendedUser | undefined;
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff" || isAdmin;

  const { data: review, isLoading } = useReview(
    mode === "view" ? reviewId : undefined,
  );

  const respondMutation = useRespondToReview();
  const updateMutation = useUpdateReview();
  const moderateMutation = useModerateReview();
  const deleteMutation = useDeleteReview();

  const handleSubmitResponse = () => {
    if (!review || !responseText.trim() || !user) return;

    respondMutation.mutate(
      {
        id: review.id,
        responseContent: responseText,
        responderName: user.name || "Staff Member",
        responderRole: user.role || "Staff",
        responderId: user.id || "",
      },
      {
        onSuccess: () => {
          setResponseText("");
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  const handleVote = (action: "helpful" | "unhelpful") => {
    if (!review) return;

    const data =
      action === "helpful"
        ? { helpfulCount: (review.helpfulCount || 0) + 1 }
        : { unhelpfulCount: (review.unhelpfulCount || 0) + 1 };

    updateMutation.mutate({ id: review.id, data });
  };

  const handleModerate = (
    action: "approve" | "reject" | "flag" | "feature" | "unfeature",
  ) => {
    if (!review) return;
    moderateMutation.mutate({ id: review.id, action });
  };

  const handleDelete = () => {
    if (!review) return;

    if (
      window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone.",
      )
    ) {
      deleteMutation.mutate(review.id, {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      });
    }
  };

  const handleCreateReview = (formData: any) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    const reviewData = {
      title: formData.title,
      content: formData.content,
      rating: formData.rating,
      authorId: session.user.id,
      ...(formData.guideId ? { guideId: formData.guideId } : {}),
      ...(formData.destinationId
        ? { destinationId: formData.destinationId }
        : {}),
      ...(formData.tripStartDate
        ? { tripStartDate: formData.tripStartDate }
        : {}),
      ...(formData.tripEndDate ? { tripEndDate: formData.tripEndDate } : {}),
      ...(formData.tripDuration ? { tripDuration: formData.tripDuration } : {}),
      ...(formData.tripType ? { tripType: formData.tripType } : {}),
    };

    console.log("calling..", reviewData);

    createReview.mutate(reviewData, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
        onOpenChange(false);
      },
    });
  };

  const renderReviewDetails = () => {
    if (isLoading) {
      return <div className="py-10 text-center">Loading review details...</div>;
    }

    if (!review) {
      return <div className="py-10 text-center">Review not found</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.userAvatar} alt={review.userName} />
              <AvatarFallback>
                {review.userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{review.userName}</h3>
              <div className="flex items-center space-x-2">
                <StarRating value={review.rating} max={5} />
                <span className="text-sm text-muted-foreground">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge
              className={cn(
                review.status === "approved" && "bg-green-500",
                review.status === "rejected" && "bg-red-500",
                review.status === "flagged" && "bg-yellow-500",
                review.status === "pending" && "bg-blue-500",
              )}
            >
              {review.status}
            </Badge>
            {review.featured && <Badge variant="outline">Featured</Badge>}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2">{review.title}</h4>
          <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
        </div>

        {review.tripDetails && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h5 className="font-medium mb-2">Trip Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {formatDate(review.tripDetails.startDate)} to{" "}
                    {formatDate(review.tripDetails.endDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>{review.tripDetails.duration} days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{review.tripDetails.type}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {review.photos && review.photos.length > 0 && (
          <div>
            <h5 className="font-medium mb-2">Photos</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {review.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="rounded-md object-cover aspect-square"
                />
              ))}
            </div>
          </div>
        )}

        {review.highlights && review.highlights.length > 0 && (
          <div>
            <h5 className="font-medium mb-2">Highlights</h5>
            <div className="flex flex-wrap gap-2">
              {review.highlights.map((highlight, index) => (
                <Badge key={index} variant="outline">
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {review.responseDetails && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <h5 className="font-medium">
                  Response from {review.responseDetails.responderName}
                </h5>
                <span className="text-xs text-muted-foreground">
                  {review.responseDetails.responderRole} •{" "}
                  {formatDate(review.responseDetails.date)}
                </span>
              </div>
              <p className="text-gray-700">{review.responseDetails.content}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => handleVote("helpful")}
            >
              <ThumbsUpIcon className="h-4 w-4" />
              <span>Helpful ({review.helpfulCount || 0})</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => handleVote("unhelpful")}
            >
              <ThumbsDownIcon className="h-4 w-4" />
              <span>Not Helpful ({review.unhelpfulCount || 0})</span>
            </Button>
          </div>

          {isStaff && (
            <div className="flex space-x-2">
              {review.status !== "approved" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 text-green-500"
                  onClick={() => handleModerate("approve")}
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Approve</span>
                </Button>
              )}
              {review.status !== "flagged" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 text-yellow-500"
                  onClick={() => handleModerate("flag")}
                >
                  <FlagIcon className="h-4 w-4" />
                  <span>Flag</span>
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 text-red-500"
                  onClick={handleDelete}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              )}
              {!review.featured ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => handleModerate("feature")}
                >
                  <span>Feature</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                  onClick={() => handleModerate("unfeature")}
                >
                  <span>Unfeature</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {isStaff && !review.responseDetails && (
          <div className="mt-6 pt-4 border-t">
            <h5 className="font-medium mb-2">Add a Response</h5>
            <Textarea
              placeholder="Write your response here..."
              className="min-h-[100px] mb-2"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
            <Button
              onClick={handleSubmitResponse}
              disabled={!responseText.trim() || respondMutation.isPending}
            >
              Submit Response
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "view"
              ? `Review for ${review?.entityName || ""}`
              : `Add Review for ${entityName}`}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "View and respond to this customer review"
              : "Share your experience and help others make better decisions"}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          renderReviewDetails()
        ) : (
          <NewReviewForm
            onSubmit={handleCreateReview}
            isSubmitting={createReview.isPending}
            defaultReviewType={entityType}
            defaultEntityId={entityId}
          />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
