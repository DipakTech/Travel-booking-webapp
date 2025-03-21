"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Upload } from "lucide-react";

// Form schema with validation
const destinationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  longDescription: z.string().min(50, {
    message: "Long description must be at least 50 characters.",
  }),
  altitude: z.string().optional(),
  bestSeason: z.string().optional(),
  difficulty: z.string().optional(),
  duration: z.string().optional(),
  averageCost: z.string().optional(),
  status: z.enum(["popular", "trending", "new"]),
  highlights: z.string().optional(),
});

type DestinationFormValues = z.infer<typeof destinationFormSchema>;

interface DestinationFormProps {
  defaultValues?: Partial<DestinationFormValues>;
  onSubmit: (data: DestinationFormValues) => void;
  isLoading?: boolean;
}

export function DestinationForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: DestinationFormProps) {
  // Initialize form with react-hook-form
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      location: defaultValues?.location || "",
      description: defaultValues?.description || "",
      longDescription: defaultValues?.longDescription || "",
      altitude: defaultValues?.altitude || "",
      bestSeason: defaultValues?.bestSeason || "",
      difficulty: defaultValues?.difficulty || "",
      duration: defaultValues?.duration || "",
      averageCost: defaultValues?.averageCost || "",
      status: defaultValues?.status || "new",
      highlights: defaultValues?.highlights || "",
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Destination Information</CardTitle>
        <CardDescription>
          Enter the details about this destination
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Everest Base Camp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Khumbu Region, Nepal"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the destination..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A concise summary that will appear in listings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the destination..."
                        className="min-h-[160px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comprehensive details about the destination
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Challenging">
                            Challenging
                          </SelectItem>
                          <SelectItem value="Difficult">Difficult</SelectItem>
                          <SelectItem value="Extreme">Extreme</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="popular">Popular</SelectItem>
                          <SelectItem value="trending">Trending</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="7-10 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="altitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Altitude</FormLabel>
                      <FormControl>
                        <Input placeholder="5,364 meters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="averageCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Cost</FormLabel>
                      <FormControl>
                        <Input placeholder="$1,500 - $3,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bestSeason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Best Season</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="March-May, September-November"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="highlights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highlights</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter each highlight on a new line..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List the key highlights, one per line
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Destination Images</FormLabel>
                <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop image files or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Main image and gallery images for the destination)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Select Images
                  </Button>
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-end px-0 pb-0">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Destination"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
