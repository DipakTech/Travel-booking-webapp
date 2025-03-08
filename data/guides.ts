import { Guide } from "@/types/guide";

export const guides: Guide[] = [
  {
    id: "1",
    name: "Alex Thompson",
    image: "/guides/guide-1.jpg",
    rating: 4.9,
    reviews: 127,
    location: "Swiss Alps",
    price: 250,
    experience: "8 years",
    languages: ["English", "German", "French"],
    specialties: ["Alpine Climbing", "Glacier Traverses", "Ice Climbing"],
    certifications: ["IFMGA/UIAGM", "Wilderness First Aid"],
    about:
      "Expert mountaineer specializing in Alpine climbs and glacier traverses. Certified mountain guide with extensive experience in the Swiss Alps.",
    availableDates: [
      "2024-03-15",
      "2024-03-16",
      "2024-03-17",
      "2024-03-20",
      "2024-03-21",
    ],
    recentReviews: [
      {
        id: 1,
        user: "Sarah M.",
        rating: 5,
        comment:
          "Incredible experience! Alex's knowledge and expertise made our climb both safe and enjoyable.",
        date: "2024-02-28",
      },
      {
        id: 2,
        user: "James K.",
        rating: 4.8,
        comment: "Great technical skills and very patient with beginners.",
        date: "2024-02-25",
      },
    ],
  },
  {
    id: "2",
    name: "Maria Garcia",
    image: "/guides/guide-1.jpg",
    rating: 4.8,
    reviews: 98,
    location: "Dolomites",
    price: 200,
    experience: "6 years",
    languages: ["English", "Italian", "Spanish"],
    specialties: ["Rock Climbing", "Via Ferrata", "Multi-pitch"],
    certifications: ["UIAGM", "First Aid"],
    about:
      "Passionate about rock climbing and via ferrata. Specializes in multi-pitch routes and technical climbing in the Dolomites.",
    availableDates: ["2024-03-14", "2024-03-15", "2024-03-18", "2024-03-19"],
    recentReviews: [
      {
        id: 1,
        user: "Michael R.",
        rating: 5,
        comment:
          "Maria's expertise in the Dolomites is unmatched. She made our climbing experience unforgettable.",
        date: "2024-02-27",
      },
    ],
  },
  {
    id: "3",
    name: "John Baker",
    image: "/guides/guide-1.jpg",
    rating: 4.7,
    reviews: 85,
    location: "Scottish Highlands",
    price: 180,
    experience: "10 years",
    languages: ["English"],
    specialties: ["Winter Mountaineering", "Navigation", "Winter Skills"],
    certifications: ["MIC", "Winter Mountain Leader"],
    about:
      "Winter mountaineering specialist with extensive experience in Scottish winter conditions. Expert in navigation and winter skills.",
    availableDates: ["2024-04-01", "2024-04-02", "2024-04-03", "2024-04-04"],
    recentReviews: [
      {
        id: 1,
        user: "David L.",
        rating: 4.5,
        comment:
          "John's winter skills instruction was thorough and professional.",
        date: "2024-02-20",
      },
    ],
  },
];
