import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Mock notifications database
// In a real application, this would be a database model
let notifications = [
  {
    id: "1",
    title: "New booking confirmed",
    description:
      "Everest Base Camp trek has been confirmed for October 15, 2023. 6 participants are confirmed.",
    time: "2 minutes ago",
    date: "Today",
    timestamp: new Date().toISOString(),
    read: false,
    type: "success",
    actionUrl: "/dashboard/bookings/B1234",
    actionLabel: "View Booking",
    relatedEntity: {
      type: "booking",
      id: "B1234",
      name: "Everest Base Camp",
    },
  },
  {
    id: "2",
    title: "Guide schedule updated",
    description:
      "Tenzing Sherpa has a new tour assigned: Annapurna Circuit (Nov 10-25, 2023)",
    time: "3 hours ago",
    date: "Today",
    timestamp: new Date().toISOString(),
    read: false,
    type: "info",
    actionUrl: "/dashboard/guides/G001/schedule",
    actionLabel: "View Schedule",
    relatedEntity: {
      type: "guide",
      id: "G001",
      name: "Tenzing Sherpa",
    },
  },
  {
    id: "3",
    title: "Tour cancelation request",
    description:
      "Customer Maria Johnson requested to cancel Annapurna trek scheduled for Dec 5, 2023",
    time: "1 day ago",
    date: "Yesterday",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    type: "warning",
    actionUrl: "/dashboard/bookings/B1235/cancel",
    actionLabel: "Process Cancellation",
    relatedEntity: {
      type: "booking",
      id: "B1235",
      name: "Annapurna Circuit",
    },
  },
  {
    id: "4",
    title: "Payment failed",
    description:
      "Payment for booking #B1236 (Langtang Valley) failed due to insufficient funds",
    time: "2 days ago",
    date: "May 15, 2023",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    type: "error",
    actionUrl: "/dashboard/bookings/B1236/payment",
    actionLabel: "Review Payment",
    relatedEntity: {
      type: "booking",
      id: "B1236",
      name: "Langtang Valley",
    },
  },
  {
    id: "5",
    title: "New customer review",
    description:
      "Jenny Parker left a 5-star review for the Everest Base Camp trek with guide Tenzing Sherpa",
    time: "3 days ago",
    date: "May 14, 2023",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    type: "success",
    actionUrl: "/dashboard/reviews",
    actionLabel: "View Review",
  },
  {
    id: "6",
    title: "System maintenance completed",
    description:
      "The scheduled system maintenance has been completed successfully. All systems are operational.",
    time: "5 days ago",
    date: "May 12, 2023",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    type: "info",
  },
];

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  // Filter notifications based on query parameters
  let filteredNotifications = [...notifications];

  if (type && type !== "all") {
    filteredNotifications = filteredNotifications.filter(
      (notification) => notification.type === type,
    );
  }

  if (status === "read") {
    filteredNotifications = filteredNotifications.filter(
      (notification) => notification.read,
    );
  } else if (status === "unread") {
    filteredNotifications = filteredNotifications.filter(
      (notification) => !notification.read,
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredNotifications = filteredNotifications.filter(
      (notification) =>
        notification.title.toLowerCase().includes(searchLower) ||
        notification.description.toLowerCase().includes(searchLower) ||
        notification.relatedEntity?.name.toLowerCase().includes(searchLower),
    );
  }

  // Sort notifications by timestamp, most recent first
  filteredNotifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return NextResponse.json(filteredNotifications);
}

export async function PATCH(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get request body
  const data = await request.json();

  // Handle different actions
  switch (data.action) {
    case "markAsRead":
      // Mark a single notification as read
      if (data.id) {
        notifications = notifications.map((notification) =>
          notification.id === data.id
            ? { ...notification, read: true }
            : notification,
        );
        return NextResponse.json({ success: true });
      }
      break;

    case "markAllAsRead":
      // Mark all notifications as read
      notifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      return NextResponse.json({ success: true });

    case "markSelectedAsRead":
      // Mark selected notifications as read
      if (data.ids && Array.isArray(data.ids)) {
        notifications = notifications.map((notification) =>
          data.ids.includes(notification.id)
            ? { ...notification, read: true }
            : notification,
        );
        return NextResponse.json({ success: true });
      }
      break;

    case "delete":
      // Delete a single notification
      if (data.id) {
        const notificationToDelete = notifications.find(
          (n) => n.id === data.id,
        );
        if (!notificationToDelete) {
          return NextResponse.json(
            { error: "Notification not found" },
            { status: 404 },
          );
        }
        notifications = notifications.filter((n) => n.id !== data.id);
        return NextResponse.json({ success: true });
      }
      break;

    case "deleteSelected":
      // Delete multiple notifications
      if (data.ids && Array.isArray(data.ids)) {
        notifications = notifications.filter((n) => !data.ids.includes(n.id));
        return NextResponse.json({ success: true });
      }
      break;

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create a new notification
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description || !data.type) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, description, and type are required",
        },
        { status: 400 },
      );
    }

    // Create new notification
    const newNotification = {
      id: (notifications.length + 1).toString(),
      title: data.title,
      description: data.description,
      type: data.type,
      read: false,
      time: "Just now",
      date: "Today",
      timestamp: new Date().toISOString(),
      ...(data.actionUrl && { actionUrl: data.actionUrl }),
      ...(data.actionLabel && { actionLabel: data.actionLabel }),
      ...(data.relatedEntity && { relatedEntity: data.relatedEntity }),
    };

    // Add to notifications array
    notifications = [newNotification, ...notifications];

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}
