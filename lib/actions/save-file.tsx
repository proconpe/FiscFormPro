"use server"
import path from "path";
import fs from 'fs'

export default async function saveFile({dataUrl}:{dataUrl:string}) {
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  const fileName = `signature-${Date.now()}.png`;
  const filePath = path.join(process.cwd(), "signatures");
  const fullPath = path.join(filePath, fileName);
  fs.writeFileSync(fullPath, base64Data, "base64")
}
