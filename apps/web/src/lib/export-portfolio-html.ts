import JSZip from "jszip";

import { portfolioFontOptions, type PortfolioData } from "@/lib/portfolio";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] as string);
}

function safeFileName(name: string) {
  return name.trim().replaceAll(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "portfolio";
}

export async function exportPortfolioHtml(portfolio: PortfolioData) {
  const appearance = portfolio.appearance ?? { mode: "dark" as const, accent: "#8b5cf6", font: "display" as const };
  const font = portfolioFontOptions[appearance.font ?? "display"];
  const background = appearance.mode === "light" ? "#f8fafc" : "#09090b";
  const foreground = appearance.mode === "light" ? "#18181b" : "#fafafa";
  const surface = appearance.mode === "light" ? "#ffffff" : "#15151a";
  const border = appearance.mode === "light" ? "#e4e4e7" : "#29292f";
  const muted = appearance.mode === "light" ? "#52525b" : "#a1a1aa";
  const skills = portfolio.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
  const experiences = portfolio.experiences.map((experience) => `<article>${escapeHtml(experience).replaceAll("\n", "<br>")}</article>`).join("");
  const repos = portfolio.repos.map((repo) => `<article class="repo"><span>${escapeHtml(repo.language ?? "Projeto")}</span><h3>${escapeHtml(repo.name)}</h3><p>${escapeHtml(repo.description ?? "Sem descrição fornecida.")}</p><a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer">Ver repositório ↗</a></article>`).join("");
  const photo = portfolio.avatarDataUrl ? `<img class="avatar" src="${portfolio.avatarDataUrl}" alt="Foto de ${escapeHtml(portfolio.name)}">` : "";
  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(portfolio.name)} | Portfólio</title><link rel="stylesheet" href="styles.css"></head><body>
<main><header><div>${photo}<div><p class="eyebrow">PORTFÓLIO PROFISSIONAL</p><h1>${escapeHtml(portfolio.name)}</h1>${portfolio.summary ? `<p class="summary">${escapeHtml(portfolio.summary)}</p>` : ""}</div></div><a class="github" href="https://github.com/${encodeURIComponent(portfolio.githubUsername)}" target="_blank" rel="noreferrer">GitHub ↗</a></header>
<div class="layout"><aside><section><p class="label">CONTATO</p>${portfolio.email ? `<a href="mailto:${escapeHtml(portfolio.email)}">${escapeHtml(portfolio.email)}</a>` : ""}${portfolio.phone ? `<p>${escapeHtml(portfolio.phone)}</p>` : ""}</section>${skills ? `<section><p class="label">COMPETÊNCIAS</p><ul class="skills">${skills}</ul></section>` : ""}</aside><div class="content">${experiences ? `<section><p class="label">EXPERIÊNCIA</p><div class="card experiences">${experiences}</div></section>` : ""}<section><p class="label">REPOSITÓRIOS</p><div class="repos">${repos || "<div class=\"card\">Nenhum repositório público encontrado.</div>"}</div></section></div></div></main></body></html>`;
  const css = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap');
:root{--bg:${background};--fg:${foreground};--surface:${surface};--border:${border};--muted:${muted};--accent:${appearance.accent};--font:${font.exportFamily}}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font)}main{max-width:1120px;margin:auto;padding:32px 24px 64px}header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;padding:48px;border:1px solid var(--border);border-radius:28px;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 20%,transparent),var(--surface) 55%)}header>div{display:flex;gap:24px;align-items:center}.avatar{width:112px;height:112px;object-fit:cover;border-radius:50%;border:4px solid color-mix(in srgb,var(--accent) 45%,white)}.eyebrow,.label{font:500 12px 'IBM Plex Mono',monospace;letter-spacing:.14em;color:var(--accent)}h1{font-size:clamp(40px,7vw,72px);letter-spacing:-.06em;margin:12px 0}.summary{max-width:650px;color:var(--muted);line-height:1.7}.github,.repo a{color:var(--accent);text-decoration:none}.github{border:1px solid var(--border);padding:11px 14px;border-radius:8px}.layout{display:grid;grid-template-columns:260px 1fr;gap:24px;margin-top:24px}aside,.card,.repo{border:1px solid var(--border);background:var(--surface);border-radius:16px}aside section{padding:22px;border-bottom:1px solid var(--border)}aside section:last-child{border:0}aside p,aside a{color:var(--muted);line-height:1.7}.skills{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}.skills li{border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);color:var(--accent);padding:6px 9px;border-radius:999px;font-size:13px}.content{display:grid;gap:24px}.experiences article{padding:22px;white-space:normal;line-height:1.8;color:var(--muted);border-bottom:1px solid var(--border)}.experiences article:last-child{border:0}.repos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.repo{padding:22px}.repo span{font-size:12px;color:var(--muted)}.repo h3{margin:22px 0 8px}.repo p{color:var(--muted);line-height:1.6;min-height:50px}@media(max-width:720px){header,.layout{display:block}header>div{align-items:flex-start}.github{display:inline-block;margin-top:20px}.layout{margin-top:16px}.content{margin-top:16px}.repos{grid-template-columns:1fr}}`;
  const zip = new JSZip();
  zip.file("index.html", html);
  zip.file("styles.css", css);
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeFileName(portfolio.name)}-portfolio-html.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
}
