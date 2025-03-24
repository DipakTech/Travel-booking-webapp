import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate start of current month
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    // Calculate start of previous month
    const startOfPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );

    // Get total number of bookings
    const totalBookings = await prisma.booking.count();

    // Get booking statuses breakdown
    const bookingStatuses = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    // Format status counts
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0,
    };

    bookingStatuses.forEach((status) => {
      statusCounts[status.status as keyof typeof statusCounts] =
        status._count.id;
    });

    // Get bookings this month
    const bookingsThisMonth = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get bookings last month
    const bookingsLastMonth = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfPrevMonth,
          lt: startOfMonth,
        },
      },
    });

    // Calculate monthly growth rate
    const monthlyGrowthRate =
      bookingsLastMonth > 0
        ? ((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth) * 100
        : 100;

    // Get total revenue
    const revenueResult = await prisma.booking.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // Get average booking value
    const averageBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Get total travelers
    const travelersResult = await prisma.booking.aggregate({
      _sum: {
        totalTravelers: true,
      },
    });

    const totalTravelers = travelersResult._sum.totalTravelers || 0;

    // Get average travelers per booking
    const avgTravelersPerBooking =
      totalBookings > 0 ? totalTravelers / totalBookings : 0;

    // Get top destinations
    const topDestinations = await prisma.booking.groupBy({
      by: ["destinationId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    // Get destination details
    const destinationIds = topDestinations.map((d) => d.destinationId);
    const destinations = await prisma.destination.findMany({
      where: {
        id: {
          in: destinationIds,
        },
      },
      select: {
        id: true,
        name: true,
        country: true,
      },
    });

    // Format top destinations with counts
    const formattedTopDestinations = topDestinations.map((dest) => {
      const destination = destinations.find((d) => d.id === dest.destinationId);
      return {
        id: dest.destinationId,
        name: destination?.name || "Unknown",
        location: destination?.country || "Unknown",
        bookingCount: dest._count.id,
      };
    });

    // Get top guides
    const topGuides = await prisma.booking.groupBy({
      by: ["guideId"],
      _count: {
        id: true,
      },
      where: {
        guideId: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    // Get guide details
    const guideIds = topGuides.map((g) => g.guideId as string);
    const guides = await prisma.guide.findMany({
      where: {
        id: {
          in: guideIds,
        },
      },
      select: {
        id: true,
        name: true,
        rating: true,
        photo: true,
      },
    });

    // Format top guides with counts
    const formattedTopGuides = topGuides.map((g) => {
      const guide = guides.find((guide) => guide.id === g.guideId);
      return {
        id: g.guideId,
        name: guide?.name || "Unknown",
        rating: guide?.rating || 0,
        photo: guide?.photo || null,
        bookingCount: g._count.id,
      };
    });

    // Return the compiled stats
    return NextResponse.json({
      totalBookings,
      statusCounts,
      bookingsThisMonth,
      bookingsLastMonth,
      monthlyGrowthRate,
      totalRevenue,
      averageBookingValue,
      totalTravelers,
      avgTravelersPerBooking,
      topDestinations: formattedTopDestinations,
      topGuides: formattedTopGuides,
    });
  } catch (error) {
    console.error("Error fetching booking statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking statistics" },
      { status: 500 },
    );
  }
}
