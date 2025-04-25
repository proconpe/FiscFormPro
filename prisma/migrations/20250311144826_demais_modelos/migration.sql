/*
  Warnings:

  - You are about to drop the column `bairro` on the `Consumidores` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `Consumidores` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `Consumidores` table. All the data in the column will be lost.
  - You are about to drop the column `complemento` on the `Consumidores` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `Consumidores` table. All the data in the column will be lost.
  - You are about to drop the column `uf` on the `Consumidores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Consumidores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Consumidores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Consumidores` DROP COLUMN `bairro`,
    DROP COLUMN `cep`,
    DROP COLUMN `cidade`,
    DROP COLUMN `complemento`,
    DROP COLUMN `rua`,
    DROP COLUMN `uf`,
    MODIFY `nota` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Endereco` (
    `id` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `logradouro` VARCHAR(191) NOT NULL,
    `complemento` VARCHAR(191) NULL,
    `municipio` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `uf` CHAR(2) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` VARCHAR(191) NULL,
    `consumidorId` VARCHAR(191) NULL,
    `fiscalId` VARCHAR(191) NULL,
    `assessorId` VARCHAR(191) NULL,

    UNIQUE INDEX `Endereco_empresaId_key`(`empresaId`),
    UNIQUE INDEX `Endereco_consumidorId_key`(`consumidorId`),
    UNIQUE INDEX `Endereco_fiscalId_key`(`fiscalId`),
    UNIQUE INDEX `Endereco_assessorId_key`(`assessorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresas` (
    `id` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `nomeFantasia` VARCHAR(191) NOT NULL,
    `inscricaoMunicipal` VARCHAR(191) NULL,
    `situacaoCadastral` VARCHAR(191) NOT NULL,
    `fornecedor` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `atividade` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Empresas_cnpj_key`(`cnpj`),
    UNIQUE INDEX `Empresas_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fiscais` (
    `id` VARCHAR(191) NOT NULL,
    `nomeCompleto` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `nota` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Fiscais_cpf_key`(`cpf`),
    UNIQUE INDEX `Fiscais_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assessores` (
    `id` VARCHAR(191) NOT NULL,
    `nomeCompleto` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `nota` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Assessores_cpf_key`(`cpf`),
    UNIQUE INDEX `Assessores_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Consumidores_cpf_key` ON `Consumidores`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `Consumidores_email_key` ON `Consumidores`(`email`);

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_consumidorId_fkey` FOREIGN KEY (`consumidorId`) REFERENCES `Consumidores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_fiscalId_fkey` FOREIGN KEY (`fiscalId`) REFERENCES `Fiscais`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_assessorId_fkey` FOREIGN KEY (`assessorId`) REFERENCES `Assessores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
