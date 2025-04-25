"use server";

import { getRelatorio } from "@/lib/actions/form/relatorioVisita.actions";
import { notFound } from "next/navigation";
import VisitaSignature from "../components/assinatura";
import { RelatorioVisita } from "@prisma/client";

export default async function Signature({
  params,
}: {
  params: { id: string };
}) {
  const id = await params.id;

  const response = await getRelatorio({ id: id });
  
  const data = response.data as RelatorioVisita;

  if (response.success === false) {
    return notFound();
  }

  return (
    <VisitaSignature data={data} id={id} />
  );
}
