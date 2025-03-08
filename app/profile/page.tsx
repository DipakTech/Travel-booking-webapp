"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Phone,
  Globe,
  Camera,
  Edit3,
  BookOpen,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <Container className="py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Profile Header */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 rounded-2xl overflow-hidden"
        >
          <div className="h-48 bg-gradient-to-r from-primary/80 to-primary relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute -bottom-16 left-8 p-1 bg-white dark:bg-gray-900 rounded-2xl">
            <div className="relative h-32 w-32 rounded-xl overflow-hidden">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile Info & Tabs */}
        <div className="mt-20">
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-8"
          >
            {/* Left Column - Profile Info */}
            <div className="w-full md:w-1/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Profile Info</span>
                    <Button size="icon" variant="ghost">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <User className="h-5 w-5" />
                    <span>{session.user.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Mail className="h-5 w-5" />
                    <span>{session.user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5" />
                    <span>Kathmandu, Nepal</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Calendar className="h-5 w-5" />
                    <span>Joined March 2024</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-2xl font-bold text-primary">28</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Tours
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-2xl font-bold text-primary">142</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Reviews
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tabs Content */}
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="tours" className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger
                    value="tours"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Tours</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Reviews</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Saved</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tours" className="space-y-6">
                  {/* Tours Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((tour) => (
                      <motion.div
                        key={tour}
                        variants={itemVariants}
                        className="group cursor-pointer"
                      >
                        <Card className="overflow-hidden">
                          <div className="relative h-48">
                            <Image
                              src={`/tour-${tour}.jpg`}
                              alt={`Tour ${tour}`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">
                              Everest Base Camp Trek
                            </h3>
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                              <span>14 Days</span>
                              <span>$1,499</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <motion.div key={review} variants={itemVariants}>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">John Doe</p>
                                  <p className="text-sm text-gray-500">
                                    2 days ago
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className="text-yellow-400 text-lg"
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                              Amazing experience! The guide was very
                              knowledgeable and friendly. Would definitely
                              recommend this tour to others.
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="saved">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((saved) => (
                      <motion.div key={saved} variants={itemVariants}>
                        <Card className="overflow-hidden">
                          <div className="relative h-48">
                            <Image
                              src={`/destination-${saved}.jpg`}
                              alt={`Saved ${saved}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 text-white hover:bg-white/20"
                            >
                              <Heart className="h-5 w-5 fill-current" />
                            </Button>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">
                              Annapurna Circuit
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              A beautiful trek through the Annapurna range
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Container>
  );
}
