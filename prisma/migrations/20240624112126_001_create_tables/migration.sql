-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `admins_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `defaultRecord` INTEGER NOT NULL,
    `defaultRecordCall` INTEGER NOT NULL,
    `priorityRecord` INTEGER NOT NULL,
    `priorityRecordCall` INTEGER NOT NULL,
    `dateReg` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locais` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ficha_to_local` (
    `fichaId` INTEGER NOT NULL,
    `localId` INTEGER NOT NULL,

    PRIMARY KEY (`fichaId`, `localId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `dateAction` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ficha_to_local` ADD CONSTRAINT `ficha_to_local_fichaId_fkey` FOREIGN KEY (`fichaId`) REFERENCES `records`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ficha_to_local` ADD CONSTRAINT `ficha_to_local_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `locais`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
