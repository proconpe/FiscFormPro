"use client";

import type React from "react";

import { useState, useTransition } from "react";
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
import { ArrowLeft, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutoDeNotificaçãoShema, RelatorioVisitaSchema } from "@/lib/schemas";
import { z } from "zod";
import { formatCNPJ } from "@/lib/masks/cnpj-format";
import { formatCEP } from "@/lib/masks/cep-format";
import { useBuscarCep } from "@/hooks/use-busca-cep";

export default function NotificacaoForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, startTransition] = useTransition();

  // estancia do form usando o schema criado
  const form = useForm<z.infer<typeof AutoDeNotificaçãoShema>>({
    resolver: zodResolver(AutoDeNotificaçãoShema),
  });

  useBuscarCep(form, startTransition);
  // Modificar o handleSubmit para redirecionar para a página de assinatura
  const onSubmit = (data: z.infer<typeof AutoDeNotificaçãoShema>) => {
    console.log(data);
    // const response = await createRelatorio({ data });

    // if (response.success === true) {
    //   router.push(`/forms/visita/signature/${response.data?.id}`);
    // } else {
    //   console.log("erro!", response.error);
    // }
  };

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-1"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Button>

      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Notificação</CardTitle>
          <CardDescription>
            Preencha os dados para emitir uma notificação a um estabelecimento.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Dados do Estabelecimento
                </h3>
                <Separator />

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
                  name="atividade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="celular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
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
                <h3 className="text-lg font-medium">Dados da Notificação</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="dispositivosLegaisInfrigidos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dispositivos Legals Infrigados</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ocorrencias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocorrencias</FormLabel>
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
                  <Label>Anexar Documentos</Label>
                  <FileUploader files={files} setFiles={setFiles} />
                </div>
              </div>
            </CardContent>
            {/* Modificar o texto do botão no CardFooter */}
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
