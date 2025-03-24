import { notificationSchema } from "@/lib/schema";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * Type for notification filters
 */
export type NotificationFilters = {
  recipientId?: string;
  type?: string;
  read?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
};

/**
 * Service for handling notification operations
 */
export const notificationService = {
  /**
   * Get notifications with optional filters
   */
  async getNotifications(filters: NotificationFilters = {}) {
    const { recipientId, type, read, search, limit = 10, offset = 0 } = filters;

    // Base where condition
    const where: Prisma.NotificationWhereInput = {};

    // Add filters to query
    if (recipientId) {
      where.recipientId = recipientId;
    }

    if (type && type !== "all") {
      where.type = type;
    }

    if (read !== undefined) {
      where.read = read;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { relatedEntityName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.notification.count({ where });

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        timestamp: "desc",
      },
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        read: true,
        timestamp: true,
        time: true,
        date: true,
        actionUrl: true,
        actionLabel: true,
        relatedEntityType: true,
        relatedEntityId: true,
        relatedEntityName: true,
      },
    });

    return { notifications, total };
  },

  /**
   * Get a notification by ID
   */
  async getNotificationById(id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    return notification;
  },

  /**
   * Create a new notification
   */
  async createNotification(
    data: z.infer<typeof notificationSchema> & { recipientId: string },
  ) {
    // Get current date and time for formatting
    const now = new Date();

    // Format time and date for display
    const time = "Just now";
    const date = "Today";

    const notification = await prisma.notification.create({
      data: {
        ...data,
        time,
        date,
      },
    });

    return notification;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return notification;
  },

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(ids: string[]) {
    await prisma.notification.updateMany({
      where: {
        id: { in: ids },
      },
      data: { read: true },
    });

    return { success: true };
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        read: false,
      },
      data: { read: true },
    });

    return { success: true };
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: string) {
    await prisma.notification.delete({
      where: { id },
    });

    return { success: true };
  },

  /**
   * Delete multiple notifications
   */
  async deleteMultipleNotifications(ids: string[]) {
    await prisma.notification.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return { success: true };
  },

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: {
        recipientId: userId,
        read: false,
      },
    });

    return { count };
  },
};

export default notificationService;
