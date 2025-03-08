import { Star, Languages, MapPin, Award, Clock } from "lucide-react";
import { guides } from "@/data/guides";
import { notFound } from "next/navigation";
import { BookingSection } from "@/components/guides/BookingSection";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GuideDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return guides.map((guide) => ({
    id: guide.id,
  }));
}

export default function GuideDetailPage({ params }: GuideDetailPageProps) {
  const guideData = guides.find((guide) => guide.id === params.id);

  if (!guideData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10" />
            <Image
              src={guideData.image}
              alt={guideData.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <Container className="relative z-20 h-full flex items-end pb-6 sm:pb-12">
            <div className="backdrop-blur-xl bg-white/30 dark:bg-black/30 p-4 sm:p-6 rounded-2xl border border-white/20 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    {guideData.name}
                  </h1>
                  <div className="flex flex-wrap items-center text-white/90 gap-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {guideData.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {guideData.experience}
                    </div>
                  </div>
                </div>
                <div className="flex items-center bg-white/20 dark:bg-black/20 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10 self-start">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-white font-medium">
                    {guideData.rating}
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Specialties */}
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/20 dark:border-gray-800/20 p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Specialties
                </h2>
                <div className="flex flex-wrap gap-2">
                  {guideData.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className={cn(
                        "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium backdrop-blur-sm",
                        "bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20",
                        "text-primary dark:text-primary/90",
                      )}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/20 dark:border-gray-800/20 p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  About
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {guideData.about}
                </p>
              </div>

              {/* Certifications & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/20 dark:border-gray-800/20 p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Certifications
                  </h2>
                  <div className="space-y-4">
                    {guideData.certifications.map((cert) => (
                      <div
                        key={cert}
                        className="flex items-center p-3 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20"
                      >
                        <Award className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">
                          {cert}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/20 dark:border-gray-800/20 p-6 sm:p-8">
                  <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Languages
                  </h2>
                  <div className="space-y-4">
                    {guideData.languages.map((language) => (
                      <div
                        key={language}
                        className="flex items-center p-3 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 dark:border-primary/20"
                      >
                        <Languages className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">
                          {language}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/20 dark:border-gray-800/20 p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Recent Reviews
                </h2>
                <div className="space-y-6">
                  {guideData?.recentReviews?.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {review.user}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center px-3 py-1 bg-yellow-400/10 dark:bg-yellow-400/5 rounded-full self-start">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="ml-1 text-yellow-700 dark:text-yellow-500 font-medium">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingSection
                  price={
                    typeof guideData.price === "string"
                      ? parseInt(guideData.price.replace(/[^\d]/g, ""), 10)
                      : guideData.price
                  }
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
