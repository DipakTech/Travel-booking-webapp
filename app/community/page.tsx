"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Calendar,
  MessageSquare,
  Camera,
  Heart,
  Share2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { StartDiscussion } from "@/components/StartDiscussion";
import Image from "next/image";

const upcomingEvents = [
  {
    id: 1,
    title: "Everest Base Camp Group Trek",
    date: "March 15, 2024",
    attendees: 24,
    image: "/destinations/abc.jpg",
    location: "Kathmandu, Nepal",
  },
  {
    id: 2,
    title: "Photography Workshop in Bhaktapur",
    date: "March 20, 2024",
    attendees: 15,
    image: "/destinations/abc.jpg",
    location: "Bhaktapur, Nepal",
  },
  {
    id: 3,
    title: "Cultural Exchange Meet",
    date: "March 25, 2024",
    attendees: 40,
    image: "/destinations/abc.jpg",
    location: "Patan, Nepal",
  },
];

const discussions = [
  {
    id: 1,
    title: "Best Time to Trek Annapurna Circuit?",
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    replies: 28,
    likes: 45,
    tags: ["Trekking", "Annapurna", "Season"],
  },
  {
    id: 2,
    title: "Local Food Recommendations in Kathmandu",
    author: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    replies: 34,
    likes: 52,
    tags: ["Food", "Kathmandu", "Local"],
  },
  {
    id: 3,
    title: "Transportation Tips for Nepal",
    author: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    replies: 19,
    likes: 31,
    tags: ["Transport", "Travel Tips"],
  },
];

const travelTips = [
  {
    id: 1,
    title: "Essential Items for Trekking",
    content: "Must-have gear and equipment for your Nepal trek",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Local Customs & Etiquette",
    content: "Respect local traditions and customs while traveling",
    icon: Users,
  },
  {
    id: 3,
    title: "Photography Guidelines",
    content: "Tips for capturing the best shots in Nepal",
    icon: Camera,
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Nepal Guide Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with fellow travelers, share experiences, and get insider
            tips for your Nepal adventure.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search discussions, events, or tips..."
              className="w-full h-12 pl-12 pr-4 rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            />
            <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Upcoming Events
              </h2>
              <Button variant="ghost" className="text-primary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 hover:border-primary/50 transition-colors group"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        width={400}
                        height={400}
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {event.attendees} attending
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Travel Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Quick Travel Tips
            </h2>
            <div className="grid gap-4">
              {travelTips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={tip.id}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/5">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {tip.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Discussions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Recent Discussions
            </h2>
            {/* <Button variant="outline" className="border-primary text-primary">
              Start Discussion
            </Button> */}
            <StartDiscussion />
          </div>

          <div className="grid gap-6">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Image
                    height={100}
                    width={100}
                    src={discussion.avatar}
                    alt={discussion.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {discussion.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discussion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/5 text-primary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <span>By {discussion.author}</span>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {discussion.replies} replies
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        {discussion.likes} likes
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
