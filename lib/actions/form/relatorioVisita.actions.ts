"use server";
import { assinaturaFiscalSchema, assinaturaResponsavelSchema, RelatorioVisitaSchema } from "@/lib/schemas";
import { z } from "zod";
import prisma from "../../../db/prisma";
import { formatError } from "@/lib/utils";
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
  const year = new Date().getFullYear();
  const docCount = await prisma..count();
  const docSequencia = String(docCount + 1).padStart(3, "0");
  const documentoId = `DOC-${docSequencia}/${year}`;
  try {
    const document = await prisma.documento.create({
        data: {
            sharedId: documentoId,
            
        }
    });
    const formCount = await prisma.relatorioVisita.count();

    const formSequencia = String(formCount + 1).padStart(3, "0");

    const formId = `VIS-${formSequencia}/${year}`;

    RelatorioVisitaSchema.parse(data);

    const relatorioVisita = await prisma.relatorioVisita.create({
      data: {
        formId: formId,
        documentoId: documentoId,
        ...data,
      },
    });
    return {
        success: true,
        data: relatorioVisita,
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
  };
}) {
  try {
    const relatorioVisita = await prisma.relatorioVisita.update({
      where: {
        id: id,
      },
      data: {
        responsavel:data.responsavel,
        fiscais: data.fiscais,

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