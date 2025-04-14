export const isValidPhone = (phone: string): boolean => {
  phone = phone.replace(/\D/g, ""); // Remove caracteres não numéricos
  return phone.length === 10 || phone.length === 11; // Aceita fixo (10 dígitos) e celular (11 dígitos)
};
