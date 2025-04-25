import { RelatorioVisitaSchema } from "@/lib/schemas";
import { z } from "zod";

export type RelatorioDeVisita = z.infer<typeof RelatorioVisitaSchema> & {
  formId: string;
  documentoId: string;
  responsavel: {
    nome: string;
    cargo: string;
    cpf: string;
  };
  responsavelSignature: string;
  fiscais: Fiscal[]; // ou outro tipo, dependendo do que é `fiscais`
}

export interface Fiscal {
  nome: string;
  matricula: string;
  assinatura: string;
}

