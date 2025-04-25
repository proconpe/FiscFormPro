-- AlterTable
ALTER TABLE `Assessores` MODIFY `endereco` JSON NULL;

-- AlterTable
ALTER TABLE `Fiscais` MODIFY `endereco` JSON NULL;

-- CreateTable
CREATE TABLE `Anexos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `RelatorioVisitaId` VARCHAR(191) NULL,
    `autoDeNotificacaoId` VARCHAR(191) NULL,
    `autoDeConstatacaoId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` VARCHAR(191) NOT NULL,
    `sharedId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AutoDeNotificacao` (
    `id` VARCHAR(191) NOT NULL,
    `formId` VARCHAR(191) NOT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `documentoId` VARCHAR(191) NOT NULL,
    `razaoSocial` VARCHAR(191) NOT NULL,
    `nomeFantasia` VARCHAR(191) NOT NULL,
    `atividade` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `municipio` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `celular` VARCHAR(191) NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `inscricaoEstadual` VARCHAR(191) NULL,
    `ocorrencias` VARCHAR(191) NOT NULL,
    `dispositivosLegaisInfrigidos` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fiscais` JSON NULL,
    `responsavel` JSON NULL,

    UNIQUE INDEX `AutoDeNotificacao_formId_key`(`formId`),
    UNIQUE INDEX `AutoDeNotificacao_documentoId_key`(`documentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AutoDeConstatação` (
    `id` VARCHAR(191) NOT NULL,
    `formId` VARCHAR(191) NOT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `documentoId` VARCHAR(191) NOT NULL,
    `nomeFantasia` VARCHAR(191) NOT NULL,
    `razaoSocial` VARCHAR(191) NOT NULL,
    `atividade` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `municipio` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `celular` VARCHAR(191) NULL,
    `inscricaoEstadual` VARCHAR(191) NULL,
    `ocorrencias` VARCHAR(191) NOT NULL,
    `dispositivosLegaisInfrigidos` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fiscais` JSON NULL,
    `responsavel` JSON NULL,

    UNIQUE INDEX `AutoDeConstatação_formId_key`(`formId`),
    UNIQUE INDEX `AutoDeConstatação_documentoId_key`(`documentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RelatorioVisita` (
    `id` VARCHAR(191) NOT NULL,
    `formId` VARCHAR(191) NOT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `documentoId` VARCHAR(191) NOT NULL,
    `nomeFantasia` VARCHAR(191) NOT NULL,
    `razaoSocial` VARCHAR(191) NOT NULL,
    `atividade` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `municipio` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `celular` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `tipoVisita` VARCHAR(191) NOT NULL,
    `inscricaoEstadual` VARCHAR(191) NULL,
    `ocorrencias` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fiscais` JSON NULL,
    `responsavel` JSON NULL,

    UNIQUE INDEX `RelatorioVisita_formId_key`(`formId`),
    UNIQUE INDEX `RelatorioVisita_documentoId_key`(`documentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Anexos` ADD CONSTRAINT `Anexos_RelatorioVisitaId_fkey` FOREIGN KEY (`RelatorioVisitaId`) REFERENCES `RelatorioVisita`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anexos` ADD CONSTRAINT `Anexos_autoDeNotificacaoId_fkey` FOREIGN KEY (`autoDeNotificacaoId`) REFERENCES `AutoDeNotificacao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anexos` ADD CONSTRAINT `Anexos_autoDeConstatacaoId_fkey` FOREIGN KEY (`autoDeConstatacaoId`) REFERENCES `AutoDeConstatação`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AutoDeNotificacao` ADD CONSTRAINT `AutoDeNotificacao_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AutoDeConstatação` ADD CONSTRAINT `AutoDeConstatação_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RelatorioVisita` ADD CONSTRAINT `RelatorioVisita_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
