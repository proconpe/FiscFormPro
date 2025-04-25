"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignaturePad } from "@/components/signature-pad";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  assinaturaResponsavelSchema,
  RelatorioVisitaSchema,
} from "@/lib/schemas";
import { generatePDF } from "@/lib/pdf-generator";
import { Fiscal } from "@/@types";
import updateRelatorio from "@/lib/actions/form/relatorioVisita.actions";
import { RelatorioVisita } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

// Interface para os dados do fiscal

export default function VisitaSignature({
  id,
  data,
}: {
  id: string;
  data: RelatorioVisita;
}) {
  const router = useRouter();

  console.log(data);
  const form = useForm<z.infer<typeof assinaturaResponsavelSchema>>({
    resolver: zodResolver(assinaturaResponsavelSchema),
  });

  const gerarPdf = async () => {
    const responsavel = {
      nome: responsavelNome,
      cargo: responsavelCargo,
      cpf: responsavelCpf,
    };

    const res = await generatePDF({
      atividade: data.atividade,
      cep: data.cep,
      cnpj: data.cnpj,
      endereco: data.endereco,
      estado: data.estado,
      inscricaoEstadual: data.inscricaoEstadual || "",
      municipio: data.municipio,
      nomeFantasia: data.nomeFantasia,
      ocorrencias: data.ocorrencias,
      razaoSocial: data.razaoSocial,
      tipoVisita: data.tipoVisita,
      documentoId: data.documentoId,
      formId: data.formId,
      email: data.email,
      responsavel,
      responsavelSignature: responsavelSignature,
      fiscais: fiscais,
    });

    if (res.success === false) {
      return alert("Erro ao gerar o pdf");
    } else {
      updateRelatorio({
        id: id,
        data: { responsavel, fiscais, pdfUrl: res.path || "" },
      });
      toast.success("Documento gerado e salvo com sucesso");
      router.push("/");
    }
  };
  const [step, setStep] = useState(1);
  const [responsavelNome, setResponsavelNome] = useState("");
  const [responsavelCargo, setResponsavelCargo] = useState("");
  const [responsavelCpf, setResponsavelCpf] = useState("");
  const [responsavelSignature, setResponsavelSignature] = useState("");

  // Array de fiscais
  const [fiscais, setFiscais] = useState<Fiscal[]>([
    { nome: "", matricula: "", assinatura: "" },
  ]);

  // Função para adicionar um novo fiscal
  const adicionarFiscal = () => {
    setFiscais([...fiscais, { nome: "", matricula: "", assinatura: "" }]);
  };

  // Função para remover um fiscal
  const removerFiscal = (index: number) => {
    if (fiscais.length > 1) {
      const novosFiscais = [...fiscais];
      novosFiscais.splice(index, 1);
      setFiscais(novosFiscais);
    }
  };

  // Função para atualizar os dados de um fiscal
  const atualizarFiscal = (
    index: number,
    campo: keyof Fiscal,
    valor: string
  ) => {
    const novosFiscais = [...fiscais];
    novosFiscais[index] = { ...novosFiscais[index], [campo]: valor };
    setFiscais(novosFiscais);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/forms/visita");
    }
  };

  // Verificar se todos os fiscais têm os dados preenchidos
  const fiscaisCompletos = fiscais.every(
    (fiscal) =>
      fiscal.nome.trim() !== "" &&
      fiscal.matricula.trim() !== "" &&
      fiscal.assinatura !== ""
  );

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-1"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Button>

      {step === 1 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Assinatura do Responsável</CardTitle>
            <CardDescription>
              Por favor, preencha os dados e assine o documento para finalizar o
              Relatório de Visita.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Assinatura do Responsável</Label>

                <Form {...form}>
                  <form action="POST">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) =>
                                setResponsavelNome(e.target.value)
                              }
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cpf</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) =>
                                setResponsavelCpf(e.target.value)
                              }
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) =>
                                setResponsavelCargo(e.target.value)
                              }
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <SignaturePad onSave={setResponsavelSignature} />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                !responsavelNome || !responsavelCargo || !responsavelSignature
              }
              className="flex items-center gap-1"
            >
              Próximo <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Assinatura dos Fiscais</CardTitle>
            <CardDescription>
              Por favor, preencha os dados e assinaturas de todos os fiscais
              responsáveis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fiscais.map((fiscal, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-medium">Fiscal {index + 1}</h3>
                  {fiscais.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removerFiscal(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`fiscal-nome-${index}`}>
                      Nome do Fiscal
                    </Label>
                    <Input
                      id={`fiscal-nome-${index}`}
                      value={fiscal.nome}
                      onChange={(e) =>
                        atualizarFiscal(index, "nome", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`fiscal-matricula-${index}`}>
                      Matrícula
                    </Label>
                    <Input
                      id={`fiscal-matricula-${index}`}
                      value={fiscal.matricula}
                      onChange={(e) =>
                        atualizarFiscal(index, "matricula", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Assinatura do Fiscal</Label>
                  <SignaturePad
                    onSave={(dataUrl) =>
                      atualizarFiscal(index, "assinatura", dataUrl)
                    }
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={adicionarFiscal}
              className="w-full flex items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4" /> Adicionar Outro Fiscal
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleBack}>
              Voltar
            </Button>
            <Button
              onClick={gerarPdf}
              disabled={!fiscaisCompletos}
              className="flex items-center gap-1"
            >
              Salvar Documento <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
