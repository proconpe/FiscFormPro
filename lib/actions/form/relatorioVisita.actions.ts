"use server";
import {
  assinaturaFiscalSchema,
  assinaturaResponsavelSchema,
  RelatorioVisitaSchema,
} from "@/lib/schemas";
import { z } from "zod";
import prisma from "../../../db/prisma";
import { formatError } from "@/lib/utils";
import { RelatorioDeVisita } from "@/@types";
export async function getRelatorio({ id }: { id: string }) {
  try {
    const data = await prisma.relatorioVisita.findUnique({
      where: {
        id: id,
      },
    });
    if (!data) {
      return {
        success: false,
        error: "Relatorio não encontrado",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: await formatError(error),
    };
  }
}

export async function createRelatorio({
  data,
}: {
  data: z.infer<typeof RelatorioVisitaSchema>;
}) {
  try {
    // validação do schema
    RelatorioVisitaSchema.parse(data);
    const year = new Date().getFullYear();
    const docCount = await prisma.documento.count();
    const docSequencia = String(docCount + 1).padStart(3, "0");
    const documentoId = `DOC-${docSequencia}/${year}`;

    const result = await prisma.$transaction(async (tx) => {
       await tx.documento.create({
        data: {
          sharedId: documentoId,
        },
      });

      const formCount = await prisma.relatorioVisita.count();
      const formSequencia = String(formCount + 1).padStart(3, "0");
      const formId = `VIS-${formSequencia}/${year}`;

      const relatorioVisita = await tx.relatorioVisita.create({
        data: {
          formId: formId,
          documentoId: documentoId,
          nomeFantasia: data.nomeFantasia,
          razaoSocial: data.razaoSocial,
          atividade: data.atividade,
          endereco: data.endereco,
          municipio: data.municipio,
          estado: data.estado,
          email: data.email,
          tipoVisita: data.tipoVisita,
          inscricaoEstadual: data.inscricaoEstadual,
          ocorrencias: data.ocorrencias,
          cep: data.cep,
          cnpj: data.cnpj,
        },
      });

      return relatorioVisita;
    });

    return {
        success: true,
        data: result,
    }
  } catch (error) {
    return {
      success: false,
      error: await formatError(error),
    };
  }
}

export default async function updateRelatorio({
  id,
  data,
}: {
  id: string;
  data: {
    responsavel: z.infer<typeof assinaturaResponsavelSchema>;
    fiscais: z.infer<typeof assinaturaFiscalSchema>[];
    pdfUrl: string;
  };
}) {
  try {
    const relatorioVisita = await prisma.relatorioVisita.update({
      where: {
        id: id,
      },
      data: {
        responsavel: data.responsavel,
        fiscais: data.fiscais,
        pdfUrl: data.pdfUrl,
      },
    });
    return {
      success: true,
      data: relatorioVisita,
    };
  } catch (error) {
    return {
      success: false,
      error: await formatError(error),
    };
  }
}
