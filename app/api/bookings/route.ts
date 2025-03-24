import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { bookingSchema, Booking } from "@/lib/schema/booking";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateBookingNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const destination = searchParams.get("destination");
    const guide = searchParams.get("guide");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : 0;

    // Build filter conditions
    let whereConditions: any = {};

    if (search) {
      whereConditions.OR = [
        { bookingNumber: { contains: search, mode: "insensitive" } },
        {
          customer: {
            name: { contains: search, mode: "insensitive" },
          },
        },
        {
          destination: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    if (status) {
      whereConditions.status = status;
    }

    if (destination) {
      whereConditions.destinationId = destination;
    }

    if (guide) {
      whereConditions.guideId = guide;
    }

    if (startDate) {
      whereConditions.startDate = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      whereConditions.endDate = {
        lte: new Date(endDate),
      };
    }

    // Query the database for bookings
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: whereConditions,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          customer: true,
          destination: true,
          guide: true,
          accommodations: true,
          transportation: true,
          activities: true,
          equipmentRental: true,
          transactions: true,
          documents: true,
          notes: true,
          emergencyContact: true,
        },
      }),
      prisma.booking.count({ where: whereConditions }),
    ]);

    // Format the response
    const formattedBookings = bookings.map((booking) => {
      // Format the booking data to match the expected schema
      return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        customer: {
          id: booking.customer.id,
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
          avatar: booking.customer.avatar,
          nationality: booking.customer.nationality,
          address: {
            street: booking.customer.street,
            city: booking.customer.city,
            state: booking.customer.state,
            postalCode: booking.customer.postalCode,
            country: booking.customer.country,
          },
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
        travelers: {
          adults: booking.adultsCount,
          children: booking.childrenCount,
          infants: booking.infantsCount,
          total: booking.totalTravelers,
        },
        payment: {
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          status: booking.paymentStatus as any,
          transactions: booking.transactions.map((transaction) => ({
            id: transaction.id,
            date: transaction.date,
            amount: transaction.amount,
            method: transaction.method,
            status: transaction.status as any,
          })),
          depositAmount: booking.depositAmount,
          depositPaid: booking.depositPaid,
          balanceDueDate: booking.balanceDueDate,
        },
        accommodations: booking.accommodations.map((accommodation) => ({
          type: accommodation.type,
          name: accommodation.name,
          location: accommodation.location,
          checkIn: accommodation.checkIn,
          checkOut: accommodation.checkOut,
        })),
        transportation: booking.transportation.map((transport) => ({
          type: transport.type,
          details: transport.details,
          departureDate: transport.departureDate,
          departureLocation: transport.departureLocation,
          arrivalDate: transport.arrivalDate,
          arrivalLocation: transport.arrivalLocation,
        })),
        activities: booking.activities.map((activity) => ({
          name: activity.name,
          date: activity.date,
          duration: activity.duration,
          included: activity.included,
        })),
        specialRequests: booking.specialRequests,
        equipmentRental: booking.equipmentRental.map((equipment) => ({
          item: equipment.item,
          quantity: equipment.quantity,
          pricePerUnit: equipment.pricePerUnit,
        })),
        documents: booking.documents.map((document) => ({
          type: document.type,
          name: document.name,
          url: document.url,
          uploadDate: document.uploadDate,
        })),
        notes: booking.notes.map((note) => ({
          content: note.content,
          date: note.date,
          author: note.author,
        })),
        emergency: booking.emergencyContact
          ? {
              contactName: booking.emergencyContact.contactName,
              relationship: booking.emergencyContact.relationship,
              phone: booking.emergencyContact.phone,
              email: booking.emergencyContact.email,
            }
          : undefined,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });

    return NextResponse.json({
      bookings: formattedBookings,
      total,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();

    // Convert date strings to Date objects
    if (body.dates) {
      if (body.dates.startDate) {
        body.dates.startDate = new Date(body.dates.startDate);
      }
      if (body.dates.endDate) {
        body.dates.endDate = new Date(body.dates.endDate);
      }
    }

    // Also convert dates in accommodations
    if (body.accommodations && Array.isArray(body.accommodations)) {
      body.accommodations = body.accommodations.map((accommodation: any) => ({
        ...accommodation,
        checkIn: accommodation.checkIn
          ? new Date(accommodation.checkIn)
          : undefined,
        checkOut: accommodation.checkOut
          ? new Date(accommodation.checkOut)
          : undefined,
      }));
    }

    // Convert dates in transportation
    if (body.transportation && Array.isArray(body.transportation)) {
      body.transportation = body.transportation.map((transport: any) => ({
        ...transport,
        departureDate: transport.departureDate
          ? new Date(transport.departureDate)
          : undefined,
        arrivalDate: transport.arrivalDate
          ? new Date(transport.arrivalDate)
          : undefined,
      }));
    }

    // Convert dates in activities
    if (body.activities && Array.isArray(body.activities)) {
      body.activities = body.activities.map((activity: any) => ({
        ...activity,
        date: activity.date ? new Date(activity.date) : undefined,
      }));
    }

    // Convert dates in payment
    if (body.payment) {
      if (body.payment.balanceDueDate) {
        body.payment.balanceDueDate = new Date(body.payment.balanceDueDate);
      }
      if (
        body.payment.transactions &&
        Array.isArray(body.payment.transactions)
      ) {
        body.payment.transactions = body.payment.transactions.map(
          (transaction: any) => ({
            ...transaction,
            date: transaction.date ? new Date(transaction.date) : undefined,
          }),
        );
      }
    }

    // Convert dates in documents
    if (body.documents && Array.isArray(body.documents)) {
      body.documents = body.documents.map((document: any) => ({
        ...document,
        uploadDate: document.uploadDate
          ? new Date(document.uploadDate)
          : undefined,
      }));
    }

    // Convert dates in notes
    if (body.notes && Array.isArray(body.notes)) {
      body.notes = body.notes.map((note: any) => ({
        ...note,
        date: note.date ? new Date(note.date) : undefined,
      }));
    }

    // Validate request data
    try {
      bookingSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: validationError.format() },
          { status: 400 },
        );
      }
    }

    // Generate a unique booking number
    const bookingNumber = generateBookingNumber();

    // Create the customer if it doesn't exist or update if it does
    const customer = await prisma.customer.upsert({
      where: { email: body.customer.email },
      update: {
        name: body.customer.name,
        phone: body.customer.phone,
        avatar: body.customer.avatar,
        nationality: body.customer.nationality,
        street: body.customer.address?.street,
        city: body.customer.address?.city,
        state: body.customer.address?.state,
        postalCode: body.customer.address?.postalCode,
        country: body.customer.address?.country,
      },
      create: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone,
        avatar: body.customer.avatar,
        nationality: body.customer.nationality,
        street: body.customer.address?.street,
        city: body.customer.address?.city,
        state: body.customer.address?.state,
        postalCode: body.customer.address?.postalCode,
        country: body.customer.address?.country,
      },
    });

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        status: body.status,
        startDate: body.dates.startDate,
        endDate: body.dates.endDate,
        duration: body.duration,
        adultsCount: body.travelers.adults,
        childrenCount: body.travelers.children,
        infantsCount: body.travelers.infants,
        totalTravelers: body.travelers.total,
        totalAmount: body.payment.totalAmount,
        currency: body.payment.currency,
        paymentStatus: body.payment.status,
        depositAmount: body.payment.depositAmount,
        depositPaid: body.payment.depositPaid,
        balanceDueDate: body.payment.balanceDueDate,
        specialRequests: body.specialRequests || [],
        customerId: customer.id,
        destinationId: body.destination.id,
        guideId: body.guide?.id,
      },
    });

    // Create related resources
    if (body.accommodations && body.accommodations.length > 0) {
      await prisma.accommodation.createMany({
        data: body.accommodations.map(
          (accommodation: {
            type: string;
            name?: string;
            location?: string;
            checkIn?: Date;
            checkOut?: Date;
          }) => ({
            type: accommodation.type,
            name: accommodation.name,
            location: accommodation.location,
            checkIn: accommodation.checkIn,
            checkOut: accommodation.checkOut,
            bookingId: booking.id,
          }),
        ),
      });
    }

    if (body.transportation && body.transportation.length > 0) {
      await prisma.transportation.createMany({
        data: body.transportation.map(
          (transport: {
            type: string;
            details?: string;
            departureDate?: Date;
            departureLocation?: string;
            arrivalDate?: Date;
            arrivalLocation?: string;
          }) => ({
            type: transport.type,
            details: transport.details,
            departureDate: transport.departureDate,
            departureLocation: transport.departureLocation,
            arrivalDate: transport.arrivalDate,
            arrivalLocation: transport.arrivalLocation,
            bookingId: booking.id,
          }),
        ),
      });
    }

    if (body.activities && body.activities.length > 0) {
      await prisma.bookingActivity.createMany({
        data: body.activities.map(
          (activity: {
            name: string;
            date?: Date;
            duration?: string;
            included: boolean;
          }) => ({
            name: activity.name,
            date: activity.date,
            duration: activity.duration,
            included: activity.included,
            bookingId: booking.id,
          }),
        ),
      });
    }

    if (body.equipmentRental && body.equipmentRental.length > 0) {
      await prisma.equipmentRental.createMany({
        data: body.equipmentRental.map(
          (equipment: {
            item: string;
            quantity: number;
            pricePerUnit: number;
          }) => ({
            item: equipment.item,
            quantity: equipment.quantity,
            pricePerUnit: equipment.pricePerUnit,
            bookingId: booking.id,
          }),
        ),
      });
    }

    if (body.payment.transactions && body.payment.transactions.length > 0) {
      await prisma.transaction.createMany({
        data: body.payment.transactions.map(
          (transaction: {
            id: string;
            date: Date;
            amount: number;
            method: string;
            status: string;
          }) => ({
            date: transaction.date,
            amount: transaction.amount,
            method: transaction.method,
            status: transaction.status,
            bookingId: booking.id,
          }),
        ),
      });
    }

    if (body.documents && body.documents.length > 0) {
      await prisma.document.createMany({
        data: body.documents.map(
          (document: {
            type: string;
            name: string;
            url: string;
            uploadDate: Date;
          }) => ({
            type: document.type,
            name: document.name,
            url: document.url,
            uploadDate: document.uploadDate,
            bookingId: booking.id,
          }),
        ),
      });
    }

    if (body.notes && body.notes.length > 0) {
      await prisma.note.createMany({
        data: body.notes.map(
          (note: { content: string; date: Date; author: string }) => ({
            content: note.content,
            date: note.date,
            author: note.author,
            bookingId: booking.id,
          }),
        ),
      });
    }

    if (body.emergency) {
      await prisma.emergencyContact.create({
        data: {
          contactName: body.emergency.contactName,
          relationship: body.emergency.relationship,
          phone: body.emergency.phone,
          email: body.emergency.email,
          bookingId: booking.id,
        },
      });
    }

    // Fetch the newly created booking with all relations
    const createdBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        customer: true,
        destination: true,
        guide: true,
        accommodations: true,
        transportation: true,
        activities: true,
        equipmentRental: true,
        transactions: true,
        documents: true,
        notes: true,
        emergencyContact: true,
      },
    });

    if (!createdBooking) {
      throw new Error("Failed to retrieve the created booking");
    }

    // Format the response
    const formattedBooking = {
      id: createdBooking.id,
      bookingNumber: createdBooking.bookingNumber,
      status: createdBooking.status,
      customer: {
        id: createdBooking.customer.id,
        name: createdBooking.customer.name,
        email: createdBooking.customer.email,
        phone: createdBooking.customer.phone,
        avatar: createdBooking.customer.avatar,
        nationality: createdBooking.customer.nationality,
        address: {
          street: createdBooking.customer.street,
          city: createdBooking.customer.city,
          state: createdBooking.customer.state,
          postalCode: createdBooking.customer.postalCode,
          country: createdBooking.customer.country,
        },
      },
      destination: {
        id: createdBooking.destination.id,
        name: createdBooking.destination.name,
        location: createdBooking.destination.country,
      },
      guide: createdBooking.guide
        ? {
            id: createdBooking.guide.id,
            name: createdBooking.guide.name,
          }
        : undefined,
      dates: {
        startDate: createdBooking.startDate,
        endDate: createdBooking.endDate,
      },
      duration: createdBooking.duration,
      travelers: {
        adults: createdBooking.adultsCount,
        children: createdBooking.childrenCount,
        infants: createdBooking.infantsCount,
        total: createdBooking.totalTravelers,
      },
      payment: {
        totalAmount: createdBooking.totalAmount,
        currency: createdBooking.currency,
        status: createdBooking.paymentStatus as any,
        transactions: createdBooking.transactions.map((transaction) => ({
          id: transaction.id,
          date: transaction.date,
          amount: transaction.amount,
          method: transaction.method,
          status: transaction.status as any,
        })),
        depositAmount: createdBooking.depositAmount,
        depositPaid: createdBooking.depositPaid,
        balanceDueDate: createdBooking.balanceDueDate,
      },
      accommodations: createdBooking.accommodations.map((accommodation) => ({
        type: accommodation.type,
        name: accommodation.name,
        location: accommodation.location,
        checkIn: accommodation.checkIn,
        checkOut: accommodation.checkOut,
      })),
      transportation: createdBooking.transportation.map((transport) => ({
        type: transport.type,
        details: transport.details,
        departureDate: transport.departureDate,
        departureLocation: transport.departureLocation,
        arrivalDate: transport.arrivalDate,
        arrivalLocation: transport.arrivalLocation,
      })),
      activities: createdBooking.activities.map((activity) => ({
        name: activity.name,
        date: activity.date,
        duration: activity.duration,
        included: activity.included,
      })),
      specialRequests: createdBooking.specialRequests,
      equipmentRental: createdBooking.equipmentRental.map((equipment) => ({
        item: equipment.item,
        quantity: equipment.quantity,
        pricePerUnit: equipment.pricePerUnit,
      })),
      documents: createdBooking.documents.map((document) => ({
        type: document.type,
        name: document.name,
        url: document.url,
        uploadDate: document.uploadDate,
      })),
      notes: createdBooking.notes.map((note) => ({
        content: note.content,
        date: note.date,
        author: note.author,
      })),
      emergency: createdBooking.emergencyContact
        ? {
            contactName: createdBooking.emergencyContact.contactName,
            relationship: createdBooking.emergencyContact.relationship,
            phone: createdBooking.emergencyContact.phone,
            email: createdBooking.emergencyContact.email,
          }
        : undefined,
      createdAt: createdBooking.createdAt,
      updatedAt: createdBooking.updatedAt,
    };

    return NextResponse.json(formattedBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
