import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBookingStats } from "@/lib/services/bookings";
import { getDestinationStats } from "@/lib/services/destinations";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate date periods for comparison
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);

    // BOOKING STATS
    const bookingStats = await getBookingStats();

    // Current month bookings
    const bookingsThisMonth = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    });

    // Last month bookings
    const bookingsLastMonth = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfPrevMonth,
          lt: startOfCurrentMonth,
        },
      },
    });

    // Calculate growth rate
    const bookingGrowthRate =
      bookingsLastMonth > 0
        ? ((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth) * 100
        : bookingsThisMonth > 0
        ? 100
        : 0;

    // DESTINATION STATS
    const destinationStats = await getDestinationStats();

    // GUIDE STATS
    const totalGuides = await prisma.guide.count();
    const activeGuides = await prisma.guide.count({
      where: { availability: "available" },
    });

    // Calculate average guide rating
    const guideRatingData = await prisma.guide.aggregate({
      _avg: { rating: true },
    });
    const averageGuideRating = guideRatingData._avg.rating || 0;

    // CUSTOMER STATS
    const totalCustomers = await prisma.customer.count();

    // New customers this month
    const newCustomersThisMonth = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    });

    // New customers last month
    const newCustomersLastMonth = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfPrevMonth,
          lt: startOfCurrentMonth,
        },
      },
    });

    // Customer growth rate
    const customerGrowthRate =
      newCustomersLastMonth > 0
        ? ((newCustomersThisMonth - newCustomersLastMonth) /
            newCustomersLastMonth) *
          100
        : newCustomersThisMonth > 0
        ? 100
        : 0;

    // REVENUE STATS
    const revenueData = await prisma.booking.aggregate({
      where: {
        status: { in: ["confirmed", "completed"] },
        paymentStatus: "paid",
      },
      _sum: {
        totalAmount: true,
      },
    });
    const totalRevenue = revenueData._sum?.totalAmount || 0;

    // Current month revenue
    const revenueThisMonth = await prisma.booking.aggregate({
      where: {
        status: { in: ["confirmed", "completed"] },
        paymentStatus: "paid",
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Last month revenue
    const revenueLastMonth = await prisma.booking.aggregate({
      where: {
        status: { in: ["confirmed", "completed"] },
        paymentStatus: "paid",
        createdAt: {
          gte: startOfPrevMonth,
          lt: startOfCurrentMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const currentMonthRevenue = revenueThisMonth._sum?.totalAmount || 0;
    const lastMonthRevenue = revenueLastMonth._sum?.totalAmount || 0;

    // Revenue growth rate
    const revenueGrowthRate =
      lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : currentMonthRevenue > 0
        ? 100
        : 0;

    // TRAVELER STATS
    const travelerData = await prisma.booking.aggregate({
      _sum: {
        totalTravelers: true,
      },
    });
    const totalTravelers = travelerData._sum?.totalTravelers || 0;

    // Travelers this month
    const travelersThisMonth = await prisma.booking.aggregate({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
      _sum: {
        totalTravelers: true,
      },
    });

    // Travelers last month
    const travelersLastMonth = await prisma.booking.aggregate({
      where: {
        createdAt: {
          gte: startOfPrevMonth,
          lt: startOfCurrentMonth,
        },
      },
      _sum: {
        totalTravelers: true,
      },
    });

    const currentMonthTravelers = travelersThisMonth._sum?.totalTravelers || 0;
    const lastMonthTravelers = travelersLastMonth._sum?.totalTravelers || 0;

    // Traveler growth rate
    const travelerGrowthRate =
      lastMonthTravelers > 0
        ? ((currentMonthTravelers - lastMonthTravelers) / lastMonthTravelers) *
          100
        : currentMonthTravelers > 0
        ? 100
        : 0;

    // Monthly booking data for charts
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    // Get monthly booking data for the current year
    const monthlyBookings = await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "createdAt")::integer as month,
        COUNT(*) as booking_count,
        SUM("totalAmount") as revenue
      FROM "Booking"
      WHERE "createdAt" BETWEEN ${startOfYear} AND ${endOfYear}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month
    `;

    // Format monthly data for charts
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedMonthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: monthNames[i],
      month: i + 1,
      bookings: 0,
      revenue: 0,
    }));

    // Fill in actual data where available
    if (Array.isArray(monthlyBookings)) {
      monthlyBookings.forEach((item: any) => {
        const monthIndex = item.month - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          formattedMonthlyData[monthIndex].bookings = Number(
            item.booking_count,
          );
          formattedMonthlyData[monthIndex].revenue = Number(item.revenue || 0);
        }
      });
    }

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
        images: true,
      },
    });

    // Format top destinations
    const formattedTopDestinations = topDestinations.map((dest) => {
      const destination = destinations.find((d) => d.id === dest.destinationId);
      return {
        id: dest.destinationId,
        name: destination?.name || "Unknown",
        location: destination?.country || "Unknown",
        image: destination?.images?.[0] || null,
        bookingCount: dest._count.id,
      };
    });

    // Status distribution for pie chart
    const statusDistribution = await prisma.booking.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const formattedStatusDistribution = statusDistribution.map((status) => ({
      name: status.status,
      value: status._count.id,
    }));

    // Return combined dashboard stats
    return NextResponse.json({
      bookings: {
        total: bookingStats.totalBookings,
        pending: bookingStats.pendingBookings,
        confirmed: bookingStats.confirmedBookings,
        completed: bookingStats.completedBookings,
        cancelled: bookingStats.cancelledBookings,
        growth: bookingGrowthRate,
      },
      destinations: {
        total: destinationStats.totalDestinations,
        featured: destinationStats.featuredCount,
        averageRating: destinationStats.averageRating,
        topRated: destinationStats.topRated,
      },
      guides: {
        total: totalGuides,
        active: activeGuides,
        averageRating: averageGuideRating,
      },
      customers: {
        total: totalCustomers,
        newThisMonth: newCustomersThisMonth,
        growth: customerGrowthRate,
      },
      revenue: {
        total: totalRevenue,
        thisMonth: currentMonthRevenue,
        growth: revenueGrowthRate,
      },
      travelers: {
        total: totalTravelers,
        thisMonth: currentMonthTravelers,
        growth: travelerGrowthRate,
      },
      charts: {
        monthlyData: formattedMonthlyData,
        topDestinations: formattedTopDestinations,
        statusDistribution: formattedStatusDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}
