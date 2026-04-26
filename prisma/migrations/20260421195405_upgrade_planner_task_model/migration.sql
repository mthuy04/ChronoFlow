-- AlterTable
ALTER TABLE `Task` ADD COLUMN `endTime` VARCHAR(191) NULL,
    ADD COLUMN `focusMinutes` INTEGER NULL,
    ADD COLUMN `focusMode` VARCHAR(191) NULL,
    ADD COLUMN `isBacklog` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `orderIndex` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `scheduledDate` VARCHAR(191) NULL,
    ADD COLUMN `startTime` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Task_userId_scheduledDate_idx` ON `Task`(`userId`, `scheduledDate`);
