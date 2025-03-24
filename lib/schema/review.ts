import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(20, "Review content must be at least 20 characters"),
  rating: z.number().min(1).max(5),
  date: z.date(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().url().optional(),
    nationality: z.string().optional(),
  }),
  destination: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  guide: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  trip: z
    .object({
      startDate: z.date(),
      endDate: z.date(),
      duration: z.number().int().positive(),
      type: z.string(),
    })
    .optional(),
  photos: z.array(z.string().url()).optional(),
  highlights: z.array(z.string()).optional(),
  verified: z.boolean().default(false),
  featured: z.boolean().default(false),
  helpfulCount: z.number().default(0),
  unhelpfulCount: z.number().default(0),
  response: z
    .object({
      content: z.string(),
      date: z.date(),
      author: z.object({
        id: z.string(),
        name: z.string(),
        role: z.string(),
      }),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Review = z.infer<typeof reviewSchema>;

// Sample review data
export const sampleReviews: Review[] = [
  {
    id: "review1",
    title: "Unforgettable Everest Base Camp Trek",
    content:
      "The journey to Everest Base Camp was absolutely life-changing. Our guide Tenzing Sherpa was exceptional - knowledgeable, patient, and went above and beyond to ensure everyone in our group had the best experience possible. The views were breathtaking and the cultural experiences along the way enriched the entire trip.",
    rating: 5,
    date: new Date("2023-05-12"),
    author: {
      id: "user1",
      name: "Jennifer Parker",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      nationality: "USA",
    },
    destination: {
      id: "dest1",
      name: "Everest Base Camp",
    },
    guide: {
      id: "guide1",
      name: "Tenzing Sherpa",
    },
    trip: {
      startDate: new Date("2023-04-20"),
      endDate: new Date("2023-05-06"),
      duration: 16,
      type: "Trekking",
    },
    photos: [
      "https://images.unsplash.com/photo-1526772585397-88f8c5b756de?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZXZlcmVzdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1488654715439-fbf461f0eb8d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dHJla3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    highlights: [
      "Sunrise at Kala Patthar",
      "Sherpa culture in Namche Bazaar",
      "Crossing suspension bridges",
      "Monastery at Tengboche",
    ],
    verified: true,
    featured: true,
    helpfulCount: 24,
    unhelpfulCount: 1,
    response: {
      content:
        "Thank you for your kind words, Jennifer! It was a pleasure guiding your group to EBC. I'm glad you enjoyed both the natural beauty and cultural aspects of the journey. Hope to see you again for another Himalayan adventure!",
      date: new Date("2023-05-15"),
      author: {
        id: "guide1",
        name: "Tenzing Sherpa",
        role: "Guide",
      },
    },
    tags: ["everest", "trekking", "himalaya", "nepal", "adventure"],
  },
  {
    id: "review2",
    title: "Amazing Annapurna Circuit Experience",
    content:
      "The Annapurna Circuit exceeded all my expectations. The diverse landscapes, from lush forests to high alpine desert, were incredible. Our guide Maya was fantastic, especially in sharing knowledge about local plants and cultural practices. The tea houses were comfortable, and crossing Thorong La Pass was challenging but rewarding!",
    rating: 5,
    date: new Date("2023-06-28"),
    author: {
      id: "user2",
      name: "Michael Schmidt",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      nationality: "Germany",
    },
    destination: {
      id: "dest2",
      name: "Annapurna Circuit",
    },
    guide: {
      id: "guide2",
      name: "Maya Gurung",
    },
    trip: {
      startDate: new Date("2023-05-15"),
      endDate: new Date("2023-06-05"),
      duration: 21,
      type: "Trekking",
    },
    photos: [
      "https://images.unsplash.com/photo-1571401835393-8c5f35328320?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGFubnB1cm5hfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1544735716-55a119dd7bb9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dHJla2tpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    highlights: [
      "Crossing Thorong La Pass (5,416m)",
      "Hot springs at Jhinu Danda",
      "Apple pie in Manang",
      "Buddhist temples in Muktinath",
      "Views of Annapurna and Dhaulagiri",
    ],
    verified: true,
    featured: true,
    helpfulCount: 18,
    unhelpfulCount: 0,
    tags: ["annapurna", "trekking", "himalaya", "nepal", "adventure"],
  },
];
