export const formatPhone = (phone: string): string => {
  return phone
    .replace(/\D/g, "") // Remove não números
    .replace(/^(\d{2})(\d)/, "($1) $2") // DDD
    .replace(/(\d{5})(\d)/, "$1-$2") // Número
    .slice(0, 15); // Limita ao formato (XX) XXXXX-XXXX
};
