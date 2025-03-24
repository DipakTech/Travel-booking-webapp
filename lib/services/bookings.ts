import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  bookingSchema,
  transactionSchema,
  emergencyContactSchema,
} from "@/lib/schema";
import { Prisma } from "@prisma/client";

type AccommodationType = {
  type: string;
  name?: string;
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
};

type TransportationType = {
  type: string;
  details?: string;
  departureDate?: Date;
  departureLocation?: string;
  arrivalDate?: Date;
  arrivalLocation?: string;
};

type ActivityType = {
  name: string;
  date?: Date;
  duration?: string;
  included?: boolean;
};

type EquipmentType = {
  item: string;
  quantity: number;
  pricePerUnit: number;
};

// Use the existing BookingData type
export type BookingData = z.infer<typeof bookingSchema>;

export async function getBookings(options?: {
  customerId?: string;
  destinationId?: string;
  guideId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const where: Prisma.BookingWhereInput = {};

  if (options?.customerId) {
    where.customerId = options.customerId;
  }

  if (options?.destinationId) {
    where.destinationId = options.destinationId;
  }

  if (options?.guideId) {
    where.guideId = options.guideId;
  }

  if (options?.status) {
    where.status = options.status;
  }

  // Date filtering logic
  if (options?.startDate || options?.endDate) {
    where.OR = [];

    if (options?.startDate && options?.endDate) {
      // Bookings that start during the period
      where.OR.push({
        startDate: {
          gte: options.startDate,
          lte: options.endDate,
        },
      });

      // Bookings that end during the period
      where.OR.push({
        endDate: {
          gte: options.startDate,
          lte: options.endDate,
        },
      });

      // Bookings that span the entire period
      where.OR.push({
        AND: [
          {
            startDate: {
              lte: options.startDate,
            },
          },
          {
            endDate: {
              gte: options.endDate,
            },
          },
        ],
      });
    } else if (options?.startDate) {
      where.OR.push({
        startDate: {
          gte: options.startDate,
        },
      });
    } else if (options?.endDate) {
      where.OR.push({
        endDate: {
          lte: options.endDate,
        },
      });
    }
  }

  const sortField = options?.sortBy || "createdAt";
  const sortOrder = options?.sortOrder || "desc";

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
          country: true,
          region: true,
        },
      },
      guide: true,
    },
    take: options?.limit || undefined,
    skip: options?.offset || undefined,
    orderBy: {
      [sortField]: sortOrder,
    },
  });

  const total = await prisma.booking.count({ where });

  return { bookings, total };
}

export async function getBookingById(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      destination: {
        select: {
          id: true,
          name: true,
          country: true,
          region: true,
        },
      },
      guide: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
}

export async function createBooking(data: BookingData) {
  // Validate data with Zod schema
  bookingSchema.parse(data);

  // Check if dates are available for destination
  if (data.destination?.id && data.dates) {
    const { startDate, endDate } = data.dates;
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        destinationId: data.destination.id,
        status: { in: ["confirmed", "pending"] },
        OR: [
          // New booking starts during existing booking
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } },
            ],
          },
          // New booking ends during existing booking
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
          // New booking contains existing booking
          {
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      throw new Error("Selected dates are not available for this destination");
    }
  }

  // Check if guide is available
  if (data.guide?.id && data.dates) {
    const { startDate, endDate } = data.dates;
    const conflictingGuideBookings = await prisma.booking.findMany({
      where: {
        guideId: data.guide.id,
        status: { in: ["confirmed", "pending"] },
        OR: [
          // New booking starts during existing booking
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } },
            ],
          },
          // New booking ends during existing booking
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
          // New booking contains existing booking
          {
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          },
        ],
      },
    });

    if (conflictingGuideBookings.length > 0) {
      throw new Error("Selected guide is not available for these dates");
    }
  }

  // Calculate total travelers
  const adults = data.travelers?.adults || 1;
  const children = data.travelers?.children || 0;
  const infants = data.travelers?.infants || 0;
  const totalTravelers = adults + children + infants;

  // Format booking number
  const timestamp = Date.now().toString().slice(-8);
  const customerInitials = data.customer?.name
    ? data.customer.name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
    : "XX";
  const bookingNumber = `B${timestamp}${customerInitials}`;

  // Prepare booking data
  const dbData: Prisma.BookingCreateInput = {
    bookingNumber,
    status: data.status || "pending",
    startDate: data.dates.startDate,
    endDate: data.dates.endDate,
    duration: data.duration,
    adultsCount: adults,
    childrenCount: children,
    infantsCount: infants,
    totalTravelers,
    totalAmount: data.payment.totalAmount,
    currency: data.payment.currency,
    paymentStatus: data.payment.status,
    depositAmount: data.payment.depositAmount,
    depositPaid: data.payment.depositPaid || false,
    balanceDueDate: data.payment.balanceDueDate,
    specialRequests: data.specialRequests || [],
    customer: {
      connect: { id: data.customer.id },
    },
    destination: {
      connect: { id: data.destination.id },
    },
  };

  // Add guide if specified
  if (data.guide?.id) {
    dbData.guide = {
      connect: { id: data.guide.id },
    };
  }

  // Begin transaction
  return prisma.$transaction(async (tx) => {
    // Create booking
    const booking = await tx.booking.create({
      data: dbData,
      include: {
        customer: true,
        destination: true,
        guide: true,
      },
    });

    // Create accommodations if provided
    if (data.accommodations && data.accommodations.length > 0) {
      await Promise.all(
        data.accommodations.map((accommodation) =>
          tx.accommodation.create({
            data: {
              bookingId: booking.id,
              type: accommodation.type,
              name: accommodation.name,
              location: accommodation.location,
              checkIn: accommodation.checkIn,
              checkOut: accommodation.checkOut,
            },
          }),
        ),
      );
    }

    // Create transportation if provided
    if (data.transportation && data.transportation.length > 0) {
      await Promise.all(
        data.transportation.map((transport) =>
          tx.transportation.create({
            data: {
              bookingId: booking.id,
              type: transport.type,
              details: transport.details,
              departureDate: transport.departureDate,
              departureLocation: transport.departureLocation,
              arrivalDate: transport.arrivalDate,
              arrivalLocation: transport.arrivalLocation,
            },
          }),
        ),
      );
    }

    // Create activities if provided
    if (data.activities && data.activities.length > 0) {
      await Promise.all(
        data.activities.map((activity) =>
          tx.bookingActivity.create({
            data: {
              bookingId: booking.id,
              name: activity.name,
              date: activity.date,
              duration: activity.duration,
              included: activity.included,
            },
          }),
        ),
      );
    }

    // Create equipment rentals if provided
    if (data.equipmentRental && data.equipmentRental.length > 0) {
      await Promise.all(
        data.equipmentRental.map((equipment) =>
          tx.equipmentRental.create({
            data: {
              bookingId: booking.id,
              item: equipment.item,
              quantity: equipment.quantity,
              pricePerUnit: equipment.pricePerUnit,
            },
          }),
        ),
      );
    }

    // Create emergency contact if provided
    if (data.emergency) {
      await tx.emergencyContact.create({
        data: {
          bookingId: booking.id,
          contactName: data.emergency.contactName,
          relationship: data.emergency.relationship,
          phone: data.emergency.phone,
          email: data.emergency.email,
        },
      });
    }

    // Create payment transaction if provided
    if (data.payment?.transactions && data.payment.transactions.length > 0) {
      await Promise.all(
        data.payment.transactions.map((transaction) =>
          tx.transaction.create({
            data: {
              bookingId: booking.id,
              amount: transaction.amount,
              method: transaction.paymentMethod,
              status: transaction.status,
              date: transaction.date,
            },
          }),
        ),
      );
    }

    return booking;
  });
}

export async function updateBooking(
  id: string,
  data: Partial<z.infer<typeof bookingSchema>>,
  userId: string,
) {
  // Find the booking
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Only allow customer or admin to update
  if (booking.customerId !== userId) {
    // Check if user is admin or guide for this booking
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // In a real application, you should probably check against a separate roles table
    // or use a specific field in the User model for roles
    const isAdmin = user?.email === process.env.ADMIN_EMAIL;

    if (!isAdmin && booking.guideId !== userId) {
      throw new Error("You do not have permission to update this booking");
    }
  }

  // Calculate total travelers if needed
  let totalTravelers;
  if (data.travelers) {
    const adults = data.travelers.adults || 0;
    const children = data.travelers.children || 0;
    const infants = data.travelers.infants || 0;
    totalTravelers = adults + children + infants;
  }

  // Prepare update data
  const updateData: any = {};

  if (data.status) updateData.status = data.status;
  if (data.guide?.id) updateData.guideId = data.guide.id;
  if (data.dates?.startDate) updateData.startDate = data.dates.startDate;
  if (data.dates?.endDate) updateData.endDate = data.dates.endDate;
  if (data.duration) updateData.duration = data.duration;
  if (data.travelers?.adults !== undefined)
    updateData.adultsCount = data.travelers.adults;
  if (data.travelers?.children !== undefined)
    updateData.childrenCount = data.travelers.children;
  if (data.travelers?.infants !== undefined)
    updateData.infantsCount = data.travelers.infants;
  if (totalTravelers !== undefined) updateData.totalTravelers = totalTravelers;
  if (data.payment?.totalAmount !== undefined)
    updateData.totalAmount = data.payment.totalAmount;
  if (data.payment?.currency) updateData.currency = data.payment.currency;
  if (data.payment?.status) updateData.paymentStatus = data.payment.status;
  if (data.payment?.depositAmount !== undefined)
    updateData.depositAmount = data.payment.depositAmount;
  if (data.payment?.depositPaid !== undefined)
    updateData.depositPaid = data.payment.depositPaid;
  if (data.payment?.balanceDueDate)
    updateData.balanceDueDate = data.payment.balanceDueDate;
  if (data.specialRequests) updateData.specialRequests = data.specialRequests;

  // Begin transaction
  return prisma.$transaction(async (tx) => {
    // Update booking
    const updatedBooking = await tx.booking.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        destination: true,
        guide: true,
      },
    });

    // Update accommodations if provided
    if (data.accommodations) {
      // Delete existing accommodations
      await tx.accommodation.deleteMany({
        where: { bookingId: id },
      });

      // Create new accommodations
      if (data.accommodations.length > 0) {
        await Promise.all(
          data.accommodations.map((accommodation) =>
            tx.accommodation.create({
              data: {
                bookingId: id,
                type: accommodation.type,
                name: accommodation.name,
                location: accommodation.location,
                checkIn: accommodation.checkIn,
                checkOut: accommodation.checkOut,
              },
            }),
          ),
        );
      }
    }

    // Update transportation if provided
    if (data.transportation) {
      // Delete existing transportation
      await tx.transportation.deleteMany({
        where: { bookingId: id },
      });

      // Create new transportation
      if (data.transportation.length > 0) {
        await Promise.all(
          data.transportation.map((transport) =>
            tx.transportation.create({
              data: {
                bookingId: id,
                type: transport.type,
                details: transport.details,
                departureDate: transport.departureDate,
                departureLocation: transport.departureLocation,
                arrivalDate: transport.arrivalDate,
                arrivalLocation: transport.arrivalLocation,
              },
            }),
          ),
        );
      }
    }

    // Update activities if provided
    if (data.activities) {
      // Delete existing activities
      await tx.bookingActivity.deleteMany({
        where: { bookingId: id },
      });

      // Create new activities
      if (data.activities.length > 0) {
        await Promise.all(
          data.activities.map((activity) =>
            tx.bookingActivity.create({
              data: {
                bookingId: id,
                name: activity.name,
                date: activity.date,
                duration: activity.duration,
                included: activity.included,
              },
            }),
          ),
        );
      }
    }

    // Update emergency contact if provided
    if (data.emergency) {
      const existingContact = await tx.emergencyContact.findFirst({
        where: { bookingId: id },
      });

      if (existingContact) {
        await tx.emergencyContact.update({
          where: { id: existingContact.id },
          data: {
            contactName: data.emergency.contactName,
            relationship: data.emergency.relationship,
            phone: data.emergency.phone,
            email: data.emergency.email,
          },
        });
      } else {
        await tx.emergencyContact.create({
          data: {
            bookingId: id,
            contactName: data.emergency.contactName,
            relationship: data.emergency.relationship,
            phone: data.emergency.phone,
            email: data.emergency.email,
          },
        });
      }
    }

    return updatedBooking;
  });
}

export async function deleteBooking(id: string, userId: string) {
  // Find the booking
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // Only allow customer or admin to delete
  if (booking.customerId !== userId) {
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // In a real application, you should probably check against a separate roles table
    // or use a specific field in the User model for roles
    const isAdmin = user?.email === process.env.ADMIN_EMAIL;

    if (!isAdmin) {
      throw new Error("You do not have permission to delete this booking");
    }
  }

  // Check if booking can be deleted
  if (booking.status === "confirmed" || booking.status === "inProgress") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // In a real application, you should probably check against a separate roles table
    // or use a specific field in the User model for roles
    const isAdmin = user?.email === process.env.ADMIN_EMAIL;

    // Only admins can delete confirmed or in-progress bookings
    if (!isAdmin) {
      throw new Error("Confirmed or in-progress bookings cannot be deleted");
    }
  }

  // Begin transaction to delete booking and all related records
  return prisma.$transaction(async (tx) => {
    // Delete all related records
    await tx.accommodation.deleteMany({ where: { bookingId: id } });
    await tx.transportation.deleteMany({ where: { bookingId: id } });
    await tx.bookingActivity.deleteMany({ where: { bookingId: id } });
    await tx.equipmentRental.deleteMany({ where: { bookingId: id } });
    await tx.transaction.deleteMany({ where: { bookingId: id } });
    await tx.emergencyContact.deleteMany({ where: { bookingId: id } });
    await tx.document.deleteMany({ where: { bookingId: id } });
    await tx.note.deleteMany({ where: { bookingId: id } });

    // Delete booking
    await tx.booking.delete({
      where: { id },
    });

    return { success: true };
  });
}

// Helper function to generate booking number
function generateBookingNumber() {
  const prefix = "TRV";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}

// Helper function to calculate duration in days
function calculateDuration(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) return 1;
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export async function getBookingStats() {
  const totalBookings = await prisma.booking.count();

  const pendingBookings = await prisma.booking.count({
    where: { status: "pending" },
  });

  const confirmedBookings = await prisma.booking.count({
    where: { status: "confirmed" },
  });

  const cancelledBookings = await prisma.booking.count({
    where: { status: "cancelled" },
  });

  const completedBookings = await prisma.booking.count({
    where: { status: "completed" },
  });

  // Total revenue calculation
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

  // Bookings by month for the current year
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);

  const bookingsByMonth = await prisma.$queryRaw`
    SELECT 
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*) as count
    FROM "Booking"
    WHERE "createdAt" BETWEEN ${startOfYear} AND ${endOfYear}
    GROUP BY EXTRACT(MONTH FROM "createdAt")
    ORDER BY month
  `;

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    totalRevenue,
    bookingsByMonth,
  };
}
