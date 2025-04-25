/*
  Warnings:

  - You are about to drop the `Endereco` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endereco` to the `Assessores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Consumidores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Empresas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Fiscais` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Endereco` DROP FOREIGN KEY `Endereco_assessorId_fkey`;

-- DropForeignKey
ALTER TABLE `Endereco` DROP FOREIGN KEY `Endereco_consumidorId_fkey`;

-- DropForeignKey
ALTER TABLE `Endereco` DROP FOREIGN KEY `Endereco_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `Endereco` DROP FOREIGN KEY `Endereco_fiscalId_fkey`;

-- AlterTable
ALTER TABLE `Assessores` ADD COLUMN `endereco` JSON NOT NULL;

-- AlterTable
ALTER TABLE `Consumidores` ADD COLUMN `endereco` JSON NOT NULL;

-- AlterTable
ALTER TABLE `Empresas` ADD COLUMN `endereco` JSON NOT NULL;

-- AlterTable
ALTER TABLE `Fiscais` ADD COLUMN `endereco` JSON NOT NULL;

-- DropTable
DROP TABLE `Endereco`;
