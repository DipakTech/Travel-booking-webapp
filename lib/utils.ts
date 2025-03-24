import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique booking number
 * Format: B-YYYYMMDD-XXXX where XXXX is a random number
 */
export function generateBookingNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Generate a random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);

  return `B-${year}${month}${day}-${random}`;
}
