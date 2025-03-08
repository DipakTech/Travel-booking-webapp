"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquarePlus,
  Hash,
  Image as ImageIcon,
  Link as LinkIcon,
  Smile,
  AtSign,
  Tag,
} from "lucide-react";

export function StartDiscussion() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { value: "trekking", label: "Trekking & Hiking" },
    { value: "culture", label: "Culture & Heritage" },
    { value: "adventure", label: "Adventure Sports" },
    { value: "food", label: "Food & Cuisine" },
    { value: "accommodation", label: "Accommodation" },
    { value: "transportation", label: "Transportation" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90 text-white"
        >
          <MessageSquarePlus className="h-5 w-5" />
          Start Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or start a conversation with the
            community.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-4"
        >
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What would you like to discuss?"
              className="h-12"
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="cursor-pointer"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div className="relative">
              <Textarea
                id="content"
                placeholder="Share your thoughts..."
                className="min-h-[120px] resize-none px-4 py-3 pr-12"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Smile className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <AtSign className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input
                id="tags"
                placeholder="Add tags separated by commas"
                className="h-12 pl-10"
              />
            </div>
            <p className="text-sm text-gray-500">
              Add up to 5 tags to help others find your discussion
            </p>
          </div>
        </motion.div>

        <DialogFooter>
          <div className="flex items-center gap-2 justify-end w-full">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-12"
            >
              Cancel
            </Button>
            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white">
              Post Discussion
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
