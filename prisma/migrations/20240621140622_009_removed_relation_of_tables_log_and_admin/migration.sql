/*
  Warnings:

  - You are about to drop the column `adminId` on the `logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `logs_adminId_fkey`;

-- DropIndex
DROP INDEX `logs_matricula_key` ON `logs`;

-- AlterTable
ALTER TABLE `logs` DROP COLUMN `adminId`;
