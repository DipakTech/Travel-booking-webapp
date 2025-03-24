import { z } from "zod";

export const guideSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  photo: z.string().url().optional(),
  location: z.object({
    country: z.string(),
    region: z.string(),
    city: z.string().optional(),
  }),
  languages: z
    .array(z.string())
    .min(1, "Guide must speak at least one language"),
  specialties: z
    .array(z.string())
    .min(1, "Guide must have at least one specialty"),
  experience: z.object({
    years: z.number().int().nonnegative(),
    level: z.enum(["beginner", "intermediate", "expert", "master"]),
    expeditions: z.number().int().nonnegative().optional(),
  }),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuedBy: z.string(),
        year: z.number().int(),
        expiryYear: z.number().int().optional(),
      }),
    )
    .optional(),
  hourlyRate: z.number().positive("Hourly rate must be positive"),
  availability: z.enum(["available", "partially_available", "unavailable"]),
  availableDates: z
    .array(
      z.object({
        from: z.date(),
        to: z.date(),
      }),
    )
    .optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().nonnegative().default(0),
  destinations: z.array(z.string()).optional(),
  socialMedia: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Guide = z.infer<typeof guideSchema>;

// Sample guide data
export const sampleGuides: Guide[] = [
  {
    id: "guide1",
    name: "Tenzing Sherpa",
    email: "tenzing@guidehub.com",
    phone: "+9779876543210",
    photo:
      "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3VpZGV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    location: {
      country: "Nepal",
      region: "Khumbu",
      city: "Namche Bazaar",
    },
    languages: ["Nepali", "English", "Sherpa", "Hindi"],
    specialties: [
      "Everest Region",
      "High Altitude Trekking",
      "Expedition Support",
      "Photography",
    ],
    experience: {
      years: 15,
      level: "master",
      expeditions: 28,
    },
    bio: "Born and raised in the Khumbu region, I have been guiding treks to Everest Base Camp and other Himalayan destinations for over 15 years. With 12 successful summits of Mount Everest, I bring unparalleled expertise to ensure your journey is both safe and unforgettable.",
    certifications: [
      {
        name: "Mountaineering Guide License",
        issuedBy: "Nepal Mountaineering Association",
        year: 2008,
      },
      {
        name: "Wilderness First Responder",
        issuedBy: "International Alpine Association",
        year: 2010,
        expiryYear: 2025,
      },
    ],
    hourlyRate: 25,
    availability: "available",
    availableDates: [
      {
        from: new Date("2023-09-01"),
        to: new Date("2023-11-30"),
      },
      {
        from: new Date("2024-03-01"),
        to: new Date("2024-05-30"),
      },
    ],
    rating: 4.9,
    reviewCount: 145,
    destinations: ["dest1", "dest2"],
    socialMedia: {
      instagram: "tenzingsherpa_everest",
      facebook: "tenzingsherpa.guide",
    },
  },
  {
    id: "guide2",
    name: "Maya Gurung",
    email: "maya@guidehub.com",
    phone: "+9779812345678",
    photo:
      "https://images.unsplash.com/photo-1536321115970-5dfa13356211?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Z3VpZGV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    location: {
      country: "Nepal",
      region: "Annapurna",
      city: "Pokhara",
    },
    languages: ["Nepali", "English", "German"],
    specialties: [
      "Annapurna Circuit",
      "Cultural Tours",
      "Women's Trekking Groups",
      "Botany",
    ],
    experience: {
      years: 8,
      level: "expert",
      expeditions: 56,
    },
    bio: "As one of Nepal's pioneering female trekking guides, I specialize in creating safe and empowering experiences, especially for women travelers. With extensive knowledge of local flora and culture, I'll help you discover the heart of Nepal beyond just the mountains.",
    certifications: [
      {
        name: "Trekking Guide License",
        issuedBy: "Nepal Tourism Board",
        year: 2015,
      },
      {
        name: "Botanical Guide Certification",
        issuedBy: "Nepal Botanical Society",
        year: 2018,
      },
    ],
    hourlyRate: 22,
    availability: "partially_available",
    availableDates: [
      {
        from: new Date("2023-10-15"),
        to: new Date("2023-12-15"),
      },
    ],
    rating: 4.8,
    reviewCount: 87,
    destinations: ["dest2"],
    socialMedia: {
      instagram: "maya_gurung_trek",
      facebook: "mayagurung.trekking",
    },
  },
];
