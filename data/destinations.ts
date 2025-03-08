export const destinations = [
  {
    id: "1",
    title: "Everest Base Camp Trek",
    image: "/destinations/abc.jpg",
    heroImage: "https://images.unsplash.com/photo-1486911278844-a81c5267e227",
    duration: "14 days",
    difficulty: "Challenging",
    bestSeason: "Mar-May, Sep-Nov",
    maxAltitude: "5,364m",
    distance: "130 km",
    startPoint: "Lukla",
    endPoint: "Lukla",
    price: 1899,
    overview:
      "The Everest Base Camp trek is one of the most famous treks in Nepal, taking you through stunning Sherpa villages, Buddhist monasteries, and offering incredible views of Mount Everest and other Himalayan peaks.",
    highlights: [
      "View of Mount Everest and other 8,000m peaks",
      "Visit Namche Bazaar, the gateway to Everest",
      "Experience Sherpa culture and visit monasteries",
      "Trek to Kala Patthar for sunrise views",
      "Visit Everest Base Camp at 5,364m",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu (1,400m)",
        description: "Welcome meeting and trek briefing",
      },
      {
        day: 2,
        title: "Fly to Lukla (2,800m) and trek to Phakding (2,652m)",
        description:
          "Scenic mountain flight and easy trek through Sherpa villages",
      },
      {
        day: 3,
        title: "Trek to Namche Bazaar (3,440m)",
        description: "Steep climb with first views of Everest",
      },
      {
        day: 4,
        title: "Acclimatization day in Namche Bazaar",
        description: "Rest and short hikes to aid acclimatization",
      },
      {
        day: 5,
        title: "Trek to Tengboche (3,870m)",
        description: "Visit the famous Tengboche Monastery",
      },
    ],
    includes: [
      "All ground transportation",
      "3-star hotel accommodation in Kathmandu",
      "Teahouse accommodation during trek",
      "Experienced English-speaking guide",
      "Porter service (2:1 ratio)",
      "All necessary permits and fees",
      "All government and local taxes",
    ],
    excludes: [
      "International airfare",
      "Nepal visa fee",
      "Travel insurance",
      "Personal expenses",
      "Tips for guides and porters",
    ],
    recommendedGuides: ["1", "2"], // References to guide IDs
    reviews: [
      {
        id: 1,
        user: "James Wilson",
        rating: 5,
        date: "March 2024",
        comment:
          "An incredible journey to EBC. The views were breathtaking and our guide was extremely professional and knowledgeable.",
      },
      {
        id: 2,
        user: "Sophie Chen",
        rating: 5,
        date: "October 2023",
        comment:
          "Challenging but rewarding trek. The team took great care of us and the scenery was beyond amazing.",
      },
    ],
  },
  {
    id: "2",
    title: "Annapurna Circuit",
    image: "/destinations/annapurna.jpg",
    heroImage: "https://images.unsplash.com/photo-1463693396721-8ca0cfa2b3b5",
    duration: "12-16 days",
    difficulty: "Moderate to Challenging",
    bestSeason: "Oct-Nov, Mar-Apr",
    maxAltitude: "5,416m",
    distance: "160-230 km",
    startPoint: "Besisahar",
    endPoint: "Pokhara",
    price: 1499,
    overview:
      "The Annapurna Circuit is one of the most diverse treks in Nepal, offering incredible variety in terms of landscapes, culture, and climate zones. From subtropical valleys to the high-altitude Thorong La Pass, this trek is a complete Himalayan experience.",
    highlights: [
      "Cross the challenging Thorong La Pass (5,416m)",
      "Visit the holy temple of Muktinath",
      "Experience diverse landscapes and cultures",
      "Hot springs at Tatopani",
      "Views of the Annapurna and Dhaulagiri ranges",
    ],
    itinerary: [
      {
        day: 1,
        title: "Drive to Besisahar (760m)",
        description: "Start of the trek, overnight in local guesthouse",
      },
      {
        day: 2,
        title: "Trek to Bahundanda (1,310m)",
        description: "Follow the Marsyangdi River valley",
      },
      {
        day: 3,
        title: "Trek to Jagat (1,300m)",
        description: "Pass through traditional villages",
      },
    ],
    includes: [
      "All ground transportation",
      "Teahouse accommodation during trek",
      "Experienced guide and porters",
      "TIMS and ACAP permits",
      "First aid medical kit",
    ],
    excludes: [
      "International airfare",
      "Personal equipment",
      "Travel insurance",
      "Extra expenses due to delays",
    ],
    recommendedGuides: ["2", "3"],
    reviews: [
      {
        id: 1,
        user: "Michael Brown",
        rating: 5,
        date: "November 2023",
        comment:
          "The diversity of landscapes and cultures on this trek is amazing. A truly unforgettable experience.",
      },
    ],
  },
];
