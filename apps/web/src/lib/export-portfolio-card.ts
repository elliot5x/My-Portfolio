import type { PortfolioData } from "@/lib/portfolio";

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawWrappedText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      if (lines.length === maxLines) break;
    } else {
      currentLine = candidate;
    }
  }
  if (lines.length < maxLines && currentLine) lines.push(currentLine);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    let lastLine = lines[maxLines - 1] ?? "";
    while (lastLine && context.measureText(`${lastLine}...`).width > maxWidth) lastLine = lastLine.slice(0, -1);
    lines[maxLines - 1] = `${lastLine.trimEnd()}...`;
  }

  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
}

async function loadAvatar(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a foto para o card."));
    image.src = dataUrl;
  });
}

async function createCardBlob(portfolio: PortfolioData) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível gerar o card neste navegador.");

  const appearance = portfolio.appearance ?? { mode: "dark" as const, accent: "#8b5cf6" };
  const isEditorial = appearance.layout === "editorial";
  const isDark = appearance.mode === "dark";
  const colors = isEditorial
    ? { background: isDark ? "#171717" : "#deddd1", foreground: isDark ? "#f4f1e8" : "#171525", muted: isDark ? "#b8b5ac" : "#55544f", surface: isDark ? "#242424" : "#e8e7dc", border: isDark ? "#f4f1e8" : "#171525" }
    : { background: isDark ? "#09090b" : "#f8fafc", foreground: isDark ? "#fafafa" : "#18181b", muted: isDark ? "#a1a1aa" : "#52525b", surface: isDark ? "#15151a" : "#ffffff", border: isDark ? "#29292f" : "#e4e4e7" };
  const accent = isEditorial ? colors.foreground : appearance.accent;
  const font = isEditorial ? "IBM Plex Mono, monospace" : `${appearance.font === "editorial" ? "Georgia, serif" : appearance.font === "mono" ? "IBM Plex Mono, monospace" : appearance.font === "clean" ? "Arial, sans-serif" : "Space Grotesk, sans-serif"}`;

  context.fillStyle = colors.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = colors.border;
  context.lineWidth = isEditorial ? 2 : 1;
  context.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

  if (isEditorial) {
    context.fillStyle = colors.surface;
    context.fillRect(72, 72, 12, canvas.height - 144);
  } else {
    context.fillStyle = accent;
    context.globalAlpha = 0.12;
    context.beginPath();
    context.arc(1090, 70, 220, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
  }

  let textX = 112;
  if (portfolio.avatarDataUrl) {
    try {
      const avatar = await loadAvatar(portfolio.avatarDataUrl);
      const avatarSize = 104;
      const avatarX = isEditorial ? 112 : 88;
      const avatarY = 82;
      context.save();
      context.beginPath();
      context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      context.clip();
      context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
      context.restore();
      textX = avatarX + avatarSize + 26;
    } catch {
      textX = 112;
    }
  }

  context.fillStyle = accent;
  context.font = `500 18px ${font}`;
  context.fillText(isEditorial ? "PORTFÓLIO PROFISSIONAL" : "PORTFÓLIO / PERFIL", textX, 104);
  context.fillStyle = colors.foreground;
  context.font = `700 ${isEditorial ? 54 : 62}px ${font}`;
  context.fillText(portfolio.name, textX, 174, canvas.width - textX - 100);

  context.fillStyle = colors.muted;
  context.font = `400 22px ${font}`;
  drawWrappedText(context, portfolio.summary || `Desenvolvedor(a) no GitHub: @${portfolio.githubUsername}`, 112, 240, 940, 30, 2);

  const skills = portfolio.skills.slice(0, 4);
  let skillX = 112;
  const skillY = 330;
  context.font = `500 16px ${font}`;
  for (const skill of skills) {
    const width = Math.min(context.measureText(skill).width + 34, 220);
    if (skillX + width > 1080) break;
    context.fillStyle = colors.surface;
    roundedRect(context, skillX, skillY, width, 40, isEditorial ? 0 : 20);
    context.fill();
    context.strokeStyle = isEditorial ? colors.border : `${accent}70`;
    context.stroke();
    context.fillStyle = isEditorial ? colors.foreground : accent;
    context.fillText(skill, skillX + 17, skillY + 26, width - 28);
    skillX += width + 12;
  }

  const featuredRepo = portfolio.repos[0];
  if (featuredRepo) {
    context.strokeStyle = colors.border;
    context.beginPath();
    context.moveTo(112, 412);
    context.lineTo(1088, 412);
    context.stroke();
    context.fillStyle = accent;
    context.font = `500 15px ${font}`;
    context.fillText("PROJETO EM DESTAQUE", 112, 448);
    context.fillStyle = colors.foreground;
    context.font = `600 24px ${font}`;
    context.fillText(featuredRepo.name, 112, 484, 650);
    context.fillStyle = colors.muted;
    context.font = `400 17px ${font}`;
    context.fillText(featuredRepo.language ?? "GitHub", 112, 516);
  }

  context.fillStyle = colors.muted;
  context.font = `500 18px ${font}`;
  context.textAlign = "right";
  context.fillText(`github.com/${portfolio.githubUsername}`, 1088, 566, 920);
  context.textAlign = "left";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Não foi possível exportar o card como PNG.")), "image/png");
  });
}

export async function sharePortfolioCard(portfolio: PortfolioData) {
  const blob = await createCardBlob(portfolio);
  const fileName = `${portfolio.name.trim().replaceAll(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "portfolio"}-card.png`;
  const file = new File([blob], fileName, { type: "image/png" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `Portfólio de ${portfolio.name}`, text: `Conheça meu trabalho: github.com/${portfolio.githubUsername}` });
      return;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}