"use server";

import fs from "fs";
import path from "path";

function gerarIdUnico() {
  const agora = new Date();
  const data = agora.toISOString().split("T")[0].replace(/-/g, ""); // 20250422
  const hora = agora.toTimeString().split(" ")[0].replace(/:/g, ""); // 153045
  const ms = agora.getMilliseconds().toString().padStart(3, "0"); // 123
  return `doc-${data}-${hora}-${ms}`;
}

export async function salvarDocumento(
  base64: string,
  nomeBaseDoArquivo: string,
  tipo: string
) {
  const buffer = Buffer.from(base64, "base64");
  const idUnico = gerarIdUnico();
  const filename = `${nomeBaseDoArquivo}_${idUnico}.pdf`;

  const documentsPath = path.join(process.cwd(), "documents");
  if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath);
  }

  const filePath = path.join(documentsPath, filename);

  try {
    fs.writeFileSync(filePath, buffer);
    return { success: true, path: `/documents/${filename}` };
  } catch (error) {
    return { success: false, error: "Erro ao salvar o arquivo" };
  }
}
