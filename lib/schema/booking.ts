import { z } from "zod";

export const bookingSchema = z.object({
  id: z.string().optional(),
  bookingNumber: z.string(),
  status: z.enum([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "refunded",
  ]),
  customer: z.object({
    id: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    avatar: z.string().url().optional(),
    nationality: z.string().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string(),
      })
      .optional(),
  }),
  destination: z.object({
    id: z.string(),
    name: z.string(),
    location: z.string().optional(),
  }),
  guide: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  dates: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
  duration: z.number().int().positive(),
  travelers: z.object({
    adults: z.number().int().nonnegative(),
    children: z.number().int().nonnegative().default(0),
    infants: z.number().int().nonnegative().default(0),
    total: z.number().int().positive(),
  }),
  accommodations: z
    .array(
      z.object({
        type: z.string(),
        name: z.string().optional(),
        location: z.string().optional(),
        checkIn: z.date().optional(),
        checkOut: z.date().optional(),
      }),
    )
    .optional(),
  transportation: z
    .array(
      z.object({
        type: z.string(),
        details: z.string().optional(),
        departureDate: z.date().optional(),
        departureLocation: z.string().optional(),
        arrivalDate: z.date().optional(),
        arrivalLocation: z.string().optional(),
      }),
    )
    .optional(),
  activities: z
    .array(
      z.object({
        name: z.string(),
        date: z.date().optional(),
        duration: z.string().optional(),
        included: z.boolean().default(true),
      }),
    )
    .optional(),
  specialRequests: z.array(z.string()).optional(),
  equipmentRental: z
    .array(
      z.object({
        item: z.string(),
        quantity: z.number().int().positive(),
        pricePerUnit: z.number().nonnegative(),
      }),
    )
    .optional(),
  payment: z.object({
    totalAmount: z.number().positive(),
    currency: z.string().default("USD"),
    status: z.enum(["pending", "partial", "completed", "refunded"]),
    transactions: z
      .array(
        z.object({
          id: z.string(),
          date: z.date(),
          amount: z.number().positive(),
          method: z.string(),
          status: z.enum(["pending", "completed", "failed", "refunded"]),
        }),
      )
      .optional(),
    depositAmount: z.number().nonnegative().optional(),
    depositPaid: z.boolean().default(false),
    balanceDueDate: z.date().optional(),
  }),
  documents: z
    .array(
      z.object({
        type: z.string(),
        name: z.string(),
        url: z.string().url(),
        uploadDate: z.date(),
      }),
    )
    .optional(),
  notes: z
    .array(
      z.object({
        content: z.string(),
        date: z.date(),
        author: z.string(),
      }),
    )
    .optional(),
  emergency: z
    .object({
      contactName: z.string(),
      relationship: z.string(),
      phone: z.string(),
      email: z.string().email().optional(),
    })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Booking = z.infer<typeof bookingSchema>;

// Sample booking data
export const sampleBookings: Booking[] = [
  {
    id: "booking1",
    bookingNumber: "B1234",
    status: "confirmed",
    customer: {
      id: "cust1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1234567890",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      nationality: "USA",
      address: {
        street: "123 Main St",
        city: "Boston",
        state: "MA",
        postalCode: "02108",
        country: "USA",
      },
    },
    destination: {
      id: "dest1",
      name: "Everest Base Camp",
      location: "Nepal",
    },
    guide: {
      id: "guide1",
      name: "Tenzing Sherpa",
    },
    dates: {
      startDate: new Date("2023-10-15"),
      endDate: new Date("2023-10-30"),
    },
    duration: 16,
    travelers: {
      adults: 2,
      children: 0,
      infants: 0,
      total: 2,
    },
    accommodations: [
      {
        type: "Tea House",
        name: "Namche Bazaar Lodge",
        location: "Namche Bazaar",
        checkIn: new Date("2023-10-17"),
        checkOut: new Date("2023-10-19"),
      },
      {
        type: "Tea House",
        name: "Dingboche Inn",
        location: "Dingboche",
        checkIn: new Date("2023-10-21"),
        checkOut: new Date("2023-10-22"),
      },
    ],
    transportation: [
      {
        type: "Flight",
        details: "Kathmandu to Lukla",
        departureDate: new Date("2023-10-15T08:00:00"),
        departureLocation: "Kathmandu Airport",
        arrivalDate: new Date("2023-10-15T08:45:00"),
        arrivalLocation: "Lukla Airport",
      },
    ],
    activities: [
      {
        name: "Acclimatization hike to Khumjung",
        date: new Date("2023-10-18"),
        duration: "4 hours",
        included: true,
      },
      {
        name: "Visit to Tengboche Monastery",
        date: new Date("2023-10-20"),
        duration: "1 hour",
        included: true,
      },
    ],
    specialRequests: ["Vegetarian meals", "Extra water purification tablets"],
    equipmentRental: [
      {
        item: "Sleeping bag (-20°C)",
        quantity: 2,
        pricePerUnit: 50,
      },
      {
        item: "Trekking poles",
        quantity: 2,
        pricePerUnit: 25,
      },
    ],
    payment: {
      totalAmount: 3200,
      currency: "USD",
      status: "completed",
      transactions: [
        {
          id: "trans1",
          date: new Date("2023-07-15"),
          amount: 800,
          method: "Credit Card",
          status: "completed",
        },
        {
          id: "trans2",
          date: new Date("2023-09-01"),
          amount: 2400,
          method: "Bank Transfer",
          status: "completed",
        },
      ],
      depositAmount: 800,
      depositPaid: true,
      balanceDueDate: new Date("2023-09-15"),
    },
    documents: [
      {
        type: "Itinerary",
        name: "Detailed Itinerary.pdf",
        url: "https://example.com/documents/itinerary-b1234.pdf",
        uploadDate: new Date("2023-07-20"),
      },
      {
        type: "Insurance",
        name: "Travel Insurance.pdf",
        url: "https://example.com/documents/insurance-b1234.pdf",
        uploadDate: new Date("2023-08-10"),
      },
    ],
    emergency: {
      contactName: "Jane Smith",
      relationship: "Wife",
      phone: "+1987654321",
      email: "jane.smith@example.com",
    },
    notes: [
      {
        content:
          "Customers celebrating their 10th wedding anniversary during the trip.",
        date: new Date("2023-07-16"),
        author: "Booking Agent",
      },
    ],
    createdAt: new Date("2023-07-15"),
    updatedAt: new Date("2023-09-01"),
  },
  {
    id: "booking2",
    bookingNumber: "B1235",
    status: "pending",
    customer: {
      id: "cust2",
      name: "Maria Johnson",
      email: "maria.johnson@example.com",
      phone: "+4412345678",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      nationality: "UK",
      address: {
        street: "45 Park Lane",
        city: "London",
        postalCode: "W1K 1PN",
        country: "UK",
      },
    },
    destination: {
      id: "dest2",
      name: "Annapurna Circuit",
      location: "Nepal",
    },
    guide: {
      id: "guide2",
      name: "Maya Gurung",
    },
    dates: {
      startDate: new Date("2023-12-05"),
      endDate: new Date("2023-12-25"),
    },
    duration: 21,
    travelers: {
      adults: 1,
      children: 0,
      infants: 0,
      total: 1,
    },
    payment: {
      totalAmount: 1800,
      currency: "USD",
      status: "partial",
      transactions: [
        {
          id: "trans3",
          date: new Date("2023-08-20"),
          amount: 450,
          method: "Credit Card",
          status: "completed",
        },
      ],
      depositAmount: 450,
      depositPaid: true,
      balanceDueDate: new Date("2023-11-05"),
    },
    createdAt: new Date("2023-08-20"),
    updatedAt: new Date("2023-08-20"),
  },
];
