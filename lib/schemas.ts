import { z } from "zod";
import { isValidCNPJ } from "./validators/valida-cnpj";
import { formatCNPJ } from "./masks/cnpj-format";
import { formatCEP } from "./masks/cep-format";

export const RelatorioVisitaSchema = z.object({
  razaoSocial: z.string({
    message: " Campo obrigatorio",
  }),
  email: z.string().email({ message: "Email inválido" }),
  nomeFantasia: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: "rezão deve conter no minimo 2 caracteres",
    }),
  atividade: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: "atividade deve conter no minimo 2 caracteres",
    }),
  endereco: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: "endereço deve conter no minimo 2 caracteres",
    }),
  municipio: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: "municipio deve conter no minimo 2 caracteres",
    }),
  estado: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: "estado deve contar no minimo 2 catacters",
    }),
  cep: z
    .string({
      message: "Campo obrigatorio",
    })
    .regex(/^\d{5}-\d{3}$/, "CEP inválido")
    .transform((cep) => formatCEP(cep)),
  cnpj: z
    .string({
      message: "Cnpj e um campo obrigatório",
    })
    .transform((cnpj) => formatCNPJ(cnpj))
    .refine((cnpj) => isValidCNPJ(cnpj), {
      message: "Cnpj invalido",
    }),
  inscricaoEstadual: z
    .string({
      message: "Campo obrigatorio",
    })
    .optional(),
  tipoVisita: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: "tipo de visita deve contar no minimo 2 catacters",
    }),
  ocorrencias: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: " ocorrencias deve contar no minimo 2 catacters",
    }),
});

export const AutoDeNotificaçãoShema = z.object({
  razaoSocial: z.string({
    message: "Campo obrigatorio",
  }),
  nomeFantasia: z.string({
    message: "Campo obrigatorio",
  }),
  atividade: z.string({
    message: "Campo obrigatorio",
  }),
  endereco: z.string({
    message: "Campo obrigatorio",
  }),
  municipio: z.string({
    message: "Campo obrigatorio",
  }),
  estado: z.string({
    message: "Campo obrigatorio",
  }),
  telefone: z.string({
    message: "Telefone e campo obrigatório",
  }),
  celular: z.string({
    message: "Celular e campo obrigatório",
  }),
  email: z
    .string({
      message: "Email e campo obrigatório",
    })
    .email({
      message: "Email inválido",
    }),

  inscricaoEstadual: z
    .string({
      message: "Campo obrigatorio",
    })
    .optional(),
  ocorrencias: z.string({
    message: "Campo obrigatorio",
  }),
  dispositivosLegaisInfrigidos: z.string({
    message: "Campo obrigatorio",
  }),
  cep: z
    .string({
      message: "Campo obrigatorio",
    })
    .regex(/^\d{5}-\d{3}$/, "CEP inválido")
    .transform((cep) => formatCEP(cep)),
  cnpj: z
    .string({
      message: "Cnpj e um campo obrigatório",
    })
    .transform((cnpj) => formatCNPJ(cnpj))
    .refine((cnpj) => isValidCNPJ(cnpj), {
      message: "Cnpj invalido",
    }),
});

export const AutoDeConstataçãoSchema = z.object({
  razaoSocial: z.string({
    message: "Campo obrigatorio",
  }),
  nomeFantasia: z.string({
    message: "Campo obrigatorio",
  }),
  atividade: z.string({
    message: "Campo obrigatorio",
  }),
  endereco: z.string({
    message: "Campo obrigatorio",
  }),
  municipio: z.string({
    message: "Campo obrigatorio",
  }),
  estado: z.string({
    message: "Campo obrigatorio",
  }),
  cep: z
    .string({
      message: "Campo obrigatorio",
    })
    .regex(/^\d{5}-\d{3}$/, "CEP inválido")
    .transform((cep) => formatCEP(cep)),
  cnpj: z
    .string({
      message: "Cnpj e um campo obrigatório",
    })
    .transform((cnpj) => formatCNPJ(cnpj))
    .refine((cnpj) => isValidCNPJ(cnpj), {
      message: "Cnpj invalido",
    }),
  telefone: z
    .string({
      message: "Telefone e campo obrigatório",
    })
    .optional(),
  celular: z
    .string({
      message: "Celular e campo obrigatório",
    })
    .optional(),
  inscricaoEstadual: z
    .string({
      message: "Campo obrigatorio",
    })
    .optional(),
  ocorrencias: z.string({
    message: "Campo obrigatorio",
  }),
  dispositivosLegaisInfrigidos: z
    .string({
      message: "Campo obrigatorio",
    })
    .optional(),
});

export const assinaturaResponsavelSchema = z.object({
  nome: z
    .string({
      message: "Nome e obrigatoria",
    })
    .min(2, {
      message: "Deve conter no minimo 2 caracteres",
    }),
  cpf: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: "Deve conter no minimo 2 caracteres",
    }),
  cargo: z
    .string({
      message: "Campo obrigatorio",
    })
    .min(2, {
      message: "Deve conter no minimo 2 caracteres",
    }),
});

export const assinaturaFiscalSchema = z.object({
  nome: z
    .string({
      message: "Nome e obrigatoria",
    })
    .min(2, {
      message: "Deve conter no minimo 2 caracteres",
    }),
  matricula: z
    .string({
      message: "Matricula e obrigatoria",
    })
    .min(2, {
      message: "Deve conter no minimo 2 caracteres",
    }),
});