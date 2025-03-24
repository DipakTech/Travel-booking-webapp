import { notificationSchema } from "@/lib/schema";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

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
      ];
    }

    // Get total count
    const total = await prisma.notification.count({ where });

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        read: true,
        createdAt: true,
        actionUrl: true,
        actionLabel: true,
        relatedEntityType: true,
        relatedEntityId: true,
        relatedEntityName: true,
      },
    });

    // Transform notifications to include relative time
    const transformedNotifications = notifications.map((notification) => {
      // Create relatedEntity object from individual fields
      let relatedEntity = null;
      if (notification.relatedEntityType) {
        relatedEntity = {
          type: notification.relatedEntityType,
          id: notification.relatedEntityId,
          name: notification.relatedEntityName,
        };
      }

      return {
        ...notification,
        relatedEntity,
        timeAgo: formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
        }),
      };
    });

    return { notifications: transformedNotifications, total };
  },

  /**
   * Get a notification by ID
   */
  async getNotificationById(id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        read: true,
        createdAt: true,
        actionUrl: true,
        actionLabel: true,
        relatedEntityType: true,
        relatedEntityId: true,
        relatedEntityName: true,
      },
    });

    if (!notification) return null;

    // Create relatedEntity object
    let relatedEntity = null;
    if (notification.relatedEntityType) {
      relatedEntity = {
        type: notification.relatedEntityType,
        id: notification.relatedEntityId,
        name: notification.relatedEntityName,
      };
    }

    return {
      ...notification,
      relatedEntity,
      timeAgo: formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
      }),
    };
  },

  /**
   * Create a new notification
   */
  async createNotification(
    data: z.infer<typeof notificationSchema> & { recipientId: string },
  ) {
    // Create notificationData from the incoming data
    const notificationData = {
      // Include all basic notification fields
      title: data.title,
      description: data.description,
      type: data.type,
      recipientId: data.recipientId,
      read: data.read !== undefined ? data.read : false,

      // Include optional fields if they exist
      ...(data.actionUrl ? { actionUrl: data.actionUrl } : {}),
      ...(data.actionLabel ? { actionLabel: data.actionLabel } : {}),

      // Include related entity fields if they exist
      ...(data.relatedEntityType
        ? { relatedEntityType: data.relatedEntityType }
        : {}),
      ...(data.relatedEntityId
        ? { relatedEntityId: data.relatedEntityId }
        : {}),
      ...(data.relatedEntityName
        ? { relatedEntityName: data.relatedEntityName }
        : {}),

      createdAt: new Date().toISOString(),
    };

    const notification = await prisma.notification.create({
      data: notificationData,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        read: true,
        createdAt: true,
        actionUrl: true,
        actionLabel: true,
        relatedEntityType: true,
        relatedEntityId: true,
        relatedEntityName: true,
      },
    });

    // Transform the response
    return {
      ...notification,
      relatedEntity: notification.relatedEntityType
        ? {
            type: notification.relatedEntityType,
            id: notification.relatedEntityId,
            name: notification.relatedEntityName,
          }
        : null,
    };
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        read: true,
        createdAt: true,
        actionUrl: true,
        actionLabel: true,
        relatedEntityType: true,
        relatedEntityId: true,
        relatedEntityName: true,
      },
    });

    // Transform the response
    return {
      ...notification,
      relatedEntity: notification.relatedEntityType
        ? {
            type: notification.relatedEntityType,
            id: notification.relatedEntityId,
            name: notification.relatedEntityName,
          }
        : null,
    };
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
  async markAllAsRead(recipientId: string) {
    await prisma.notification.updateMany({
      where: {
        recipientId,
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
  async getUnreadCount(recipientId: string) {
    const count = await prisma.notification.count({
      where: {
        recipientId,
        read: false,
      },
    });

    return { count };
  },
};

export default notificationService;
