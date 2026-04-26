/*
  Warnings:

  - A unique constraint covering the columns `[userId,weekLabel]` on the table `WeeklyInsight` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `hasCompletedAssessment` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastAssessmentAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `WeeklyInsight_userId_weekLabel_key` ON `WeeklyInsight`(`userId`, `weekLabel`);
