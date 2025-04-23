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
import { DocumentPreview } from "@/components/document-preview";
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
import { assinaturaResponsavelSchema } from "@/lib/schemas";
import { generatePDF } from "@/lib/pdf-generator";

// Interface para os dados do fiscal


export default function InfracaoSignature() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof assinaturaResponsavelSchema>>({
    resolver: zodResolver(assinaturaResponsavelSchema),
  });

  const gerarPdf = async () => {
    console.log("Baixando");
    const res = await generatePDF({
      atividade: formData.atividade,
      cep: formData.cep,
      cnpj: formData.cnpj,
      endereco: formData.endereco,
      estado: formData.estado,
      inscricaoEstadual: formData.inscricaoEstadual,
      municipio: formData.cidade,
      nomeFantasia: formData.nomeFantasia,
      ocorrencias: formData.ocorrencias,
      razaoSocial: formData.razaoSocial,
      responsavel: {
        nome: responsavelNome,
        cargo: responsavelCargo,
        cpf: responsavelCpf,
      },
      responsavelSignature: responsavelSignature,
      fiscais: fiscais,
    });
    console.log("linkdoPdh",res.path);
  };

  // Em um cenário real, você recuperaria os dados do formulário do backend
  // Aqui estamos simulando com dados de exemplo
  const formData = {
    razaoSocial: searchParams.get("razaoSocial") || "Empresa Exemplo LTDA",
    cnpj: searchParams.get("cnpj") || "12.345.678/0001-90",
    endereco: searchParams.get("endereco") || "Rua Exemplo, 123",
    bairro: searchParams.get("bairro") || "Centro",
    cidade: searchParams.get("cidade") || "Cidade Exemplo",
    atividade: searchParams.get("atividade") || "Undefined",
    nomeFantasia: searchParams.get("nomeFantasia") || "Undefined",
    tipoVisita: searchParams.get("tipoVisita") || "Undefined",
    estado: searchParams.get("estado") || "UF",
    inscricaoEstadual: searchParams.get("inscricaoEstadual") || "000000000000",
    cep: searchParams.get("cep") || "12345-678",
    ocorrencias: searchParams.get("ocorrencias") || "nada",
    tipoInfracao: searchParams.get("tipoInfracao") || "Fiscalização Regular",
    descricaoInfracao:
      searchParams.get("descricaoInfracao") ||
      "Descrição detalhada da visita realizada...",
    baseLegal:
      searchParams.get("baseLegal") ||
      "Observações adicionais sobre a visita...",
  };

  const [step, setStep] = useState(1);
  const [responsavelNome, setResponsavelNome] = useState("sdfsd");
  const [responsavelCargo, setResponsavelCargo] = useState("sdfsfsdf");
  const [responsavelCpf, setResponsavelCpf] = useState("sdfsfsdf");
  const [responsavelSignature, setResponsavelSignature] = useState("");

  // Array de fiscais
  const [fiscais, setFiscais] = useState<Fiscal[]>([
    { nome: "", matricula: "", assinatura: "" },
  ]);
  console.log(responsavelSignature);

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

  const completeFormData = {
    ...formData,
    responsavelNome,
    responsavelCargo,
    fiscais,
  };

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
              Baixar documento <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
