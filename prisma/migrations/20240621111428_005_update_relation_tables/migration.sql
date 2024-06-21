/*
  Warnings:

  - You are about to drop the `_FichaToLocal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `localId` to the `records` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_FichaToLocal` DROP FOREIGN KEY `_FichaToLocal_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FichaToLocal` DROP FOREIGN KEY `_FichaToLocal_B_fkey`;

-- AlterTable
ALTER TABLE `records` ADD COLUMN `localId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_FichaToLocal`;

-- CreateTable
CREATE TABLE `ficha_to_local` (
    `fichaId` INTEGER NOT NULL,
    `localId` INTEGER NOT NULL,

    UNIQUE INDEX `ficha_to_local_fichaId_key`(`fichaId`),
    UNIQUE INDEX `ficha_to_local_localId_key`(`localId`),
    PRIMARY KEY (`fichaId`, `localId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ficha_to_local` ADD CONSTRAINT `ficha_to_local_fichaId_fkey` FOREIGN KEY (`fichaId`) REFERENCES `records`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ficha_to_local` ADD CONSTRAINT `ficha_to_local_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `locais`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
