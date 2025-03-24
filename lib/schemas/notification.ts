import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(["info", "warning", "success", "error"]),
  read: z.boolean(),
  createdAt: z.string(),
  recipientId: z.string(),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  relatedEntity: z
    .object({
      type: z.string(),
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const createNotificationSchema = notificationSchema.omit({
  id: true,
  createdAt: true,
  read: true,
});

export type CreateNotification = z.infer<typeof createNotificationSchema>;
