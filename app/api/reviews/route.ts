import { NextResponse } from "next/server";

// Sample review data
const reviews = [
  {
    id: "review1",
    type: "guide",
    entityId: "G001",
    entityName: "Tenzing Sherpa",
    userName: "John Doe",
    userAvatar: "/avatars/user1.png",
    rating: 5,
    comment:
      "Excellent guide! Very knowledgeable about the Everest region and made the trek enjoyable despite challenging conditions.",
    date: "2023-11-15T10:30:00Z",
    status: "approved",
    response:
      "Thank you for your kind words. It was a pleasure to guide you through the Everest region. We hope to see you again for your next adventure!",
  },
  {
    id: "review2",
    type: "destination",
    entityId: "D001",
    entityName: "Everest Base Camp Trek",
    userName: "Sarah Smith",
    userAvatar: "/avatars/user2.png",
    rating: 4,
    comment:
      "The Everest Base Camp trek was breathtaking. The views were incredible. The only improvement could be more detailed information about altitude sickness prevention in the pre-trek briefing.",
    date: "2023-10-28T14:45:00Z",
    status: "approved",
    response: null,
  },
  {
    id: "review3",
    type: "guide",
    entityId: "G002",
    entityName: "Maria Rodriguez",
    userName: "Michael Johnson",
    userAvatar: "/avatars/user3.png",
    rating: 2,
    comment:
      "The guide seemed inexperienced and was often confused about the route. They were friendly but not knowledgeable enough about the area.",
    date: "2023-11-02T09:15:00Z",
    status: "flagged",
    response: null,
  },
  {
    id: "review4",
    type: "destination",
    entityId: "D002",
    entityName: "Langtang Valley Trek",
    userName: "Emily Wilson",
    userAvatar: "/avatars/user4.png",
    rating: 5,
    comment:
      "Langtang Valley was stunning, less crowded than Everest and Annapurna. The tea houses were comfortable and the local people were very welcoming. Highly recommend!",
    date: "2023-11-10T16:20:00Z",
    status: "approved",
    response:
      "Thank you for your wonderful review! We're happy to hear you enjoyed the Langtang Valley trek and appreciated the less crowded experience. We'll pass along your kind words to the local communities.",
  },
  {
    id: "review5",
    type: "guide",
    entityId: "G003",
    entityName: "Ahmed Hassan",
    userName: "David Brown",
    userAvatar: "/avatars/user5.png",
    rating: 4,
    comment:
      "Ahmed was very professional and attentive. He made sure everyone in the group was comfortable and safe. Good knowledge of the local culture too.",
    date: "2023-11-05T11:00:00Z",
    status: "pending",
    response: null,
  },
  {
    id: "review6",
    type: "destination",
    entityId: "D003",
    entityName: "Annapurna Circuit",
    userName: "Lisa Taylor",
    userAvatar: "/avatars/user6.png",
    rating: 3,
    comment:
      "The trek was beautiful but too crowded in some areas. Some lodges were fully booked even with advance reservations.",
    date: "2023-10-20T08:30:00Z",
    status: "approved",
    response:
      "Thank you for your feedback. The Annapurna Circuit has indeed become more popular in recent years. We'll work on improving our reservation system and consider adding alternative accommodation options during peak seasons.",
  },
];

export async function GET(request: Request) {
  // Get URL and parse query parameters
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";
  const status = searchParams.get("status");
  const entityId = searchParams.get("entityId");

  // Filter reviews based on query parameters
  let filteredReviews = [...reviews];

  // Filter by type
  if (type !== "all") {
    filteredReviews = filteredReviews.filter((review) =>
      type === "guides"
        ? review.type === "guide"
        : type === "destinations"
        ? review.type === "destination"
        : type === "flagged"
        ? review.status === "flagged"
        : true,
    );
  }

  // Filter by status if provided
  if (status) {
    filteredReviews = filteredReviews.filter(
      (review) => review.status === status,
    );
  }

  // Filter by entityId if provided
  if (entityId) {
    filteredReviews = filteredReviews.filter(
      (review) => review.entityId === entityId,
    );
  }

  // Simulate loading delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({ reviews: filteredReviews });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "type",
      "entityId",
      "userName",
      "rating",
      "comment",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Create a new review (in a real app, this would be saved to a database)
    const newReview = {
      id: `review${reviews.length + 1}`,
      type: body.type,
      entityId: body.entityId,
      entityName:
        body.type === "guide"
          ? [
              "Tenzing Sherpa",
              "Maria Rodriguez",
              "Ahmed Hassan",
              "Hiroshi Tanaka",
            ][Math.floor(Math.random() * 4)]
          : [
              "Everest Base Camp Trek",
              "Langtang Valley Trek",
              "Annapurna Circuit",
              "Gokyo Lakes Trek",
            ][Math.floor(Math.random() * 4)],
      userName: body.userName,
      userAvatar: `/avatars/user${Math.floor(Math.random() * 8) + 1}.png`,
      rating: parseInt(body.rating),
      comment: body.comment,
      date: new Date().toISOString(),
      status: "pending",
      response: null,
    };

    // Simulate adding to database
    // In a real application, you would save to a database here

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ review: newReview, success: true });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
    }

    // In a real app, you would update the review in the database
    // Here we just return success
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}
