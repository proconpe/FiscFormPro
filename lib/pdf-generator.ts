import jsPDF from "jspdf";
import logo from "../public/logo.png";

export const generatePDF = async (data) => {
  const toBase64 = (url) =>
    fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  const base64Logo = await toBase64(logo.src);
  // Função para adicionar cabeçalho em cada página
  // Criar o PDF

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  const footerHeight = 10;
  const headerHeight = 25;
  const maxContentHeight =
    pageHeight - margin - headerHeight - margin - footerHeight;

  // Função para adicionar cabeçalho em cada página
  const addHeader = () => {
    // Adicionar retângulo preto com texto PROCON
    // pdf.setFillColor(51, 51, 51);
    // pdf.rect(margin, margin, 40, 15, "F");
    // pdf.setTextColor(255, 255, 255);
    // pdf.setFontSize(12);
    // pdf.setFont("helvetica", "bold");
    // pdf.text("PROCON", margin + 5, margin + 7);
    // pdf.setFontSize(8);
    // pdf.text("PERNAMBUCO", margin + 5, margin + 12);
    pdf.addImage(base64Logo, "PNG", margin + 5, margin - 2, 20, 20);
    // Adicionar texto do governo
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("GOVERNO DO ESTADO DE PERNAMBUCO", margin + 45, margin + 5);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.text(
      "SECRETARIA DE DESENVOLVIMENTO SOCIAL E DIREITOS HUMANOS",
      margin + 45,
      margin + 9
    );
    pdf.text(
      "SECRETARIA EXECUTIVA DE JUSTIÇA E DIREITOS HUMANOS",
      margin + 45,
      margin + 13
    );
    pdf.text(
      "COORDENADORIA GERAL DE PROTEÇÃO E DEFESA DO CONSUMIDOR - PROCON",
      margin + 45,
      margin + 17
    );

    // Adicionar retângulo amarelo com texto RELATÓRIO DE VISITA
    pdf.setFillColor(255, 255, 153);
    pdf.rect(pageWidth - margin - 40, margin, 40, 15, "F");
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("RELATÓRIO", pageWidth - margin - 25, margin + 7, {
      align: "center",
    });
    pdf.text("DE VISITA", pageWidth - margin - 25, margin + 12, {
      align: "center",
    });

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
  const checkNewPage = (heightNeeded) => {
    if (yPosition + heightNeeded > pageHeight - margin - footerHeight) {
      addFooter();
      pdf.addPage();
      currentPage++;
      yPosition = addHeader();
      return true;
    }
    return false;
  };

  // Função para adicionar campo com título
  const addField = (title, value, height = 10) => {
    checkNewPage(height + 5);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin, yPosition + 4);

    pdf.setFont("helvetica", "normal");
    pdf.text(value || "", margin, yPosition + 9);

    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margin, yPosition, contentWidth, height);

    yPosition += height;
  };

  // Função para adicionar campo dividido
  const addSplitField = (fields) => {
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

  // Adicionar campos do formulário na primeira página
  addField("1. RAZÃO SOCIAL", data.razaoSocial);

  addSplitField([
    { title: "NOME FANTASIA", value: data.nomeFantasia },
    { title: "ATIVIDADE", value: data.atividade },
  ]);

  addField("ENDEREÇO", data.endereco);

  addSplitField([
    { title: "MUNICÍPIO", value: data.municipio },
    { title: "UF", value: data.estado },
    { title: "CEP", value: data.cep },
  ]);

  addSplitField([
    { title: "CNPJ", value: data.cnpj },
    { title: "INSCRIÇÃO ESTADUAL", value: data.inscricaoEstadual || "-" },
  ]);

  addField("2. RESPONSÁVEL (NOME)", data.responsavel);

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
    yPosition = addHeader();

    // Recalcular o espaço disponível na nova página
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
  pdf.text("3. OCORRÊNCIAS", margin, yPosition + 4);

  // Desenhar o retângulo do campo
  pdf.setDrawColor(0, 0, 0);
  pdf.rect(margin, yPosition, contentWidth, ocorrenciasHeight);

  // Adicionar linhas para escrita
  pdf.setDrawColor(200, 200, 200);
  const lineSpacing = 5;
  const startY = yPosition + 10;
  const endY = yPosition + ocorrenciasHeight - 2;

  for (let y = startY; y < endY; y += lineSpacing) {
    pdf.line(margin + 2, y, margin + contentWidth - 2, y);
  }

  // Adicionar o texto das ocorrências
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  // Calcular quantas linhas cabem no campo atual
  const maxLines = Math.floor((ocorrenciasHeight - 15) / lineHeight);
  const firstPageLines = ocorrenciasLines.slice(0, maxLines);

  // Adicionar texto no campo atual
  pdf.text(firstPageLines, margin + 5, startY + 5);

  // Atualizar posição Y
  yPosition += ocorrenciasHeight;

  // Se houver mais linhas que não couberam, criar um campo continuação na próxima página
  if (ocorrenciasLines.length > maxLines) {
    const remainingLines = ocorrenciasLines.slice(maxLines);

    // Verificar se precisa de nova página
    addFooter();
    pdf.addPage();
    currentPage++;
    yPosition = addHeader();

    // Adicionar título de continuação
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("3. OCORRÊNCIAS (CONTINUAÇÃO)", margin, yPosition + 4);

    // Calcular altura para o campo de continuação
    const remainingTextHeight = remainingLines.length * lineHeight;
    const continuationHeight = Math.min(
      remainingTextHeight + 20,
      maxContentHeight - 10
    );

    // Desenhar o retângulo de continuação
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margin, yPosition, contentWidth, continuationHeight);

    // Adicionar linhas para escrita
    const contStartY = yPosition + 10;
    const contEndY = yPosition + continuationHeight - 2;

    for (let y = contStartY; y < contEndY; y += lineSpacing) {
      pdf.line(margin + 2, y, margin + contentWidth - 2, y);
    }

    // Adicionar o texto restante
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(remainingLines, margin + 5, contStartY + 5);

    // Atualizar posição Y
    yPosition += continuationHeight;
  }

  // Adicionar campos de local, data e hora
  // Verificar se há espaço suficiente na página atual
  if (yPosition + 20 > pageHeight - margin - footerHeight) {
    addFooter();
    pdf.addPage();
    currentPage++;
    yPosition = addHeader();
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

  // Adicionar assinaturas dos fiscais
  // Calcular quantos fiscais temos
  const fiscais = data.fiscais || [];
  const numFiscais = fiscais.length;

  // Altura para cada assinatura
  const signatureHeight = 50;

  // Verificar se precisamos de uma nova página para as assinaturas dos fiscais
  if (yPosition + signatureHeight + 5 > pageHeight - margin - footerHeight) {
    addFooter();
    pdf.addPage();
    currentPage++;
    yPosition = addHeader();
  }

  // Adicionar título para a seção de fiscais
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("4. AGENTES FISCAIS", margin, yPosition + 5);
  yPosition += 10;

  // Adicionar cada fiscal em um bloco separado
  for (let i = 0; i < numFiscais; i++) {
    const fiscal = fiscais[i];

    // Verificar se precisamos de uma nova página para este fiscal
    if (yPosition + signatureHeight + 5 > pageHeight - margin - footerHeight) {
      addFooter();
      pdf.addPage();
      currentPage++;
      yPosition = addHeader();
    }

    // Desenhar o retângulo para o fiscal
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margin, yPosition, contentWidth, signatureHeight);

    // Adicionar informações do fiscal
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Fiscal ${i + 1}: ${fiscal.nome}`, margin + 2, yPosition + 5);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Cargo: ${fiscal.cargo}`, margin + 2, yPosition + 10);
    pdf.text(`Matrícula: ${fiscal.matricula}`, margin + 2, yPosition + 15);

    // Adicionar assinatura do fiscal se disponível
    if (fiscal.assinatura) {
      try {
        pdf.addImage(
          fiscal.assinatura,
          "PNG",
          margin + 70,
          yPosition + 5,
          60,
          30
        );
      } catch (error) {
        console.error(
          `Erro ao adicionar assinatura do fiscal ${i + 1}:`,
          error
        );
      }
    }

    // Adicionar linha para assinatura
    pdf.line(margin + 70, yPosition + 40, margin + 130, yPosition + 40);
    pdf.setFontSize(8);
    pdf.text("ASSINATURA", margin + 100 - 15, yPosition + 45);

    // Atualizar posição Y para o próximo fiscal
    yPosition += signatureHeight + 5;
  }

  // Verificar se há espaço suficiente para a assinatura do responsável
  if (yPosition + signatureHeight + 5 > pageHeight - margin - footerHeight) {
    addFooter();
    pdf.addPage();
    currentPage++;
    yPosition = addHeader();
  }

  // Adicionar assinatura do responsável
  pdf.setDrawColor(0, 0, 0);
  pdf.rect(margin, yPosition, contentWidth, signatureHeight);

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("5. FISCALIZADO", margin + 2, yPosition + 5);

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.text("RECEBI A 2ª VIA NESTA DATA", margin + 2, yPosition + 10);
  pdf.text(`Nome: ${data.responsavel}`, margin + 2, yPosition + 15);

  // Adicionar assinatura do responsável se disponível
  if (data.responsavelSignature) {
    try {
      pdf.addImage(
        data.responsavelSignature,
        "PNG",
        margin + 70,
        yPosition + 20,
        60,
        20
      );
    } catch (error) {
      console.error("Erro ao adicionar assinatura do responsável:", error);
    }
  }

  // Adicionar linha para assinatura
  pdf.line(margin + 70, yPosition + 40, margin + 130, yPosition + 40);
  pdf.setFontSize(8);
  pdf.text("ASSINATURA", margin + 100 - 15, yPosition + 45);

  // Adicionar rodapé na última página
  addFooter();

  // Salvar o PDF
  pdf.save(
    `Relatório_de_Visita_${data.razaoSocial.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`
  );
};
