"use server";
import {
  assinaturaFiscalSchema,
  assinaturaResponsavelSchema,
  AutoDeNotificaçãoShema,
} from "@/lib/schemas";
import { z } from "zod";
import prisma from "../../../db/prisma";
import { formatError } from "@/lib/utils";


export async function getNotificacao({ id }: { id: string }) {
  try {
    const data = await prisma.autoDeNotificacao.findUnique({
      where: {
        id: id,
      },
    });
    if (!data) {
      return {
        success: false,
        error: "Notificação não encontrada",
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

export async function createAuto({
  data,
}: {
  data: z.infer<typeof AutoDeNotificaçãoShema>;
}) {
  try {
    // validação do schema
    AutoDeNotificaçãoShema.parse(data);
    const year = new Date().getFullYear();
    const docCount = await prisma.documento.count();
    const docSequencia = String(docCount + 1).padStart(3, "0");
    const documentoId = `DOC-${docSequencia}/${year}`;
    // Refatorar essa parte quando tiver tempo 
    const result = await prisma.$transaction(async (tx) => {
       await tx.documento.create({
        data: {
          sharedId: documentoId,
        },
      });

      const formCount = await prisma.autoDeNotificacao.count();
      const formSequencia = String(formCount + 1).padStart(3, "0");
      const formId = `NOT-${formSequencia}/${year}`;

      const autoDeNotificacao = await tx.autoDeNotificacao.create({
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
          telefone:data.telefone,
          celular:data.celular,
          inscricaoEstadual: data.inscricaoEstadual,
          ocorrencias: data.ocorrencias,
          cep: data.cep,
          cnpj: data.cnpj,
        },
      });

      return autoDeNotificacao;
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

export default async function updateAuto({
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
    const  autoNotificacao = await prisma.autoDeNotificacao.update({
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
      data: autoNotificacao,
    };
  } catch (error) {
    return {
      success: false,
      error: await formatError(error),
    };
  }
}
