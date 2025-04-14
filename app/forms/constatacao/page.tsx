"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "@/components/file-uploader"
import { ArrowLeft, Save } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ConstatacaoForm() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Construir query string com os dados do formulário
    const formData = new FormData(e.target as HTMLFormElement)
    const queryParams = new URLSearchParams()

    formData.forEach((value, key) => {
      queryParams.append(key, value.toString())
    })

    // Redirecionar para a página de assinatura
    router.push(`/forms/constatacao/signature?${queryParams.toString()}`)
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => router.push("/")}>
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Button>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Auto de Constatação</CardTitle>
          <CardDescription>Preencha os dados para registrar uma constatação durante visita fiscal.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados do Estabelecimento</h3>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input id="razaoSocial" required />
                </div>
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados da Constatação</h3>
              <Separator />

              <div className="space-y-2">
                <Label htmlFor="tipoVisita">Tipo de Visita</Label>
                <RadioGroup defaultValue="regular" className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular">Fiscalização Regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="denuncia" id="denuncia" />
                    <Label htmlFor="denuncia">Atendimento à Denúncia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retorno" id="retorno" />
                    <Label htmlFor="retorno">Retorno de Fiscalização</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricaoConstatacao">Descrição da Constatação</Label>
                <Textarea
                  id="descricaoConstatacao"
                  placeholder="Descreva detalhadamente o que foi constatado durante a visita..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recomendacoes">Recomendações</Label>
                <Textarea
                  id="recomendacoes"
                  placeholder="Informe as recomendações ao estabelecimento, se houver..."
                  className="min-h-[100px]"
                />
              </div>
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
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-1">
              <Save className="h-4 w-4" /> Prosseguir para Assinatura
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

