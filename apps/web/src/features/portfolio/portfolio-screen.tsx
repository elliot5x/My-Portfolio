"use client";

import Link from "next/link";
import { type CSSProperties, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Check, Code2, Download, FileArchive, FileText, Mail, MapPin, Pencil, Phone, Sparkles, Trash2, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { exportPortfolioPdf } from "@/lib/export-portfolio-pdf";
import { exportPortfolioHtml } from "@/lib/export-portfolio-html";
import { portfolioFontOptions, portfolioStorageKey, type PortfolioData } from "@/lib/portfolio";

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function PortfolioScreen({ portfolio }: { portfolio: PortfolioData }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isHtmlExporting, setIsHtmlExporting] = useState(false);
  const [isContentEditing, setIsContentEditing] = useState(false);
  const [isOrderingRepos, setIsOrderingRepos] = useState(false);
  const [repos, setRepos] = useState(portfolio.repos);
  const [skillsDraft, setSkillsDraft] = useState(portfolio.skills.join(", "));
  const [experiencesDraft, setExperiencesDraft] = useState(portfolio.experiences.join("\n\n"));
  const appearance = portfolio.appearance ?? { mode: "dark" as const, accent: "#8b5cf6" };
  const isLight = appearance.mode === "light";
  const accent = appearance.accent;
  const font = portfolioFontOptions[appearance.font ?? "display"];
  const themeStyle = { backgroundColor: isLight ? "#f8fafc" : "#09090b", color: isLight ? "#18181b" : "#fafafa", fontFamily: font.family } satisfies CSSProperties;
  const surfaceStyle = { backgroundColor: isLight ? "#ffffff" : "rgba(255,255,255,0.04)", borderColor: isLight ? "#e4e4e7" : "rgba(255,255,255,0.1)", color: isLight ? "#18181b" : "#fafafa" } satisfies CSSProperties;
  const accentText = { color: accent } satisfies CSSProperties;
  const accentButton = { backgroundColor: accent, color: "#ffffff" } satisfies CSSProperties;
  const currentPortfolio = { ...portfolio, repos };

  async function downloadPdf() {
    setIsExporting(true);
    try { await exportPortfolioPdf(currentPortfolio); }
    finally { setIsExporting(false); }
  }

  async function downloadHtml() {
    setIsHtmlExporting(true);
    try { await exportPortfolioHtml(currentPortfolio); }
    finally { setIsHtmlExporting(false); }
  }

  function saveContent() {
    const updated = {
      ...currentPortfolio,
      skills: skillsDraft.split(",").map((skill) => skill.trim()).filter(Boolean),
      experiences: experiencesDraft.split("\n").map((experience) => experience.trim()).filter(Boolean),
    };
    window.localStorage.setItem(portfolioStorageKey, JSON.stringify(updated));
    window.location.reload();
  }

  function moveRepository(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= repos.length) return;
    const updated = [...repos];
    [updated[index], updated[destination]] = [updated[destination], updated[index]];
    setRepos(updated);
    window.localStorage.setItem(portfolioStorageKey, JSON.stringify({ ...portfolio, repos: updated }));
  }

  function removeRepository(repositoryUrl: string) {
    const updated = repos.filter((repository) => repository.html_url !== repositoryUrl);
    setRepos(updated);
    window.localStorage.setItem(portfolioStorageKey, JSON.stringify({ ...portfolio, repos: updated }));
  }

  return <main style={themeStyle} className="min-h-svh px-4 py-5 sm:px-6 sm:py-8"><div className="mx-auto max-w-6xl">
    <header className="flex items-center justify-between border-b pb-5" style={{ borderColor: surfaceStyle.borderColor }}><div className="flex items-center gap-3"><Button type="button" onClick={() => window.history.back()} variant="outline" size="sm" style={surfaceStyle} className="hover:opacity-80"><ArrowLeft />Voltar</Button><Link href="/?landing=1" style={accentText} className="font-mono text-xs tracking-[0.16em]">MYPORTFOLIO / PROFILE</Link></div><Button variant="outline" size="sm" style={surfaceStyle} className="hover:opacity-80" asChild><Link href="/onboarding">Editar dados</Link></Button></header>
    <section style={{ background: `linear-gradient(135deg, ${accent}38, ${isLight ? "#ffffff" : "#18181b"} 52%, ${accent}18)`, borderColor: surfaceStyle.borderColor }} className="relative mt-6 overflow-hidden rounded-3xl border px-6 py-10 sm:px-10 sm:py-14"><div aria-hidden style={{ borderColor: `${accent}45` }} className="absolute -right-16 -top-20 size-72 rounded-full border" /><div aria-hidden style={{ borderColor: `${accent}2c` }} className="absolute -bottom-28 right-32 size-72 rounded-full border" /><div className="relative grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-end"><Avatar className="size-24 border-4 border-white/15 shadow-2xl sm:size-32"><AvatarImage src={portfolio.avatarDataUrl ?? undefined} alt={`Foto de ${portfolio.name}`} /><AvatarFallback style={accentButton} className="text-3xl font-semibold">{initials(portfolio.name)}</AvatarFallback></Avatar><div><p style={accentText} className="font-mono text-xs tracking-[0.18em]">PORTFÓLIO PROFISSIONAL</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-balance sm:text-6xl">{portfolio.name}</h1>{portfolio.summary && <p className={`mt-5 max-w-2xl text-base leading-7 ${isLight ? "text-zinc-600" : "text-zinc-300"}`}>{portfolio.summary}</p>}</div><div className="flex flex-wrap gap-2"><Button onClick={downloadPdf} disabled={isExporting} style={accentButton} className="hover:opacity-85">{isExporting ? "Preparando PDF..." : "Baixar PDF"}<Download /></Button><Button onClick={downloadHtml} disabled={isHtmlExporting} variant="outline" style={surfaceStyle} className="hover:opacity-80">{isHtmlExporting ? "Empacotando..." : "HTML + CSS"}<FileArchive /></Button></div></div></section>
    <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]"><aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit"><Card style={surfaceStyle} className="shadow-none"><CardContent className="space-y-5 p-5"><p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">CONTATO</p><div className={`space-y-3 text-sm ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{portfolio.email && <a style={accentText} className="flex items-center gap-3 transition-opacity hover:opacity-75" href={`mailto:${portfolio.email}`}><Mail className="size-4" />{portfolio.email}</a>}{portfolio.phone && <p className="flex items-center gap-3"><Phone style={accentText} className="size-4" />{portfolio.phone}</p>}<p className="flex items-center gap-3"><MapPin style={accentText} className="size-4" />Presença digital</p></div><div className="border-t pt-5" style={{ borderColor: surfaceStyle.borderColor }}><Button variant="outline" style={surfaceStyle} className="w-full hover:opacity-80" asChild><a href={`https://github.com/${portfolio.githubUsername}`} target="_blank" rel="noreferrer"><Code2 />Abrir GitHub</a></Button></div></CardContent></Card><Card style={surfaceStyle} className="shadow-none"><CardContent className="p-5"><div className="flex items-center justify-between gap-3"><p className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">COMPETÊNCIAS</p><Button type="button" onClick={() => setIsContentEditing((editing) => !editing)} variant="ghost" size="sm" style={accentText} className="hover:bg-transparent hover:opacity-70">{isContentEditing ? <X /> : <Pencil />}{isContentEditing ? "Fechar" : "Editar"}</Button></div>{isContentEditing ? <Textarea value={skillsDraft} onChange={(event) => setSkillsDraft(event.target.value)} className={`mt-4 min-h-28 ${isLight ? "border-zinc-200 bg-zinc-50 text-zinc-900" : "border-white/10 bg-black/20 text-white"}`} placeholder="React, TypeScript, Python" /> : <div className="mt-4 flex flex-wrap gap-2">{portfolio.skills.length > 0 ? portfolio.skills.map((skill) => <Badge key={skill} style={{ backgroundColor: `${accent}18`, borderColor: `${accent}38`, color: accent }} className="border hover:opacity-80">{skill}</Badge>) : <p className="text-sm text-zinc-500">Nenhuma competência adicionada.</p>}</div>}</CardContent></Card></aside>
      <div className="space-y-6">{(portfolio.experiences.length > 0 || isContentEditing) && <section><div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><FileText style={accentText} className="size-4" /><h2 className="font-mono text-xs tracking-[0.16em] text-zinc-400">EXPERIÊNCIA</h2></div>{!isContentEditing && <Button type="button" onClick={() => setIsContentEditing(true)} variant="ghost" size="sm" style={accentText} className="hover:bg-transparent hover:opacity-70"><Pencil />Editar</Button>}</div><Card style={surfaceStyle} className="shadow-none"><CardContent className="divide-y divide-zinc-200/20 p-0">{isContentEditing ? <div className="p-5"><Textarea value={experiencesDraft} onChange={(event) => setExperiencesDraft(event.target.value)} className={`min-h-48 ${isLight ? "border-zinc-200 bg-zinc-50 text-zinc-900" : "border-white/10 bg-black/20 text-white"}`} placeholder="Uma experiência por linha" /><div className="mt-4 flex justify-end"><Button type="button" onClick={saveContent} style={accentButton} className="hover:opacity-85"><Check />Salvar competências e experiências</Button></div></div> : portfolio.experiences.map((experience) => <article key={experience} className={`whitespace-pre-line px-6 py-5 text-sm leading-7 ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{experience}</article>)}</CardContent></Card></section>}
        <section><div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><Sparkles style={accentText} className="size-4" /><h2 className="font-mono text-xs tracking-[0.16em] text-zinc-400">REPOSITÓRIOS</h2></div><div className="flex items-center gap-3"><span className="text-xs text-zinc-500">{repos.length} encontrados</span>{repos.length > 0 && <Button type="button" onClick={() => setIsOrderingRepos((ordering) => !ordering)} variant="ghost" size="sm" style={accentText} className="hover:bg-transparent hover:opacity-70">{isOrderingRepos ? <X /> : <Pencil />}{isOrderingRepos ? "Concluir" : "Organizar"}</Button>}</div></div>{repos.length > 0 ? <div className="grid gap-3 sm:grid-cols-2">{repos.map((repo, index) => <Card key={repo.html_url} style={surfaceStyle} className="shadow-none transition-transform hover:-translate-y-1"><CardContent className="p-5"><div className="flex items-start justify-between gap-4"><span style={accentText} className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span><div className="flex items-center gap-2"><span className="rounded-full border border-zinc-300/30 px-2 py-1 text-[10px] text-zinc-500">{repo.language ?? "Projeto"}</span>{isOrderingRepos && <span className="flex gap-1"><Button type="button" aria-label={`Mover ${repo.name} para cima`} onClick={() => moveRepository(index, -1)} disabled={index === 0} variant="outline" size="icon-xs" style={surfaceStyle}><ArrowUp /></Button><Button type="button" aria-label={`Mover ${repo.name} para baixo`} onClick={() => moveRepository(index, 1)} disabled={index === repos.length - 1} variant="outline" size="icon-xs" style={surfaceStyle}><ArrowDown /></Button><Button type="button" aria-label={`Remover ${repo.name} do portfólio`} onClick={() => removeRepository(repo.html_url)} variant="outline" size="icon-xs" className="border-red-400/30 text-red-400 hover:bg-red-400/10 hover:text-red-300"><Trash2 /></Button></span>}</div></div><h3 className="mt-7 font-medium">{repo.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-zinc-500">{repo.description ?? "Sem descrição fornecida."}</p><a style={accentText} className="mt-5 inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-70" href={repo.html_url} target="_blank" rel="noreferrer">Ver repositório <ArrowUpRight className="size-4" /></a></CardContent></Card>)}</div> : <Card style={surfaceStyle} className="text-zinc-500 shadow-none"><CardContent className="p-6 text-sm">Nenhum repositório selecionado. Reabra “Editar dados” para consultar o GitHub novamente.</CardContent></Card>}</section>
      </div>
    </div>
  </div></main>;
}
