/*
  Warnings:

  - You are about to drop the column `date` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Notification` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Notification_read_idx";

-- DropIndex
DROP INDEX "Notification_timestamp_idx";

-- DropIndex
DROP INDEX "Notification_type_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "date",
DROP COLUMN "time",
DROP COLUMN "timestamp",
DROP COLUMN "updatedAt";
