import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ClipboardCheck, FileWarning, Bell } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Sistema de Formulários - PROCON</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5" />
              Relatório de Visita
            </CardTitle>
            <CardDescription>Formulário para registro de visitas e fiscalizações realizadas.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Utilize este formulário para documentar visitas fiscais, incluindo detalhes do estabelecimento, situações
              encontradas e base legal aplicável.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/forms/visita" className="w-full">
              <Button className="w-full">Acessar Formulário</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Auto de Constatação
            </CardTitle>
            <CardDescription>Formulário para registro de constatações durante visitas fiscais.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Utilize este formulário para documentar situações verificadas durante fiscalização, sem necessariamente
              configurar infração, mas que precisam ser registradas.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/forms/constatacao" className="w-full">
              <Button className="w-full">Acessar Formulário</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificação
            </CardTitle>
            <CardDescription>Formulário para emissão de notificações a estabelecimentos.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Utilize este formulário para notificar estabelecimentos sobre irregularidades que precisam ser corrigidas
              ou para solicitar documentos e informações.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/forms/notificacao" className="w-full">
              <Button className="w-full">Acessar Formulário</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

