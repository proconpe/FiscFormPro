"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

// Interface para os dados do fiscal
interface Fiscal {
  nome: string
  matricula: string
  assinatura: string
}

interface DocumentPreviewProps {
  formType: "infracao" | "constatacao" | "notificacao"
  formData: any
  signatureDataUrl: string
  fiscais: Fiscal[]
}

export function DocumentPreview({ formType, formData, signatureDataUrl, fiscais }: DocumentPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  const getFormTypeName = (type: string) => {
    switch (type) {
      case "infracao":
        return "Relatório de Visita"
      case "constatacao":
        return "Auto de Constatação"
      case "notificacao":
        return "Notificação"
      default:
        return ""
    }
  }

  const handlePrint = () => {
    // Salva o conteúdo atual da página
    const originalContents = document.body.innerHTML

    // Substitui o conteúdo da página pelo conteúdo do componente
    if (componentRef.current) {
      const printContent = componentRef.current.innerHTML
      document.body.innerHTML = `
        <style>
          @media print {
            body { 
              font-family: Arial, sans-serif;
              padding: 20px;
              color: black;
            }
            img { max-width: 100%; }
          }
        </style>
        <div>${printContent}</div>
      `

      // Imprime
      window.print()

      // Restaura o conteúdo original
      document.body.innerHTML = originalContents

      // Recarrega a página para restaurar os eventos e estado do React
      window.location.reload()
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const today = formatDate(new Date())

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button onClick={handlePrint} className="flex items-center gap-1">
          <Printer className="h-4 w-4" /> Imprimir Documento
        </Button>
      </div>

      <div ref={componentRef} className="bg-white p-8 border rounded-md shadow-sm max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold uppercase">{getFormTypeName(formType)}</h1>
          <p className="text-sm text-muted-foreground">PROCON - Órgão de Proteção e Defesa do Consumidor</p>
        </div>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">Dados do Estabelecimento</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="font-medium">Razão Social:</span> {formData.razaoSocial}
              </div>
              <div>
                <span className="font-medium">CNPJ:</span> {formData.cnpj}
              </div>
              <div>
                <span className="font-medium">Endereço:</span> {formData.endereco}
              </div>
              <div>
                <span className="font-medium">Bairro:</span> {formData.bairro}
              </div>
              <div>
                <span className="font-medium">Cidade:</span> {formData.cidade}
              </div>
              <div>
                <span className="font-medium">Estado:</span> {formData.estado}
              </div>
              <div>
                <span className="font-medium">CEP:</span> {formData.cep}
              </div>
            </div>
          </div>

          {formType === "infracao" && (
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">Dados da Visita</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Tipo de Visita:</span> {formData.tipoInfracao}
                </div>
                <div>
                  <span className="font-medium">Descrição da Visita:</span>
                  <p className="mt-1 whitespace-pre-line">{formData.descricaoInfracao}</p>
                </div>
                <div>
                  <span className="font-medium">Observações Adicionais:</span>
                  <p className="mt-1 whitespace-pre-line">{formData.baseLegal}</p>
                </div>
              </div>
            </div>
          )}

          {formType === "constatacao" && (
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">Dados da Constatação</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Tipo de Visita:</span> {formData.tipoVisita}
                </div>
                <div>
                  <span className="font-medium">Descrição da Constatação:</span>
                  <p className="mt-1 whitespace-pre-line">{formData.descricaoConstatacao}</p>
                </div>
                {formData.recomendacoes && (
                  <div>
                    <span className="font-medium">Recomendações:</span>
                    <p className="mt-1 whitespace-pre-line">{formData.recomendacoes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {formType === "notificacao" && (
            <div className="border-b pb-4">
              <h2 className="font-semibold text-lg mb-2">Dados da Notificação</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Tipo de Notificação:</span> {formData.tipoNotificacao}
                </div>
                <div>
                  <span className="font-medium">Motivo da Notificação:</span>
                  <p className="mt-1 whitespace-pre-line">{formData.motivoNotificacao}</p>
                </div>
                <div>
                  <span className="font-medium">Itens Solicitados:</span>
                  <ul className="list-disc list-inside mt-1">
                    {formData.itensSolicitados &&
                      formData.itensSolicitados.map((item: string, index: number) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
                {formData.outrosItens && (
                  <div>
                    <span className="font-medium">Outros Itens Solicitados:</span>
                    <p className="mt-1 whitespace-pre-line">{formData.outrosItens}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Prazo para Atendimento:</span> {formData.prazo} dias
                </div>
              </div>
            </div>
          )}

          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">Dados dos Fiscais</h2>
            <div className="space-y-4">
              {fiscais.map((fiscal, index) => (
                <div key={index} className="border-t pt-3 first:border-t-0 first:pt-0">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium">Nome do Fiscal:</span> {fiscal.nome}
                    </div>
                    <div>
                      <span className="font-medium">Matrícula:</span> {fiscal.matricula}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="space-y-2">
              <p className="text-sm font-medium">Assinaturas dos Fiscais:</p>
              <div className="space-y-4">
                {fiscais.map((fiscal, index) => (
                  <div key={index} className="border-b border-dashed border-gray-400 pb-2">
                    {fiscal.assinatura && (
                      <div className="mb-1">
                        <img
                          src={fiscal.assinatura || "/placeholder.svg"}
                          alt={`Assinatura do Fiscal ${fiscal.nome}`}
                          className="max-h-16 object-contain"
                        />
                      </div>
                    )}
                    <p className="text-sm">{fiscal.nome}</p>
                    <p className="text-sm text-muted-foreground">Fiscal - Matrícula: {fiscal.matricula}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Assinatura do Responsável pelo Estabelecimento:</p>
              {signatureDataUrl && (
                <div className="border-b border-dashed border-gray-400 pb-1">
                  <img
                    src={signatureDataUrl || "/placeholder.svg"}
                    alt="Assinatura do Responsável"
                    className="max-h-20 object-contain"
                  />
                </div>
              )}
              <p className="text-sm">{formData.responsavelNome || "Responsável pelo Estabelecimento"}</p>
              <p className="text-sm text-muted-foreground">{formData.responsavelCargo || "Cargo"}</p>
            </div>
          </div>

          <div className="text-center mt-8 pt-4 text-sm">
            <p>Documento emitido em {today}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

