import type { PortfolioData } from "@/lib/portfolio";

const margin = 18;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return [139, 92, 246];
  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16)];
}

function mixWithWhite(color: [number, number, number], whiteRatio: number): [number, number, number] {
  return color.map((channel) => Math.round(channel + (255 - channel) * whiteRatio)) as [number, number, number];
}

async function createPdfAvatar(dataUrl: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const source = new Image();
    source.onload = () => resolve(source);
    source.onerror = () => reject(new Error("Não foi possível preparar a foto para o PDF."));
    source.src = dataUrl;
  });
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível preparar a foto para o PDF.");
  const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  context.clip();
  context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
  return canvas.toDataURL("image/png");
}

export async function exportPortfolioPdf(portfolio: PortfolioData) {
  const { jsPDF } = await import("jspdf");
  const document = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const accent = hexToRgb(portfolio.appearance?.accent ?? "#8b5cf6");
  let cursorY = margin;

  const nextLine = (amount: number) => {
    if (cursorY + amount <= pageHeight - margin) return;
    document.addPage();
    cursorY = margin;
  };
  const write = (text: string, size = 10, color: [number, number, number] = [39, 39, 42]) => {
    document.setFontSize(size);
    document.setTextColor(...color);
    const lines = document.splitTextToSize(text, pageWidth - margin * 2);
    nextLine(lines.length * (size * 0.48) + 4);
    document.text(lines, margin, cursorY);
    cursorY += lines.length * (size * 0.48) + 4;
  };
  const title = (text: string) => {
    nextLine(14);
    cursorY += 5;
    document.setDrawColor(...accent);
    document.line(margin, cursorY, margin + 9, cursorY);
    cursorY += 7;
    write(text.toUpperCase(), 11, accent);
  };

  const headerColor = mixWithWhite(accent, 0.9);
  document.setFillColor(248, 250, 252);
  document.rect(0, 0, pageWidth, pageHeight, "F");
  document.setFillColor(...headerColor);
  document.roundedRect(12, 12, pageWidth - 24, 62, 7, 7, "F");
  document.setDrawColor(...mixWithWhite(accent, 0.55));
  document.setLineWidth(0.25);
  document.circle(pageWidth - 27, 38, 23, "S");
  document.circle(pageWidth - 7, 20, 22, "S");
  const textX = portfolio.avatarDataUrl ? 57 : 24;
  if (portfolio.avatarDataUrl) {
    try {
      const avatar = await createPdfAvatar(portfolio.avatarDataUrl);
      const photoSize = 26;
      const photoX = 21;
      const photoY = 30;
      document.setFillColor(255, 255, 255);
      document.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 1.4, "F");
      document.addImage(avatar, "PNG", photoX, photoY, photoSize, photoSize);
    } catch { /* The exported PDF remains valid without an unsupported image. */ }
  }
  document.setFont("helvetica", "normal");
  document.setTextColor(...accent);
  document.setFontSize(8);
  document.text("P O R T F Ó L I O   P R O F I S S I O N A L", textX, 32);
  document.setTextColor(24, 24, 27);
  document.setFont("helvetica", "bold");
  document.setFontSize(25);
  document.text(portfolio.name, textX, 49);
  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.setTextColor(...accent);
  document.text(`github.com/${portfolio.githubUsername}`, textX, 60);
  cursorY = 88;

  if (portfolio.summary) { title("Resumo"); write(portfolio.summary); }
  if (portfolio.email || portfolio.phone) { title("Contato"); write([portfolio.email, portfolio.phone].filter(Boolean).join("  •  ")); }
  if (portfolio.skills.length) { title("Competências"); write(portfolio.skills.join("  •  ")); }
  if (portfolio.experiences.length) { title("Experiência"); portfolio.experiences.forEach((experience) => write(experience)); }
  if (portfolio.repos.length) {
    title("Projetos selecionados");
    portfolio.repos.forEach((repo) => {
      nextLine(16);
      document.setFontSize(11); document.setTextColor(24, 24, 27); document.text(repo.name, margin, cursorY); cursorY += 5;
      write(`${repo.language ?? "Projeto"} — ${repo.description ?? "Sem descrição fornecida."}`, 9, [82, 82, 91]);
      write(repo.html_url, 8, accent);
    });
  }
  document.save(`${portfolio.name.trim().replaceAll(/\s+/g, "-").toLowerCase() || "portfolio"}.pdf`);
}
