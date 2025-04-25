/*
  Warnings:

  - A unique constraint covering the columns `[sharedId]` on the table `Documento` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `AutoDeNotificacao` DROP FOREIGN KEY `AutoDeNotificacao_documentoId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `Documento_sharedId_key` ON `Documento`(`sharedId`);

-- AddForeignKey
ALTER TABLE `AutoDeNotificacao` ADD CONSTRAINT `AutoDeNotificacao_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`sharedId`) ON DELETE RESTRICT ON UPDATE CASCADE;
