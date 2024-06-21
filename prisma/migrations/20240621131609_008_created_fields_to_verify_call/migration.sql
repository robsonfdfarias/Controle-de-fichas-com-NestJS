/*
  Warnings:

  - Added the required column `defaultRecordCall` to the `records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priorityRecordCall` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `records` ADD COLUMN `defaultRecordCall` INTEGER NOT NULL,
    ADD COLUMN `priorityRecordCall` INTEGER NOT NULL;
