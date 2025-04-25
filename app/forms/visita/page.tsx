"use client";

import type React from "react";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploader } from "@/components/file-uploader";
import { ArrowLeft, Fullscreen, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RelatorioVisitaSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { formatCEP } from "@/lib/masks/cep-format";
import { formatCNPJ } from "@/lib/masks/cnpj-format";
import FullScreenButton from "@/components/full-screen-button";
import { useBuscarCep } from "@/hooks/use-busca-cep";
import { useTransition } from "react";
import { createRelatorio } from "@/lib/actions/form/relatorioVisita.actions";


export default function VisitaForm() {
  
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RelatorioVisitaSchema>>({
    resolver: zodResolver(RelatorioVisitaSchema),
  });

  useBuscarCep(form, startTransition);

  const onFormSubmit = async (data: z.infer<typeof RelatorioVisitaSchema>) => {
    const response = await createRelatorio({ data });


    if (response.success === true) {
      router.push(`/forms/visita/signature/${response.data?.id}`);
    } else {
      console.log("erro!", response.error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between px-5">
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-1"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        <FullScreenButton />
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Relatório de Visita</CardTitle>
          <CardDescription>
            Preencha os dados para registrar uma visita fiscal realizada.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Dados do Estabelecimento
                </h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(formatCNPJ(e.target.value))
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inscricaoEstadual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Estadual</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="razaoSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nomeFantasia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Fantasia</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="atividade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Atividade</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cep</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) =>
                              field.onChange(formatCEP(e.target.value))
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="municipio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Municipio</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados da Visita</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="tipoVisita"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo Visita</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a situação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fiscalizacao-regular">
                            Fiscalização Regular
                          </SelectItem>
                          <SelectItem value="atendimento-denuncia">
                            Atendimento à Denúncia
                          </SelectItem>
                          <SelectItem value="verificacao-precos">
                            Verificação de Preços
                          </SelectItem>
                          <SelectItem value="operacao-especial">
                            Operação Especial
                          </SelectItem>
                          <SelectItem value="retorno-fiscalizacao">
                            Retorno de Fiscalização
                          </SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ocorrencias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocorrência</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Anexos</h3>
                <Separator />

                <div className="space-y-2">
                  <Label>Anexar Documentos ou Evidências</Label>
                  <FileUploader files={files} setFiles={setFiles} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-1">
                <Save className="h-4 w-4" /> Prosseguir para Assinatura
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
