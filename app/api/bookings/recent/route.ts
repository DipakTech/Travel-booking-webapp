import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 5;

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        customer: true,
        destination: true,
        guide: true,
      },
    });

    // Format the response
    const formattedBookings = recentBookings.map((booking) => {
      return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        customer: {
          id: booking.customer.id,
          name: booking.customer.name,
          email: booking.customer.email,
          avatar: booking.customer.avatar,
        },
        destination: {
          id: booking.destination.id,
          name: booking.destination.name,
          location: booking.destination.country,
        },
        guide: booking.guide
          ? {
              id: booking.guide.id,
              name: booking.guide.name,
            }
          : undefined,
        dates: {
          startDate: booking.startDate,
          endDate: booking.endDate,
        },
        duration: booking.duration,
        travelers: booking.totalTravelers,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        createdAt: booking.createdAt,
      };
    });

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent bookings" },
      { status: 500 },
    );
  }
}
