export type RelatorioDeVisita = {
  atividade: string;
  cep: string;
  cnpj: string;
  endereco: string;
  estado: string;
  inscricaoEstadual: string;
  municipio: string;
  nomeFantasia: string;
  ocorrencias: string;
  razaoSocial: string;
  responsavel: {
    nome: string;
    cargo: string;
    cpf: string;
  };
  responsavelSignature: string;
  fiscais: Fiscal[]; // ou outro tipo, dependendo do que é `fiscais`
};

export interface Fiscal {
  nome: string;
  matricula: string;
  assinatura: string;
}
