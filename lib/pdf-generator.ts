import { RelatorioDeVisita } from "@/@types";
import jsPDF from "jspdf";
import proconLogo from "../public/logo.png";
import governoLogo from "../public/governope.png";
import { add } from "date-fns";
import { salvarDocumento } from "./actions/save-file";

async function getBase64FromUrl(url: string) {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export const generatePDF = async (data: RelatorioDeVisita) => {
  // Criar o PDF
  console.log(data);
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  const footerHeight = 10;
  const headerHeight = 25;
  const maxContentHeight =
    pageHeight - margin - headerHeight - margin - footerHeight;
  // Reduzir a altura do campo de assinatura para caber mais na página
  const signatureHeight = 35;
  const logoProcon = await getBase64FromUrl(proconLogo.src);
  const logoGoverno = await getBase64FromUrl(governoLogo.src);
  // Função para adicionar cabeçalho em cada página
  const addHeader = () => {
    // Adicionar retângulo preto com texto PROCON

    pdf.addImage(logoGoverno, "PNG", margin - 1, margin - 1, 40, 20);

    // Adicionar texto do governo CENTRALIZADO
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    // Calcular o centro entre o retângulo PROCON e o retângulo amarelo
    const centerX = (margin + 40 + (pageWidth - margin - 40)) / 2;
    pdf.setFontSize(20);
    pdf.text("RELATORIO DE VISITA", centerX, margin + 10, {
      align: "center",
    });

    // Adicionar retângulo amarelo com texto RELATÓRIO DE VISITA
    pdf.addImage(
      logoProcon,
      "PNG",
      pageWidth - margin - 22,
      margin - 2,
      20,
      20
    );

    // Linha horizontal abaixo do cabeçalho
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 20, pageWidth - margin, margin + 20);

    return margin + headerHeight; // Retorna a posição Y após o cabeçalho
  };

  // Função para adicionar rodapé em cada página
  const addFooter = () => {
    pdf.setDrawColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.text(
      "Rua Floriano Peixoto, nº 141 - São José - CEP: 50.020-060 - Recife -PE - Fone: 0800 282 1512",
      pageWidth / 2,
      pageHeight - margin,
      { align: "center" }
    );
  };

  // Iniciar a primeira página
  let yPosition = addHeader();
  let currentPage = 1;

  // Função para verificar se precisa de nova página
  const checkNewPage = (heightNeeded:number) => {
    if (yPosition + heightNeeded > pageHeight - margin - footerHeight) {
      addFooter();
      pdf.addPage();
      currentPage++;

      // Não adicionar cabeçalho nas páginas subsequentes
      // Apenas definir a posição Y inicial da página
      yPosition = margin;

      return true;
    }
    return false;
  };

  // Função para adicionar campo com título
  const addField = (title: string, value: string, height = 10) => {
    console.log(value, typeof value);
    checkNewPage(height + 5);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin, yPosition + 4);

    pdf.setFont("helvetica", "normal");
    pdf.text((value && value) || "", margin, yPosition + 9);

    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margin, yPosition, contentWidth, height);

    yPosition += height;
  };

  // Função para adicionar campo dividido
  const addSplitField = (fields:{title:string, value:string}[]) => {
    const totalFields = fields.length;
    const fieldWidth = contentWidth / totalFields;
    const height = 10;

    checkNewPage(height + 5);

    fields.forEach((field, index) => {
      const xPos = margin + index * fieldWidth;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(field.title, xPos + 2, yPosition + 4);

      pdf.setFont("helvetica", "normal");
      pdf.text(field.value || "", xPos + 2, yPosition + 9);

      pdf.setDrawColor(0, 0, 0);
      pdf.rect(xPos, yPosition, fieldWidth, height);
    });

    yPosition += height;
  };

  addSplitField([
    { title: "CNPJ", value: data.cnpj },
    { title: "N° DO DOCUMENTO", value: "001/2025" },
    { title: "N° PROCESSO INTERNO", value: "VIS-001/2025" },
  ]);
  // Adicionar campos do formulário na primeira página
  addSplitField([{ title: "RAZÃO SOCIAL", value: data.razaoSocial }]);

  addSplitField([
    { title: "NOME FANTASIA", value: data.nomeFantasia },
    { title: "ATIVIDADE", value: data.atividade },
  ]);

  addSplitField([{ title: "ENDEREÇO", value: data.endereco }]);

  addSplitField([
    { title: "MUNICÍPIO", value: data.municipio },
    { title: "UF", value: data.estado },
    { title: "CEP", value: data.cep },
  ]);

  addSplitField([
    { title: "INSCRIÇÃO ESTADUAL", value: data.inscricaoEstadual || "-" },
  ]);

  addSplitField([
    { title: "RESPONSÁVEL (NOME)", value: data.responsavel.nome },
  ]);

  // Calcular espaço disponível na página atual para o campo de ocorrências
  const availableSpaceForOcorrencias =
    pageHeight - margin - footerHeight - yPosition;

  // Preparar o texto das ocorrências
  pdf.setFontSize(9);
  const ocorrenciasText = data.ocorrencias || "";
  const ocorrenciasLines = pdf.splitTextToSize(
    ocorrenciasText,
    contentWidth - 10
  );
  const lineHeight = 5;
  const textHeight = ocorrenciasLines.length * lineHeight;

  // Definir altura mínima para o campo de ocorrências
  const minOcorrenciasHeight = Math.min(80, availableSpaceForOcorrencias - 10);

  // Calcular altura real necessária (texto + margens)
  const neededHeight = textHeight + 20;

  // Decidir se o campo de ocorrências cabe na página atual ou precisa ir para a próxima
  let ocorrenciasHeight = Math.max(minOcorrenciasHeight, neededHeight);

  // Se o campo for muito grande para a página atual mas não for muito pequeno,
  // mova-o inteiro para a próxima página
  if (
    ocorrenciasHeight > availableSpaceForOcorrencias - 10 &&
    availableSpaceForOcorrencias < 100
  ) {
    addFooter();
    pdf.addPage();
    currentPage++;

    // Não adicionar cabeçalho, apenas definir a posição Y inicial
    yPosition = margin;

    // Recalcular o espaço disponível na nova página (sem cabeçalho)
    const newAvailableSpace = pageHeight - margin - footerHeight - yPosition;

    // Se o campo for maior que uma página inteira, limite-o e permita quebra
    if (ocorrenciasHeight > newAvailableSpace) {
      ocorrenciasHeight = newAvailableSpace - 10;
    }
  } else if (ocorrenciasHeight > availableSpaceForOcorrencias - 10) {
    // Se o campo for maior que o espaço disponível mas ainda temos bastante espaço,
    // ajuste o tamanho para caber o que for possível na página atual
    ocorrenciasHeight = availableSpaceForOcorrencias - 10;
  }

  // Desenhar o título do campo de ocorrências
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  addSplitField([{ title: "OCORRÊNCIAS", value: data.ocorrencias }]);
  // Desenhar o retângulo do campo
  pdf.setDrawColor(0, 0, 0);
  pdf.rect(margin, yPosition, contentWidth, ocorrenciasHeight);

  // Adicionar o texto das ocorrências (sem as linhas horizontais)
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  // Calcular quantas linhas cabem no campo atual
  const maxLines = Math.floor((ocorrenciasHeight - 15) / lineHeight);
  const firstPageLines = ocorrenciasLines.slice(0, maxLines);

  // Adicionar texto no campo atual
  pdf.text(firstPageLines, margin + 5, yPosition + 10);

  // Atualizar posição Y
  yPosition += ocorrenciasHeight;

  // Se houver mais linhas que não couberam, criar um campo continuação na próxima página
  if (ocorrenciasLines.length > maxLines) {
    const remainingLines = ocorrenciasLines.slice(maxLines);

    // Verificar se precisa de nova página
    addFooter();
    pdf.addPage();
    currentPage++;

    // Não adicionar cabeçalho, apenas definir a posição Y inicial
    yPosition = margin;

    // Adicionar título de continuação
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("OCORRÊNCIAS (CONTINUAÇÃO)", margin, yPosition + 4);

    // Calcular altura para o campo de continuação
    const remainingTextHeight = remainingLines.length * lineHeight;
    const continuationHeight = Math.min(
      remainingTextHeight + 20,
      maxContentHeight - 10
    );

    // Desenhar o retângulo de continuação
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margin, yPosition, contentWidth, continuationHeight);

    // Adicionar o texto restante (sem as linhas horizontais)
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(remainingLines, margin + 5, yPosition + 10);

    // Atualizar posição Y
    yPosition += continuationHeight;
  }

  // Adicionar campos de local, data e hora
  // Verificar se há espaço suficiente na página atual
  if (yPosition + 20 > pageHeight - margin - footerHeight) {
    addFooter();
    pdf.addPage();
    currentPage++;

    // Não adicionar cabeçalho, apenas definir a posição Y inicial
    yPosition = margin;
  }

  addSplitField([
    { title: "LOCAL", value: "No próprio estabelecimento" },
    { title: "DATA", value: new Date().toLocaleDateString("pt-BR") },
    {
      title: "HORA",
      value: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // Verificar se há espaço suficiente para a assinatura do responsável
  if (yPosition + signatureHeight + 5 > pageHeight - margin - footerHeight) {
    addFooter();
    pdf.addPage();
    currentPage++;

    // Não adicionar cabeçalho, apenas definir a posição Y inicial
    yPosition = margin;
  }

  // Adicionar assinatura do responsável PRIMEIRO
  pdf.setDrawColor(0, 0, 0);
  pdf.rect(margin, yPosition, contentWidth, signatureHeight);

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("RESPONSÁVEL DA EMPRESA", margin + 2, yPosition + 5);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("RECEBI A 2ª VIA NESTA DATA", margin + 2, yPosition + 10);
  pdf.text(`Nome: ${data.responsavel.nome}`, margin + 2, yPosition + 15);
  pdf.text(`Cargo: ${data.responsavel.cargo}`, margin + 2, yPosition + 20);
  pdf.text(`CPF: ${data.responsavel.cpf}`, margin + 2, yPosition + 25);

  // Adicionar assinatura do responsável se disponível
  if (data.responsavelSignature) {
    try {
      pdf.addImage(
        data.responsavelSignature,
        "PNG",
        margin + 70,
        yPosition + 10,
        60,
        15
      );
    } catch (error) {
      console.error("Erro ao adicionar assinatura do responsável:", error);
    }
  }

  // Adicionar linha para assinatura
  pdf.line(margin + 70, yPosition + 25, margin + 130, yPosition + 25);
  pdf.setFontSize(8);
  pdf.text("ASSINATURA", margin + 100 - 15, yPosition + 30);

  // Atualizar posição Y após a assinatura do responsável
  yPosition += signatureHeight + 5;

  // Adicionar assinaturas dos fiscais DEPOIS
  // Calcular quantos fiscais temos
  const fiscais = data.fiscais || [];
  const numFiscais = fiscais.length;

  // Limitar a 2 fiscais conforme solicitado
  const fiscaisLimitados = fiscais.slice(0, 2);
  const numFiscaisLimitados = fiscaisLimitados.length;

  // Verificar se precisamos de uma nova página para as assinaturas dos fiscais
  if (yPosition + 10 > pageHeight - margin - footerHeight) {
    addFooter();
    pdf.addPage();
    currentPage++;

    // Não adicionar cabeçalho, apenas definir a posição Y inicial
    yPosition = margin;
  }

  // Adicionar título para a seção de fiscais
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("5. AGENTES FISCAIS", margin, yPosition + 5);
  yPosition += 10;

  // Verificar se há espaço suficiente para as assinaturas dos fiscais
  if (yPosition + signatureHeight + 5 > pageHeight - margin - footerHeight) {
    addFooter();
    pdf.addPage();
    currentPage++;

    // Não adicionar cabeçalho, apenas definir a posição Y inicial
    yPosition = margin;
  }

  // Adicionar assinaturas dos fiscais lado a lado (máximo 2)
  if (numFiscaisLimitados > 0) {
    // Calcular a largura de cada assinatura
    const signatureWidth = contentWidth;

    // Desenhar as assinaturas lado a lado
    for (let i = 0; i < numFiscaisLimitados; i++) {
      const fiscal = fiscaisLimitados[i];
      const xPos = margin;

      // Desenhar o retângulo para o fiscal
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(xPos, yPosition, signatureWidth, signatureHeight);

      // Adicionar informações do fiscal
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Fiscal ${i + 1}: ${fiscal.nome}`, xPos + 2, yPosition + 5);

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Nome: ${fiscal.nome}`, xPos + 2, yPosition + 10);
      pdf.text(`Matrícula: ${fiscal.matricula}`, xPos + 2, yPosition + 15);

      // Adicionar assinatura do fiscal se disponível
      if (fiscal.assinatura) {
        try {
          pdf.addImage(
            fiscal.assinatura,
            "PNG",
            xPos + 70,
            yPosition + 10,
            60,
            15
          );
        } catch (error) {
          console.error(
            `Erro ao adicionar assinatura do fiscal ${i + 1}:`,
            error
          );
        }
      }

      // Adicionar linha para assinatura
      pdf.line(margin + 70, yPosition + 25, margin + 130, yPosition + 25);
      pdf.setFontSize(8);
      pdf.text("ASSINATURA", margin + 100 - 15, yPosition + 30);
      yPosition += signatureHeight + 5;
    }

    // Atualizar posição Y após as assinaturas dos fiscais
  }

  // Adicionar rodapé na última página
  addFooter();
  const pdfBlob = pdf.output('blob')
  const base64 = await blobToBase64(pdfBlob)
  const filename = `Relatorio_de_Visita_${data.razaoSocial.replace(/\s+/g, "_")}`
  
  const res = await salvarDocumento(base64.split(",")[1], filename, "pdf")

  return res

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

};
