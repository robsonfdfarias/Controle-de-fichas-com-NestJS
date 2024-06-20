/*
  Warnings:

  - You are about to drop the column `date` on the `records` table. All the data in the column will be lost.
  - Added the required column `dateReg` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `records` DROP COLUMN `date`,
    ADD COLUMN `dateReg` VARCHAR(191) NOT NULL;
