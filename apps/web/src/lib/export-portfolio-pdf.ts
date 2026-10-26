import type { PortfolioData } from "@/lib/portfolio";

const margin = 18;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return [139, 92, 246];
  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16)];
}

function mixColors(color: [number, number, number], target: [number, number, number], ratio: number): [number, number, number] {
  return color.map((channel, index) => Math.round(channel + ((target[index] ?? 255) - channel) * ratio)) as [number, number, number];
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
  const appearance = portfolio.appearance ?? { mode: "dark" as const, accent: "#8b5cf6" };
  const isDark = appearance.mode === "dark";
  const isEditorial = appearance.layout === "editorial";
  const background: [number, number, number] = isEditorial
    ? isDark ? [23, 23, 23] : [222, 221, 209]
    : isDark ? [9, 9, 11] : [248, 250, 252];
  const foreground: [number, number, number] = isEditorial
    ? isDark ? [244, 241, 232] : [23, 21, 37]
    : isDark ? [250, 250, 250] : [24, 24, 27];
  const muted: [number, number, number] = isEditorial
    ? isDark ? [184, 181, 172] : [85, 84, 79]
    : isDark ? [161, 161, 170] : [82, 82, 91];
  const surface: [number, number, number] = isEditorial
    ? isDark ? [36, 36, 36] : [232, 231, 220]
    : isDark ? [21, 21, 26] : [255, 255, 255];
  const accent = isEditorial ? foreground : hexToRgb(appearance.accent);
  const font = isEditorial || appearance.font === "mono" ? "courier" : appearance.font === "editorial" ? "times" : "helvetica";
  const pageBackground = () => {
    document.setFillColor(...background);
    document.rect(0, 0, pageWidth, pageHeight, "F");
  };
  pageBackground();
  let cursorY = margin;

  const nextLine = (amount: number) => {
    if (cursorY + amount <= pageHeight - margin) return;
    document.addPage();
    pageBackground();
    cursorY = margin;
  };
  const write = (text: string, size = 10, color: [number, number, number] = foreground) => {
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

  const headerColor = isEditorial ? surface : mixColors(accent, background, isDark ? 0.88 : 0.9);
  document.setFillColor(...headerColor);
  if (isEditorial) document.rect(12, 12, pageWidth - 24, 62, "F");
  else document.roundedRect(12, 12, pageWidth - 24, 62, 7, 7, "F");
  document.setDrawColor(...mixColors(accent, background, 0.55));
  document.setLineWidth(0.25);
  if (!isEditorial) {
    document.circle(pageWidth - 27, 38, 23, "S");
    document.circle(pageWidth - 7, 20, 22, "S");
  }
  const textX = portfolio.avatarDataUrl ? 57 : 24;
  if (portfolio.avatarDataUrl) {
    try {
      const avatar = await createPdfAvatar(portfolio.avatarDataUrl);
      const photoSize = 26;
      const photoX = 21;
      const photoY = 30;
      document.setFillColor(...background);
      document.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 1.4, "F");
      document.addImage(avatar, "PNG", photoX, photoY, photoSize, photoSize);
    } catch { /* The exported PDF remains valid without an unsupported image. */ }
  }
  document.setFont(font, "normal");
  document.setTextColor(...accent);
  document.setFontSize(8);
  document.text("P O R T F Ó L I O   P R O F I S S I O N A L", textX, 32);
  document.setTextColor(...foreground);
  document.setFont(font, "bold");
  document.setFontSize(25);
  document.text(portfolio.name, textX, 49);
  document.setFont(font, "normal");
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
      document.setFontSize(11); document.setTextColor(...foreground); document.text(repo.name, margin, cursorY); cursorY += 5;
      write(`${repo.language ?? "Projeto"} — ${repo.description ?? "Sem descrição fornecida."}`, 9, muted);
      write(repo.html_url, 8, accent);
    });
  }
  document.save(`${portfolio.name.trim().replaceAll(/\s+/g, "-").toLowerCase() || "portfolio"}.pdf`);
}
