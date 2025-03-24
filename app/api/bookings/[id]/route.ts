import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { bookingSchema, Booking } from "@/lib/schema/booking";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Find the booking with the matching ID in the database
    const booking = await prisma.booking.findUnique({
      where: { id },
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

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Format the booking data to match the expected schema
    const formattedBooking = {
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

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
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
      bookingSchema.partial().parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: validationError.format() },
          { status: 400 },
        );
      }
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update the main booking record
    const updateData: any = {};

    if (body.status) updateData.status = body.status;

    if (body.dates) {
      if (body.dates.startDate) updateData.startDate = body.dates.startDate;
      if (body.dates.endDate) updateData.endDate = body.dates.endDate;
    }

    if (body.duration) updateData.duration = body.duration;

    if (body.travelers) {
      if (body.travelers.adults !== undefined)
        updateData.adultsCount = body.travelers.adults;
      if (body.travelers.children !== undefined)
        updateData.childrenCount = body.travelers.children;
      if (body.travelers.infants !== undefined)
        updateData.infantsCount = body.travelers.infants;
      if (body.travelers.total !== undefined)
        updateData.totalTravelers = body.travelers.total;
    }

    if (body.payment) {
      if (body.payment.totalAmount)
        updateData.totalAmount = body.payment.totalAmount;
      if (body.payment.currency) updateData.currency = body.payment.currency;
      if (body.payment.status) updateData.paymentStatus = body.payment.status;
      if (body.payment.depositAmount !== undefined)
        updateData.depositAmount = body.payment.depositAmount;
      if (body.payment.depositPaid !== undefined)
        updateData.depositPaid = body.payment.depositPaid;
      if (body.payment.balanceDueDate)
        updateData.balanceDueDate = body.payment.balanceDueDate;
    }

    if (body.specialRequests) updateData.specialRequests = body.specialRequests;

    if (body.destination && body.destination.id)
      updateData.destinationId = body.destination.id;
    if (body.guide && body.guide.id) updateData.guideId = body.guide.id;
    if (body.guide === null) updateData.guideId = null;

    // Update customer if provided
    if (body.customer) {
      await prisma.customer.update({
        where: { id: existingBooking.customerId },
        data: {
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
      });
    }

    // Update the booking
    await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    // Update or create related resources

    // Accommodations
    if (body.accommodations) {
      // Delete existing accommodations
      await prisma.accommodation.deleteMany({
        where: { bookingId: id },
      });

      // Create new accommodations
      if (body.accommodations.length > 0) {
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
              bookingId: id,
            }),
          ),
        });
      }
    }

    // Transportation
    if (body.transportation) {
      // Delete existing transportation
      await prisma.transportation.deleteMany({
        where: { bookingId: id },
      });

      // Create new transportation
      if (body.transportation.length > 0) {
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
              bookingId: id,
            }),
          ),
        });
      }
    }

    // Activities
    if (body.activities) {
      // Delete existing activities
      await prisma.bookingActivity.deleteMany({
        where: { bookingId: id },
      });

      // Create new activities
      if (body.activities.length > 0) {
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
              bookingId: id,
            }),
          ),
        });
      }
    }

    // Equipment Rental
    if (body.equipmentRental) {
      // Delete existing equipment rentals
      await prisma.equipmentRental.deleteMany({
        where: { bookingId: id },
      });

      // Create new equipment rentals
      if (body.equipmentRental.length > 0) {
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
              bookingId: id,
            }),
          ),
        });
      }
    }

    // Transactions
    if (body.payment && body.payment.transactions) {
      // Delete existing transactions
      await prisma.transaction.deleteMany({
        where: { bookingId: id },
      });

      // Create new transactions
      if (body.payment.transactions.length > 0) {
        await prisma.transaction.createMany({
          data: body.payment.transactions.map(
            (transaction: {
              date: Date;
              amount: number;
              method: string;
              status: string;
            }) => ({
              date: transaction.date,
              amount: transaction.amount,
              method: transaction.method,
              status: transaction.status,
              bookingId: id,
            }),
          ),
        });
      }
    }

    // Notes
    if (body.notes) {
      // Delete existing notes
      await prisma.note.deleteMany({
        where: { bookingId: id },
      });

      // Create new notes
      if (body.notes.length > 0) {
        await prisma.note.createMany({
          data: body.notes.map(
            (note: { content: string; date: Date; author: string }) => ({
              content: note.content,
              date: note.date,
              author: note.author,
              bookingId: id,
            }),
          ),
        });
      }
    }

    // Emergency Contact
    if (body.emergency) {
      // Update or create emergency contact
      await prisma.emergencyContact.upsert({
        where: { bookingId: id },
        update: {
          contactName: body.emergency.contactName,
          relationship: body.emergency.relationship,
          phone: body.emergency.phone,
          email: body.emergency.email,
        },
        create: {
          contactName: body.emergency.contactName,
          relationship: body.emergency.relationship,
          phone: body.emergency.phone,
          email: body.emergency.email,
          bookingId: id,
        },
      });
    } else if (body.emergency === null) {
      // Remove emergency contact if explicitly set to null
      await prisma.emergencyContact
        .delete({
          where: { bookingId: id },
        })
        .catch(() => {
          // Ignore error if contact doesn't exist
        });
    }

    // Fetch the updated booking with all relations
    const updatedBooking = await prisma.booking.findUnique({
      where: { id },
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

    if (!updatedBooking) {
      throw new Error("Failed to retrieve the updated booking");
    }

    // Format the response
    const formattedBooking = {
      id: updatedBooking.id,
      bookingNumber: updatedBooking.bookingNumber,
      status: updatedBooking.status,
      customer: {
        id: updatedBooking.customer.id,
        name: updatedBooking.customer.name,
        email: updatedBooking.customer.email,
        phone: updatedBooking.customer.phone,
        avatar: updatedBooking.customer.avatar,
        nationality: updatedBooking.customer.nationality,
        address: {
          street: updatedBooking.customer.street,
          city: updatedBooking.customer.city,
          state: updatedBooking.customer.state,
          postalCode: updatedBooking.customer.postalCode,
          country: updatedBooking.customer.country,
        },
      },
      destination: {
        id: updatedBooking.destination.id,
        name: updatedBooking.destination.name,
        location: updatedBooking.destination.country,
      },
      guide: updatedBooking.guide
        ? {
            id: updatedBooking.guide.id,
            name: updatedBooking.guide.name,
          }
        : undefined,
      dates: {
        startDate: updatedBooking.startDate,
        endDate: updatedBooking.endDate,
      },
      duration: updatedBooking.duration,
      travelers: {
        adults: updatedBooking.adultsCount,
        children: updatedBooking.childrenCount,
        infants: updatedBooking.infantsCount,
        total: updatedBooking.totalTravelers,
      },
      payment: {
        totalAmount: updatedBooking.totalAmount,
        currency: updatedBooking.currency,
        status: updatedBooking.paymentStatus as any,
        transactions: updatedBooking.transactions.map((transaction) => ({
          id: transaction.id,
          date: transaction.date,
          amount: transaction.amount,
          method: transaction.method,
          status: transaction.status as any,
        })),
        depositAmount: updatedBooking.depositAmount,
        depositPaid: updatedBooking.depositPaid,
        balanceDueDate: updatedBooking.balanceDueDate,
      },
      accommodations: updatedBooking.accommodations.map((accommodation) => ({
        type: accommodation.type,
        name: accommodation.name,
        location: accommodation.location,
        checkIn: accommodation.checkIn,
        checkOut: accommodation.checkOut,
      })),
      transportation: updatedBooking.transportation.map((transport) => ({
        type: transport.type,
        details: transport.details,
        departureDate: transport.departureDate,
        departureLocation: transport.departureLocation,
        arrivalDate: transport.arrivalDate,
        arrivalLocation: transport.arrivalLocation,
      })),
      activities: updatedBooking.activities.map((activity) => ({
        name: activity.name,
        date: activity.date,
        duration: activity.duration,
        included: activity.included,
      })),
      specialRequests: updatedBooking.specialRequests,
      equipmentRental: updatedBooking.equipmentRental.map((equipment) => ({
        item: equipment.item,
        quantity: equipment.quantity,
        pricePerUnit: equipment.pricePerUnit,
      })),
      documents: updatedBooking.documents.map((document) => ({
        type: document.type,
        name: document.name,
        url: document.url,
        uploadDate: document.uploadDate,
      })),
      notes: updatedBooking.notes.map((note) => ({
        content: note.content,
        date: note.date,
        author: note.author,
      })),
      emergency: updatedBooking.emergencyContact
        ? {
            contactName: updatedBooking.emergencyContact.contactName,
            relationship: updatedBooking.emergencyContact.relationship,
            phone: updatedBooking.emergencyContact.phone,
            email: updatedBooking.emergencyContact.email,
          }
        : undefined,
      createdAt: updatedBooking.createdAt,
      updatedAt: updatedBooking.updatedAt,
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Delete the booking and all related records (cascading delete should handle related records)
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
}
