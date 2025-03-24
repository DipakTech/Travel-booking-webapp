import { z } from "zod";

// Notification schema
export const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["success", "info", "warning", "error"]),
  read: z.boolean().optional().default(false),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
  relatedEntityName: z.string().optional(),
});

export type Notification = z.infer<typeof notificationSchema>;

// Guide schema
export const guideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  photo: z.string().optional(),
  location: z.object({
    country: z.string().min(1, "Country is required"),
    region: z.string().min(1, "Region is required"),
    city: z.string().optional(),
  }),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  experience: z.object({
    years: z.number().min(0, "Years must be a positive number"),
    level: z.string().min(1, "Experience level is required"),
    expeditions: z.number().optional(),
  }),
  bio: z.string().min(1, "Bio is required"),
  hourlyRate: z.number().min(0, "Hourly rate must be a positive number"),
  availability: z.string().min(1, "Availability is required"),
  rating: z.number().min(0).max(5).optional().default(0),
  reviewCount: z.number().optional().default(0),
  socialMedia: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string().min(1, "Certification name is required"),
        issuedBy: z.string().min(1, "Issuing organization is required"),
        year: z.number().min(1900, "Invalid year"),
        expiryYear: z.number().optional(),
      }),
    )
    .optional(),
  availableDates: z
    .array(
      z.object({
        from: z.date(),
        to: z.date(),
      }),
    )
    .optional(),
  destinations: z.array(z.string()).optional(),
});

export type Guide = z.infer<typeof guideSchema>;

// Transaction schema for booking payments
export const transactionSchema = z.object({
  amount: z.number().min(0, "Amount must be a positive number"),
  currency: z.string().default("USD"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  status: z.string().min(1, "Status is required"),
  date: z.date().default(() => new Date()),
});

export type Transaction = z.infer<typeof transactionSchema>;

// Emergency contact schema
export const emergencyContactSchema = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required").optional(),
});

export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

// Booking schema
export const bookingSchema = z.object({
  customer: z.object({
    id: z.string().min(1, "Customer ID is required"),
    name: z.string().optional(),
    email: z.string().optional(),
  }),
  destination: z.object({
    id: z.string().min(1, "Destination ID is required"),
    name: z.string().optional(),
  }),
  guide: z
    .object({
      id: z.string().min(1, "Guide ID is required"),
      name: z.string().optional(),
    })
    .optional(),
  dates: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  travelers: z.object({
    adults: z.number().min(1, "At least one adult traveler is required"),
    children: z.number().min(0).optional().default(0),
    infants: z.number().min(0).optional().default(0),
  }),
  payment: z.object({
    totalAmount: z.number().min(0, "Total amount must be a positive number"),
    currency: z.string().default("USD"),
    status: z.string().min(1, "Payment status is required"),
    depositAmount: z.number().optional(),
    depositPaid: z.boolean().optional().default(false),
    balanceDueDate: z.date().optional(),
    transactions: z.array(transactionSchema).optional(),
  }),
  status: z
    .enum([
      "pending",
      "confirmed",
      "inProgress",
      "completed",
      "canceled",
      "refunded",
    ])
    .default("pending"),
  specialRequests: z.array(z.string()).optional().default([]),
  accommodations: z
    .array(
      z.object({
        type: z.string().min(1, "Accommodation type is required"),
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
        type: z.string().min(1, "Transportation type is required"),
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
        name: z.string().min(1, "Activity name is required"),
        date: z.date().optional(),
        duration: z.string().optional(),
        included: z.boolean().optional().default(true),
      }),
    )
    .optional(),
  equipmentRental: z
    .array(
      z.object({
        item: z.string().min(1, "Equipment item is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        pricePerUnit: z.number().min(0, "Price must be non-negative"),
      }),
    )
    .optional(),
  emergency: emergencyContactSchema.optional(),
});

export type Booking = z.infer<typeof bookingSchema>;
