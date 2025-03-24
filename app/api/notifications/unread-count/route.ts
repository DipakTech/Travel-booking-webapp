import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { notificationService } from "@/lib/services/notifications";

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user ID from session
    const userId = session.user.id || session.user.email;

    // Get unread count from service
    const { count } = await notificationService.getUnreadCount(userId);

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Error fetching unread notifications count:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch unread notifications count" },
      { status: 500 },
    );
  }
}
