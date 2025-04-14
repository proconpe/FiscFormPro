export const formatCPF = (cpf: string): string => {
  return cpf
    .replace(/\D/g, "") // Remove não números
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
};
