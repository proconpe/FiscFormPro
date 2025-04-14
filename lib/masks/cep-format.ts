export const formatCEP = (cep: string): string => {
  return cep
    .replace(/\D/g, "") // Remove não numeros
    .slice(0, 8)
    .replace(/^(\d{5})(\d{3})$/, "$1-$2");
};
