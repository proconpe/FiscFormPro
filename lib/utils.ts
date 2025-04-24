import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function formatError(error: any) {
  if (error.name === "ZodError") {
    const { issues } = error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = issues.map((issue: any) => issue.message);
    return errors.join(", ");
  } else if (
    (error.name === "PrismaClientKnownRequestError", error.code === "P2002")
  ) {
    if (error.meta?.target?.includes("email")) {
      return {
        success: false,
        message: "Email já cadastrado!",
      };
    }
    if (error.meta?.target?.includes("cnpj")) {
      return {
        success: false,
        message: "Cnpj já cadastrado!",
      };
    }
    if (error.meta?.target?.includes("cpf")) {
      return {
        success: false,
        message: "Cpf já cadastrado!",
      };
    }
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}
