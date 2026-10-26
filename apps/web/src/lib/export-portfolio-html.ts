import JSZip from "jszip";

import { portfolioFontOptions, type PortfolioData } from "@/lib/portfolio";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] as string);
}

function safeFileName(name: string) {
  return name.trim().replaceAll(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "portfolio";
}

function applyEditorialDarkTheme(html: string) {
  const theme = `<style>body{background:#171717;color:#f4f1e8}header,footer,.work,.services,.hero{border-color:#f4f1e825}.intro h1,.work h2{background:#242424;border-color:#f4f1e8;color:#f4f1e8}.hero figure{background:#30302d}.hero figcaption{background:#171717;border-color:#f4f1e8;color:#f4f1e8}.work>div>p,.summary,.work p{color:#b8b5ac}.project{border-color:#f4f1e866}.services h2{border-color:#f4f1e8}.initials{color:#f4f1e855}</style>`;
  return html.replace("</head>", `${theme}</head>`);
}

export async function exportPortfolioHtml(portfolio: PortfolioData) {
  const appearance = portfolio.appearance ?? { mode: "dark" as const, accent: "#8b5cf6", font: "display" as const };
  if (appearance.layout === "editorial") {
    const skills = portfolio.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
    const experiences = portfolio.experiences.map((experience) => `<p>${escapeHtml(experience).replaceAll("\n", "<br>")}</p>`).join("");
    const repos = portfolio.repos.slice(0, 4).map((repo) => `<a class="project" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer"><small>${escapeHtml(repo.language ?? "Projeto")}</small><h3>${escapeHtml(repo.name)}</h3><p>${escapeHtml(repo.description ?? "Projeto selecionado do GitHub.")}</p></a>`).join("");
    const photo = portfolio.avatarDataUrl ? `<img src="${portfolio.avatarDataUrl}" alt="Foto de ${escapeHtml(portfolio.name)}">` : `<span class="initials">${escapeHtml(portfolio.name.split(" ").map((part) => part[0] ?? "").slice(0, 2).join(""))}</span>`;
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(portfolio.name)} | Portfólio</title><link rel="stylesheet" href="styles.css"></head><body><main><header><p class="eyebrow">PORTFÓLIO<br>PROFISSIONAL</p><a href="https://github.com/${encodeURIComponent(portfolio.githubUsername)}">GitHub ↗</a></header><section class="hero"><div class="intro"><p class="eyebrow">FREELANCE / PORTFÓLIO</p><h1>${escapeHtml(portfolio.name)}</h1><p class="summary">${escapeHtml(portfolio.summary || "Ideias, projetos e experiências reunidos em um só lugar.")}</p><p class="scroll">↓ &nbsp; EXPLORE MEU TRABALHO</p></div><figure>${photo}<figcaption>${escapeHtml(portfolio.githubUsername)}</figcaption></figure></section><section class="work"><div><h2>Meu trabalho</h2><p>${escapeHtml(portfolio.summary || `Olá, sou ${portfolio.name}. Aqui estão alguns projetos e experiências que representam meu trabalho.`)}</p></div><div><h3>Experiência</h3>${experiences || "<p>Experiência profissional em atualização.</p>"}<h3>Projetos em destaque</h3><div class="projects">${repos || "<p>Nenhum projeto selecionado.</p>"}</div></div></section><section class="services"><h2>Serviços / competências</h2><ul>${skills || "<li>Desenvolvimento</li><li>Estratégia</li><li>Criação</li><li>Conteúdo</li>"}</ul></section><footer><div><p class="eyebrow">VAMOS CONVERSAR</p><h2>Entre em contato</h2>${portfolio.email ? `<a href="mailto:${escapeHtml(portfolio.email)}">${escapeHtml(portfolio.email)}</a>` : ""}${portfolio.phone ? `<p>${escapeHtml(portfolio.phone)}</p>` : ""}<a href="https://github.com/${encodeURIComponent(portfolio.githubUsername)}">@${escapeHtml(portfolio.githubUsername)}</a></div></footer></main></body></html>`;
    const css = `*{box-sizing:border-box}body{margin:0;background:#deddd1;color:#171525;font-family:"Courier New",monospace}main{max-width:1120px;margin:auto;border-inline:1px solid #17152518}header,footer{display:flex;justify-content:space-between;align-items:center;padding:22px 5%}header a,footer a{color:inherit}.eyebrow{font-size:11px;font-weight:bold;line-height:1.35}.hero{display:grid;grid-template-columns:1fr .8fr;min-height:510px;border-block:1px solid #17152525}.intro{display:flex;flex-direction:column;justify-content:center;padding:48px 10%}.intro h1,.work h2{width:fit-content;margin:26px 0;padding:14px 20px;border:2px solid #171525;background:#e8e7dc;transform:rotate(-2deg);font-size:clamp(32px,5vw,58px);text-transform:uppercase}.summary,.work p{max-width:620px;font-size:14px;line-height:1.8}.scroll{margin-top:24px;font-size:11px}.hero figure{position:relative;min-height:400px;margin:0;background:#b8b7ae}.hero figure img{width:100%;height:100%;position:absolute;inset:0;object-fit:cover;filter:grayscale(1)}.initials{display:grid;height:100%;place-items:center;font-size:80px;font-weight:bold;color:#17152555}.hero figcaption{position:absolute;bottom:24px;left:24px;padding:10px 16px;border:1px solid;background:#deddd1;text-transform:uppercase}.work{display:grid;grid-template-columns:.8fr 1.2fr;gap:60px;padding:56px 8%;border-bottom:1px solid #17152525}.work h2{font-size:30px}.work h3{margin:0 0 12px;font-size:12px;text-transform:uppercase}.work h3:not(:first-child){margin-top:30px}.work>div>p{border-left:2px solid;padding-left:14px}.projects{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.project{padding-top:12px;border-top:1px solid #17152566;color:inherit;text-decoration:none}.project small{font-size:10px;text-transform:uppercase}.project h3{margin:7px 0}.project p{font-size:12px}.services{padding:56px 8%;border-bottom:1px solid #17152525}.services h2{width:fit-content;margin:0 auto;padding:12px 16px;border:2px solid;font-size:clamp(25px,4vw,40px);text-align:center;text-transform:uppercase}.services ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 50px;margin:40px 0 0;padding:0;list-style:none}.services li{font-size:14px;font-weight:bold;text-transform:uppercase}.services li:before{content:"✳";margin-right:18px;font-size:28px}footer{padding-block:48px}footer h2{margin:14px 0;font-size:30px;text-transform:uppercase}footer a,footer div>p:not(.eyebrow){display:block;margin-top:10px;font-size:13px}@media(max-width:700px){.hero,.work{grid-template-columns:1fr}.hero figure{min-height:360px}.work{gap:24px;padding:38px 7%}.services{padding:40px 7%}.services ul{gap:18px}.projects{grid-template-columns:1fr}header,footer{padding-inline:7%}}`;
    const zip = new JSZip();
    zip.file("index.html", appearance.mode === "dark" ? applyEditorialDarkTheme(html) : html);
    zip.file("styles.css", css);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeFileName(portfolio.name)}-portfolio-html.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
    return;
  }
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
