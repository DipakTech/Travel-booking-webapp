import { prisma } from "@/lib/prisma";
import { CreateNotification } from "@/lib/schemas/notification";

export class NotificationService {
  static async getNotifications(recipientId: string) {
    return prisma.notification.findMany({
      where: {
        recipientId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async createNotification(data: CreateNotification) {
    return prisma.notification.create({
      data,
    });
  }

  static async markAsRead(id: string, recipientId: string, read: boolean) {
    return prisma.notification.update({
      where: {
        id,
        recipientId,
      },
      data: {
        read,
      },
    });
  }

  static async deleteNotification(id: string, recipientId: string) {
    return prisma.notification.delete({
      where: {
        id,
        recipientId,
      },
    });
  }

  static async markAllAsRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: {
        recipientId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}
