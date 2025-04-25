-- DropForeignKey
ALTER TABLE `AutoDeConstatação` DROP FOREIGN KEY `AutoDeConstatação_documentoId_fkey`;

-- DropForeignKey
ALTER TABLE `RelatorioVisita` DROP FOREIGN KEY `RelatorioVisita_documentoId_fkey`;

-- AddForeignKey
ALTER TABLE `AutoDeConstatação` ADD CONSTRAINT `AutoDeConstatação_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`sharedId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelatorioVisita` ADD CONSTRAINT `RelatorioVisita_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`sharedId`) ON DELETE RESTRICT ON UPDATE CASCADE;
