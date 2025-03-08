export interface Guide {
  id: string | number;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  languages: string[];
  specialties: string[];
  certifications: string[];
  price: string | number;
  availability?: string;
  availableDates?: string[];
  bio?: string;
  about?: string;
  recentReviews?: Array<{
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}
