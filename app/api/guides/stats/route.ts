import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the start of the current month
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get the start of last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total guides count
    const totalGuides = await prisma.guide.count();

    // Active guides count
    const activeGuides = await prisma.guide.count({
      where: { availability: "available" },
    });

    // Partially available guides count
    const onLeaveGuides = await prisma.guide.count({
      where: { availability: "partially_available" },
    });

    // Inactive guides count
    const inactiveGuides = await prisma.guide.count({
      where: { availability: "unavailable" },
    });

    // Calculate average rating
    const ratingStats = await prisma.guide.aggregate({
      _avg: { rating: true },
      _sum: { reviewCount: true },
    });

    const averageRating = ratingStats._avg.rating || 0;
    const totalReviews = ratingStats._sum.reviewCount || 0;

    // Count bookings for the current month
    const currentMonthBookings = await prisma.booking.count({
      where: {
        startDate: {
          gte: currentMonthStart,
          lt: now,
        },
        guideId: { not: null }, // Only count bookings with guides
      },
    });

    // Count bookings for the last month
    const lastMonthBookings = await prisma.booking.count({
      where: {
        startDate: {
          gte: lastMonthStart,
          lt: lastMonthEnd,
        },
        guideId: { not: null }, // Only count bookings with guides
      },
    });

    // Calculate percent change
    const changeFromLastMonth =
      lastMonthBookings > 0
        ? Math.round(
            ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) *
              100,
          )
        : 0;

    const stats = {
      totalGuides,
      activeGuides,
      onLeaveGuides,
      inactiveGuides,
      averageRating,
      totalReviews,
      toursThisMonth: currentMonthBookings,
      changeFromLastMonth,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching guide stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide stats" },
      { status: 500 },
    );
  }
}
