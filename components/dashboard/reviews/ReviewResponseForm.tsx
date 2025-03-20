"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle } from "lucide-react";

const responseSchema = z.object({
  response: z.string().min(10, {
    message: "Response must be at least 10 characters long",
  }),
});

type FormValues = z.infer<typeof responseSchema>;

interface ReviewResponseFormProps {
  reviewId: string;
  defaultValue?: string;
  onSuccess?: (data: FormValues) => Promise<boolean | undefined>;
}

export function ReviewResponseForm({
  reviewId,
  defaultValue = "",
  onSuccess,
}: ReviewResponseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: defaultValue,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitSuccess(false);
      setSubmitError(null);

      if (onSuccess) {
        const success = await onSuccess(data);
        if (success) {
          setSubmitSuccess(true);
          form.reset({ response: data.response });
        }
      } else {
        // Default implementation if no onSuccess handler provided
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Here you would normally make an API call
        // Example: await fetch(`/api/reviews/${reviewId}/respond`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });

        setSubmitSuccess(true);
        // Optional: refresh the page or router
        // router.refresh();
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      setSubmitError("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your response to this review..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This response will be visible to the customer and publicly
                displayed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitSuccess && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
            <CheckCircle className="h-4 w-4" />
            <span>Response submitted successfully!</span>
          </div>
        )}

        {submitError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Response"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
