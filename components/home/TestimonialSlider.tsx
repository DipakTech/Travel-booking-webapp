"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Adventure Enthusiast",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote:
      "The trek to Everest Base Camp was life-changing. Our guide was incredibly knowledgeable and made sure we were safe and comfortable throughout the journey.",
    rating: 5,
    location: "United States",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Professional Photographer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    quote:
      "The photography tour exceeded my expectations. The guide knew all the perfect spots and times for capturing Nepal's beauty. A must for any photographer!",
    rating: 5,
    location: "Singapore",
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Cultural Explorer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    quote:
      "The cultural immersion experience was authentic and respectful. We learned so much about Nepali traditions and way of life. Unforgettable memories!",
    rating: 5,
    location: "United Kingdom",
  },
];

export function TestimonialSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from our valued customers who have explored Nepal
            with our expert guides
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          {/* Testimonial Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-6">
                <Image
                  width={200}
                  height={200}
                  src={testimonials[currentSlide].image}
                  alt={testimonials[currentSlide].name}
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              </div>

              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <blockquote className="text-xl text-gray-900 mb-6">
                &quot;{testimonials[currentSlide].quote}&quot;
              </blockquote>

              <div>
                <div className="font-semibold text-gray-900">
                  {testimonials[currentSlide].name}
                </div>
                <div className="text-gray-600 text-sm">
                  {testimonials[currentSlide].role} •{" "}
                  {testimonials[currentSlide].location}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-12 h-12 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-sm text-gray-600 hover:text-primary transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-12 h-12 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-sm text-gray-600 hover:text-primary transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? "bg-primary w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
