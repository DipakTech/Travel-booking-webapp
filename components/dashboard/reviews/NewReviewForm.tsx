"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

// Mock data for guides and destinations
const guides = [
  { id: "G001", name: "Tenzing Sherpa" },
  { id: "G002", name: "Maria Rodriguez" },
  { id: "G003", name: "Ahmed Hassan" },
  { id: "G004", name: "Hiroshi Tanaka" },
];

const destinations = [
  { id: "D001", name: "Everest Base Camp Trek" },
  { id: "D002", name: "Langtang Valley Trek" },
  { id: "D003", name: "Annapurna Circuit" },
  { id: "D004", name: "Gokyo Lakes Trek" },
];

// Define the validation schema for the form
const reviewFormSchema = z.object({
  reviewType: z.enum(["guide", "destination"], {
    required_error: "Please select what you're reviewing",
  }),
  entityId: z.string({
    required_error: "Please select a guide or destination",
  }),
  userName: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  userEmail: z.string().email({
    message: "Please enter a valid email address",
  }),
  rating: z.coerce.number().min(1).max(5, {
    message: "Please select a rating between 1 and 5",
  }),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters",
  }),
});

type FormValues = z.infer<typeof reviewFormSchema>;

interface NewReviewFormProps {
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
}

export function NewReviewForm({
  onSubmit,
  isSubmitting = false,
}: NewReviewFormProps) {
  const [selectedType, setSelectedType] = useState<
    "guide" | "destination" | null
  >(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      comment: "",
      rating: 5,
    },
  });

  // When review type changes, reset the entityId field
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "reviewType") {
        form.setValue("entityId", "");
        setSelectedType(value.reviewType as "guide" | "destination" | null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const renderStarRating = () => {
    const rating = form.watch("rating") || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "p-0 h-auto",
              star <= rating ? "text-yellow-500" : "text-gray-300",
            )}
            onClick={() => form.setValue("rating", star)}
          >
            <Star
              className={cn(
                "h-8 w-8",
                star <= rating ? "fill-yellow-400 text-yellow-400" : "",
              )}
            />
            <span className="sr-only">{star} stars</span>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="reviewType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What are you reviewing?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="guide" />
                        </FormControl>
                        <FormLabel className="font-normal">Guide</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="destination" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Destination
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType && (
              <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedType === "guide"
                        ? "Select Guide"
                        : "Select Destination"}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select a ${selectedType}`}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedType === "guide"
                          ? guides.map((guide) => (
                              <SelectItem key={guide.id} value={guide.id}>
                                {guide.name}
                              </SelectItem>
                            ))
                          : destinations.map((destination) => (
                              <SelectItem
                                key={destination.id}
                                value={destination.id}
                              >
                                {destination.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter customer email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  {renderStarRating()}
                  <FormDescription>
                    Click on a star to set the rating
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the customer's review"
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
