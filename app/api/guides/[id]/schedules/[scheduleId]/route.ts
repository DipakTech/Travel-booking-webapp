import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Schema for schedule validation (same as in the parent route)
const scheduleSchema = z.object({
  destination: z.string().min(2),
  location: z.string().min(2),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  description: z.string().min(10),
  maxParticipants: z.number().min(1),
  price: z.number().min(0),
  status: z.enum(["confirmed", "pending", "completed", "cancelled"]),
  difficulty: z.enum(["easy", "moderate", "challenging"]),
  itinerary: z.string().min(10),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; scheduleId: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, scheduleId } = params;

    // Fetch the specific schedule entry
    const schedule = await prisma.tour.findUnique({
      where: {
        id: scheduleId,
        guideId: id,
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error fetching guide schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide schedule" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; scheduleId: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, scheduleId } = params;

    // Check if the schedule exists and belongs to the guide
    const existingSchedule = await prisma.tour.findUnique({
      where: {
        id: scheduleId,
        guideId: id,
      },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 },
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = scheduleSchema.partial().parse(body);

    // Update the schedule entry
    const updatedSchedule = await prisma.tour.update({
      where: {
        id: scheduleId,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("Error updating guide schedule:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update guide schedule" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; scheduleId: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, scheduleId } = params;

    // Check if the schedule exists and belongs to the guide
    const existingSchedule = await prisma.tour.findUnique({
      where: {
        id: scheduleId,
        guideId: id,
      },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 },
      );
    }

    // Delete the schedule entry
    await prisma.tour.delete({
      where: {
        id: scheduleId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guide schedule:", error);
    return NextResponse.json(
      { error: "Failed to delete guide schedule" },
      { status: 500 },
    );
  }
}
