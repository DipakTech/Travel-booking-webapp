import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import notificationService from "@/lib/services/notifications";
import { notificationSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");
    const status = searchParams.get("status");
    const searchParam = searchParams.get("search");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;

    // Convert null values to undefined for type safety
    const type = typeParam || undefined;
    const search = searchParam || undefined;

    // Convert status to read boolean
    let read: boolean | undefined = undefined;
    if (status === "read") {
      read = true;
    } else if (status === "unread") {
      read = false;
    }

    // Get user ID from session
    // For demonstration purposes, we're using email to identify the user
    // In a real app, you'd use session.user.id
    const recipientId = session.user.id || session.user.email;

    // Get notifications from service
    const { notifications, total } = await notificationService.getNotifications(
      {
        recipientId,
        type,
        read,
        search,
        limit,
        offset,
      },
    );

    return NextResponse.json({ notifications, total });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get request body
    const data = await request.json();
    const userId = session.user.id || session.user.email;

    // Handle different actions
    switch (data.action) {
      case "markAsRead":
        // Mark a single notification as read
        if (data.id) {
          await notificationService.markAsRead(data.id);
          return NextResponse.json({ success: true });
        }
        break;

      case "markAllAsRead":
        // Mark all notifications as read
        await notificationService.markAllAsRead(userId);
        return NextResponse.json({ success: true });

      case "markSelectedAsRead":
        // Mark selected notifications as read
        if (data.ids && Array.isArray(data.ids)) {
          await notificationService.markMultipleAsRead(data.ids);
          return NextResponse.json({ success: true });
        }
        break;

      case "delete":
        // Delete a single notification
        if (data.id) {
          await notificationService.deleteNotification(data.id);
          return NextResponse.json({ success: true });
        }
        break;

      case "deleteSelected":
        // Delete multiple notifications
        if (data.ids && Array.isArray(data.ids)) {
          await notificationService.deleteMultipleNotifications(data.ids);
          return NextResponse.json({ success: true });
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update notifications" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validate with Zod schema
    const validatedData = notificationSchema.parse(data);

    // Get recipient ID
    const recipientId =
      data.recipientId || session.user.id || session.user.email;

    // Create notification
    const notification = await notificationService.createNotification({
      ...validatedData,
      recipientId,
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create notification",
        details: error.errors || [],
      },
      { status: 400 },
    );
  }
}
