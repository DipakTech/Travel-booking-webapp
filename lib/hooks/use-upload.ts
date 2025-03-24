import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

/**
 * Hook for general file uploads
 */
export function useFileUpload(
  endpoint: string,
  options: {
    fieldName?: string;
    onSuccessInvalidate?: string[];
    onSuccessCallback?: (data: any) => void;
  } = {},
) {
  const queryClient = useQueryClient();
  const {
    fieldName = "file",
    onSuccessInvalidate = [],
    onSuccessCallback,
  } = options;

  return useMutation({
    mutationFn: (file: File) => {
      return api.upload(endpoint, file, fieldName);
    },
    onSuccess: (data) => {
      // Invalidate specified queries
      onSuccessInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      // Call success callback if provided
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
  });
}

/**
 * Hook for uploading destination images
 */
export function useDestinationImageUpload(destinationId: string) {
  return useFileUpload(`/api/destinations/${destinationId}/images`, {
    fieldName: "image",
    onSuccessInvalidate: ["destinations", `destination-${destinationId}`],
  });
}

/**
 * Hook for uploading guide profile images
 */
export function useGuideImageUpload(guideId: string) {
  return useFileUpload(`/api/guides/${guideId}/image`, {
    fieldName: "image",
    onSuccessInvalidate: ["guides", `guide-${guideId}`],
  });
}

/**
 * Hook for uploading review photos
 */
export function useReviewPhotoUpload(reviewId: string) {
  return useFileUpload(`/api/reviews/${reviewId}/photos`, {
    fieldName: "photo",
    onSuccessInvalidate: ["reviews", `review-${reviewId}`],
  });
}
