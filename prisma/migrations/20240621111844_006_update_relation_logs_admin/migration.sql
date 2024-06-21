/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `logs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `logs` ADD COLUMN `adminId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `logs_adminId_key` ON `logs`(`adminId`);

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
