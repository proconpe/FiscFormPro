"use client";

import type React from "react";

import { useState } from "react";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RelatorioVisitaSchema } from "@/lib/schemas";

export default function NotificacaoForm() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  // estancia do form usando o schema criado
  const form = useForm<z.infer<typeof RelatorioVisitaSchema>>({
    resolver: zodResolver(RelatorioVisitaSchema),
  });

  // Modificar o handleSubmit para redirecionar para a página de assinatura
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construir query string com os dados do formulário
    const formData = new FormData(e.target as HTMLFormElement);
    const queryParams = new URLSearchParams();

    formData.forEach((value, key) => {
      queryParams.append(key, value.toString());
    });

    // Redirecionar para a página de assinatura
    router.push(`/forms/notificacao/signature?${queryParams.toString()}`);
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input id="endereco" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input id="bairro" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Input id="responsavel" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input id="cargo" required />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados da Notificação</h3>
                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="tipoNotificacao">Tipo de Notificação</Label>
                  <Select required>
                    <SelectTrigger id="tipoNotificacao">
                      <SelectValue placeholder="Selecione o tipo de notificação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solicitacao-documentos">
                        Solicitação de Documentos
                      </SelectItem>
                      <SelectItem value="correcao-irregularidades">
                        Correção de Irregularidades
                      </SelectItem>
                      <SelectItem value="comparecimento">
                        Comparecimento ao PROCON
                      </SelectItem>
                      <SelectItem value="esclarecimentos">
                        Prestação de Esclarecimentos
                      </SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivoNotificacao">
                    Motivo da Notificação
                  </Label>
                  <Textarea
                    id="motivoNotificacao"
                    placeholder="Descreva o motivo da notificação..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Itens Solicitados</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="item1" />
                      <Label htmlFor="item1">Contrato Social</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="item2" />
                      <Label htmlFor="item2">CNPJ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="item3" />
                      <Label htmlFor="item3">Alvará de Funcionamento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="item4" />
                      <Label htmlFor="item4">Notas Fiscais</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="item5" />
                      <Label htmlFor="item5">Contratos com Consumidores</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="item6" />
                      <Label htmlFor="item6">Comprovantes de Entrega</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outrosItens">Outros Itens Solicitados</Label>
                  <Textarea
                    id="outrosItens"
                    placeholder="Descreva outros itens solicitados, se houver..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prazo">Prazo para Atendimento (dias)</Label>
                    <Input id="prazo" type="number" min="1" required />
                  </div>
                </div>
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
