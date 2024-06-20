/*
  Warnings:

  - You are about to drop the column `localId` on the `records` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `records` DROP FOREIGN KEY `records_localId_fkey`;

-- AlterTable
ALTER TABLE `records` DROP COLUMN `localId`;

-- CreateTable
CREATE TABLE `_FichaToLocal` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FichaToLocal_AB_unique`(`A`, `B`),
    INDEX `_FichaToLocal_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FichaToLocal` ADD CONSTRAINT `_FichaToLocal_A_fkey` FOREIGN KEY (`A`) REFERENCES `records`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FichaToLocal` ADD CONSTRAINT `_FichaToLocal_B_fkey` FOREIGN KEY (`B`) REFERENCES `locais`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
