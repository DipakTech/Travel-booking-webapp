import { useCreateNotification } from "@/lib/hooks/use-notifications";

// Types of entities that can trigger notifications
export type EntityType =
  | "destination"
  | "guide"
  | "booking"
  | "customer"
  | "review"
  | "tour";

/**
 * Create a notification based on the action and entity
 */
export const createSystemNotification = async (params: {
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
  recipientId: string;
  relatedEntityType?: EntityType;
  relatedEntityId?: string;
  relatedEntityName?: string;
  actionUrl?: string;
  actionLabel?: string;
}) => {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create notification:", errorData);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

/**
 * Hook to create notifications for common events
 */
export const useNotificationEvents = () => {
  const { mutate: createNotification } = useCreateNotification();

  return {
    /**
     * New destination added
     */
    destinationCreated: (params: {
      recipientId: string;
      destinationId: string;
      destinationName: string;
    }) => {
      createNotification({
        title: "New Destination Added",
        description: `${params.destinationName} has been added to the system.`,
        type: "success",
        recipientId: params.recipientId,
        relatedEntityType: "destination",
        relatedEntityId: params.destinationId,
        relatedEntityName: params.destinationName,
        actionUrl: `/dashboard/destinations/${params.destinationId}`,
        actionLabel: "View Destination",
      });
    },

    /**
     * New guide added
     */
    guideCreated: (params: {
      recipientId: string;
      guideId: string;
      guideName: string;
    }) => {
      createNotification({
        title: "New Guide Added",
        description: `${params.guideName} has been registered as a guide.`,
        type: "info",
        recipientId: params.recipientId,
        relatedEntityType: "guide",
        relatedEntityId: params.guideId,
        relatedEntityName: params.guideName,
        actionUrl: `/dashboard/guides/${params.guideId}`,
        actionLabel: "View Guide Profile",
      });
    },

    /**
     * New booking created
     */
    bookingCreated: (params: {
      recipientId: string;
      bookingId: string;
      bookingNumber: string;
      destinationName: string;
      customerName: string;
    }) => {
      createNotification({
        title: "New Booking Received",
        description: `${params.customerName} has booked ${params.destinationName}.`,
        type: "success",
        recipientId: params.recipientId,
        relatedEntityType: "booking",
        relatedEntityId: params.bookingId,
        relatedEntityName: `Booking #${params.bookingNumber}`,
        actionUrl: `/dashboard/bookings/${params.bookingId}`,
        actionLabel: "View Booking",
      });
    },

    /**
     * Booking status changed
     */
    bookingStatusUpdated: (params: {
      recipientId: string;
      bookingId: string;
      bookingNumber: string;
      status: string;
      destinationName: string;
    }) => {
      let title = "Booking Status Updated";
      let type: "info" | "success" | "warning" | "error" = "info";

      switch (params.status.toLowerCase()) {
        case "confirmed":
          title = "Booking Confirmed";
          type = "success";
          break;
        case "canceled":
          title = "Booking Canceled";
          type = "warning";
          break;
        case "completed":
          title = "Booking Completed";
          type = "success";
          break;
        case "refunded":
          title = "Booking Refunded";
          type = "info";
          break;
      }

      createNotification({
        title,
        description: `Booking #${params.bookingNumber} for ${params.destinationName} is now ${params.status}.`,
        type,
        recipientId: params.recipientId,
        relatedEntityType: "booking",
        relatedEntityId: params.bookingId,
        relatedEntityName: `Booking #${params.bookingNumber}`,
        actionUrl: `/dashboard/bookings/${params.bookingId}`,
        actionLabel: "View Booking",
      });
    },

    /**
     * New customer registered
     */
    customerCreated: (params: {
      recipientId: string;
      customerId: string;
      customerName: string;
    }) => {
      createNotification({
        title: "New Customer Registered",
        description: `${params.customerName} has registered as a new customer.`,
        type: "info",
        recipientId: params.recipientId,
        relatedEntityType: "customer",
        relatedEntityId: params.customerId,
        relatedEntityName: params.customerName,
        actionUrl: `/dashboard/customers/${params.customerId}`,
        actionLabel: "View Customer",
      });
    },

    /**
     * New review added
     */
    reviewCreated: (params: {
      recipientId: string;
      reviewId: string;
      entityName: string;
      customerName: string;
      rating: number;
    }) => {
      const ratingText =
        params.rating >= 4
          ? "positive"
          : params.rating >= 3
          ? "average"
          : "negative";

      createNotification({
        title: "New Review Received",
        description: `${params.customerName} left a ${ratingText} review for ${params.entityName}.`,
        type:
          params.rating >= 4
            ? "success"
            : params.rating >= 3
            ? "info"
            : "warning",
        recipientId: params.recipientId,
        relatedEntityType: "review",
        relatedEntityId: params.reviewId,
        relatedEntityName: `Review by ${params.customerName}`,
        actionUrl: `/dashboard/reviews/${params.reviewId}`,
        actionLabel: "View Review",
      });
    },

    /**
     * Payment received
     */
    paymentReceived: (params: {
      recipientId: string;
      bookingId: string;
      bookingNumber: string;
      amount: number;
      currency: string;
    }) => {
      createNotification({
        title: "Payment Received",
        description: `Payment of ${params.currency} ${params.amount.toFixed(
          2,
        )} received for Booking #${params.bookingNumber}.`,
        type: "success",
        recipientId: params.recipientId,
        relatedEntityType: "booking",
        relatedEntityId: params.bookingId,
        relatedEntityName: `Booking #${params.bookingNumber}`,
        actionUrl: `/dashboard/bookings/${params.bookingId}`,
        actionLabel: "View Booking",
      });
    },

    /**
     * Custom notification
     */
    custom: (params: {
      title: string;
      description: string;
      type: "info" | "success" | "warning" | "error";
      recipientId: string;
      relatedEntityType?: EntityType;
      relatedEntityId?: string;
      relatedEntityName?: string;
      actionUrl?: string;
      actionLabel?: string;
    }) => {
      createNotification({
        ...params,
      });
    },
  };
};
