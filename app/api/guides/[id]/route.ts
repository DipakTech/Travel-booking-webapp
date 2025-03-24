import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { guideSchema } from "@/lib/schema/guide";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Find the guide with the matching ID in the database
    const guide = await prisma.guide.findUnique({
      where: { id },
      include: {
        certifications: true,
        availableDates: true,
      },
    });

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Format the guide data to match the expected schema
    const formattedGuide = {
      ...guide,
      location: {
        country: guide.country,
        region: guide.region,
        city: guide.city,
      },
      experience: {
        years: guide.experienceYears,
        level: guide.experienceLevel,
        expeditions: guide.expeditions,
      },
      socialMedia: {
        instagram: guide.instagram,
        facebook: guide.facebook,
        twitter: guide.twitter,
        linkedin: guide.linkedin,
      },
    };

    return NextResponse.json(formattedGuide);
  } catch (error) {
    console.error("Error fetching guide:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if the guide exists
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!existingGuide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const partialSchema = guideSchema.partial();
    const validatedData = partialSchema.parse(body);

    // Prepare update data with the flattened structure for prisma
    const updateData: any = {};

    // Copy simple fields
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.phone) updateData.phone = validatedData.phone;
    if (validatedData.photo) updateData.photo = validatedData.photo;
    if (validatedData.bio) updateData.bio = validatedData.bio;
    if (validatedData.hourlyRate)
      updateData.hourlyRate = validatedData.hourlyRate;
    if (validatedData.availability)
      updateData.availability = validatedData.availability;
    if (validatedData.rating) updateData.rating = validatedData.rating;
    if (validatedData.reviewCount)
      updateData.reviewCount = validatedData.reviewCount;

    // Handle nested objects
    if (validatedData.location) {
      if (validatedData.location.country)
        updateData.country = validatedData.location.country;
      if (validatedData.location.region)
        updateData.region = validatedData.location.region;
      if (validatedData.location.city !== undefined)
        updateData.city = validatedData.location.city;
    }

    if (validatedData.experience) {
      if (validatedData.experience.years)
        updateData.experienceYears = validatedData.experience.years;
      if (validatedData.experience.level)
        updateData.experienceLevel = validatedData.experience.level;
      if (validatedData.experience.expeditions !== undefined)
        updateData.expeditions = validatedData.experience.expeditions;
    }

    if (validatedData.languages) updateData.languages = validatedData.languages;
    if (validatedData.specialties)
      updateData.specialties = validatedData.specialties;

    if (validatedData.socialMedia) {
      if (validatedData.socialMedia.instagram !== undefined)
        updateData.instagram = validatedData.socialMedia.instagram;
      if (validatedData.socialMedia.facebook !== undefined)
        updateData.facebook = validatedData.socialMedia.facebook;
      if (validatedData.socialMedia.twitter !== undefined)
        updateData.twitter = validatedData.socialMedia.twitter;
      if (validatedData.socialMedia.linkedin !== undefined)
        updateData.linkedin = validatedData.socialMedia.linkedin;
    }

    // Update the guide in the database
    const updatedGuide = await prisma.guide.update({
      where: { id },
      data: updateData,
      include: {
        certifications: true,
        availableDates: true,
      },
    });

    // Handle certifications updates (more complex logic would be needed for a full implementation)
    if (validatedData.certifications) {
      // For simplicity, we're not implementing full certification updates in this example
      console.log("Certifications updates would be implemented here");
    }

    // Handle availableDates updates (more complex logic would be needed for a full implementation)
    if (validatedData.availableDates) {
      // For simplicity, we're not implementing full available dates updates in this example
      console.log("Available dates updates would be implemented here");
    }

    // Format the guide data to match the expected schema for the response
    const formattedGuide = {
      ...updatedGuide,
      location: {
        country: updatedGuide.country,
        region: updatedGuide.region,
        city: updatedGuide.city,
      },
      experience: {
        years: updatedGuide.experienceYears,
        level: updatedGuide.experienceLevel,
        expeditions: updatedGuide.expeditions,
      },
      socialMedia: {
        instagram: updatedGuide.instagram,
        facebook: updatedGuide.facebook,
        twitter: updatedGuide.twitter,
        linkedin: updatedGuide.linkedin,
      },
    };

    return NextResponse.json(formattedGuide);
  } catch (error) {
    console.error("Error updating guide:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update guide" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if the guide exists
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!existingGuide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Delete the guide from the database
    await prisma.guide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guide:", error);
    return NextResponse.json(
      { error: "Failed to delete guide" },
      { status: 500 },
    );
  }
}
