import { z } from "zod";

export const destinationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.object({
    country: z.string().min(2, "Country must be at least 2 characters"),
    region: z.string().min(2, "Region must be at least 2 characters"),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  }),
  description: z.string().min(20, "Description must be at least 20 characters"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().default(0),
  price: z.object({
    amount: z.number().positive("Price must be positive"),
    currency: z.string().default("USD"),
    period: z.enum(["per day", "per person", "per group", "total"]),
  }),
  duration: z.object({
    minDays: z.number().int().positive(),
    maxDays: z.number().int().positive(),
  }),
  difficulty: z.enum([
    "easy",
    "moderate",
    "challenging",
    "difficult",
    "extreme",
  ]),
  activities: z.array(z.string()).min(1, "At least one activity is required"),
  seasons: z
    .array(z.enum(["spring", "summer", "autumn", "winter", "all year"]))
    .min(1, "At least one season is required"),
  amenities: z.array(z.string()).optional(),
  availableGuides: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Destination = z.infer<typeof destinationSchema>;

// Sample destination data
export const sampleDestinations: Destination[] = [
  {
    id: "dest1",
    name: "Everest Base Camp",
    location: {
      country: "Nepal",
      region: "Khumbu",
      coordinates: {
        latitude: 27.9881,
        longitude: 86.925,
      },
    },
    description:
      "Trek to the base camp of the world's highest mountain, Mount Everest. Experience breathtaking views of the Himalayas and immerse yourself in Sherpa culture.",
    images: [
      "https://images.unsplash.com/photo-1461770354136-8f58567b617a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGV2ZXJlc3QlMjBiYXNlJTIwY2FtcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1518727818782-ed5341dbd7e4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlcmVzdCUyMGJhc2UlMjBjYW1wfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    price: {
      amount: 1600,
      currency: "USD",
      period: "per person",
    },
    duration: {
      minDays: 12,
      maxDays: 16,
    },
    difficulty: "challenging",
    activities: [
      "trekking",
      "hiking",
      "camping",
      "photography",
      "cultural experience",
    ],
    seasons: ["spring", "autumn"],
    amenities: [
      "tea houses",
      "guided tours",
      "porters available",
      "meals included",
    ],
    availableGuides: ["guide1", "guide2", "guide3"],
  },
  {
    id: "dest2",
    name: "Annapurna Circuit",
    location: {
      country: "Nepal",
      region: "Annapurna",
      coordinates: {
        latitude: 28.597,
        longitude: 83.9973,
      },
    },
    description:
      "The Annapurna Circuit is one of the most popular long-distance treks in Nepal, offering breathtaking mountain views, diverse landscapes, and cultural experiences.",
    images: [
      "https://images.unsplash.com/photo-1604203721489-801e0ab1a1ca?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YW5uYXB1cm5hJTIwY2lyY3VpdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1586437043544-5881407caec1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YW5uYXB1cm5hfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    ],
    featured: true,
    rating: 4.7,
    reviewCount: 98,
    price: {
      amount: 1400,
      currency: "USD",
      period: "per person",
    },
    duration: {
      minDays: 14,
      maxDays: 21,
    },
    difficulty: "challenging",
    activities: [
      "trekking",
      "hiking",
      "hot springs",
      "cultural experience",
      "mountain views",
    ],
    seasons: ["spring", "autumn"],
    amenities: [
      "tea houses",
      "guided tours",
      "porters available",
      "meals included",
    ],
    availableGuides: ["guide1", "guide4", "guide5"],
  },
];
