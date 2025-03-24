import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import * as destinationService from "@/lib/services/destinations";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession();

    // Check if user is authenticated and has admin access
    if (
      !session ||
      !session.user ||
      session?.user?.email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized. Only admins can access destination statistics.",
        },
        { status: 403 },
      );
    }

    // Get destination statistics
    const stats = await destinationService.getDestinationStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching destination statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination statistics" },
      { status: 500 },
    );
  }
}
