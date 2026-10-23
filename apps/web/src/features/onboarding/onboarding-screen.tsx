"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, FileText, GitBranch, ImagePlus, Palette, Sun, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { portfolioFontOptions, type GitHubRepo, type PortfolioAppearance, type PortfolioData, portfolioStorageKey } from "@/lib/portfolio";
import { compressProfilePhoto } from "@/lib/profile-photo";

export function OnboardingScreen() {
  const accentPresets = ["#8b5cf6", "#0f766e", "#2563eb", "#db2777", "#ea580c"];
  const [githubUsername, setGithubUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [summary, setSummary] = useState("");
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [appearance, setAppearance] = useState<PortfolioAppearance>({ mode: "dark", accent: accentPresets[0], font: "display" });
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedPortfolio, setSavedPortfolio] = useState<PortfolioData | null>(null);
  const router = useRouter();
  const completion = useMemo(() => [githubUsername, fullName, summary, pdfFileName].filter(Boolean).length, [githubUsername, fullName, summary, pdfFileName]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(portfolioStorageKey);
      if (!saved) return;
      try {
        const data = JSON.parse(saved) as PortfolioData;
        setSavedPortfolio(data);
        setFullName(data.name);
        setGithubUsername(data.githubUsername);
        setSummary(data.summary);
        setAvatarDataUrl(data.avatarDataUrl ?? null);
        setPhotoFileName(data.avatarDataUrl ? "Foto atual" : null);
        setPdfFileName(data.resumeFileName ?? null);
        if (data.appearance) setAppearance(data.appearance);
      } catch { window.localStorage.removeItem(portfolioStorageKey); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function choosePhoto(file: File | null) {
    if (!file) { setPhotoFileName(null); setAvatarDataUrl(null); return; }
    try {
      const image = await compressProfilePhoto(file);
      setAvatarDataUrl(image);
      setPhotoFileName(file.name);
    } catch (photoError) {
      setAvatarDataUrl(null);
      setPhotoFileName(null);
      setError(photoError instanceof Error ? photoError.message : "Não foi possível preparar a foto.");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!fullName || !githubUsername) { setError("Informe seu nome e usuário do GitHub."); return; }
    setIsSubmitting(true);
    try {
      const reposResponse = await fetch(`${apiUrl}/api/v1/github/repos?username=${encodeURIComponent(githubUsername)}`);
      if (!reposResponse.ok) throw new Error("Não foi possível consultar o GitHub.");
      const reposPayload = await reposResponse.json() as { repos: GitHubRepo[] };
      let parsed = savedPortfolio ? { email: savedPortfolio.email, telefone: savedPortfolio.phone, habilidades: savedPortfolio.skills, experiencias: savedPortfolio.experiences } : { email: null as string | null, telefone: null as string | null, habilidades: [] as string[], experiencias: [] as string[] };
      if (resume) {
        const formData = new FormData(); formData.append("file", resume);
        const resumeResponse = await fetch(`${apiUrl}/api/v1/curriculo/parse`, { method: "POST", body: formData });
        if (!resumeResponse.ok) throw new Error("Não foi possível processar o currículo enviado.");
        const resumePayload = await resumeResponse.json() as { dados: typeof parsed };
        parsed = resumePayload.dados;
      }
      const data: PortfolioData = { name: fullName, avatarDataUrl, resumeFileName: pdfFileName, appearance, summary, email: parsed.email, phone: parsed.telefone, skills: parsed.habilidades, experiences: parsed.experiencias, githubUsername, repos: reposPayload.repos };
      window.localStorage.setItem(portfolioStorageKey, JSON.stringify(data));
      router.push("/");
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Não foi possível criar o portfólio."); }
    finally { setIsSubmitting(false); }
  }

  return (
    <main className="min-h-svh bg-[#09090b] px-4 py-6 text-white sm:px-6 sm:py-10"><div className="mx-auto max-w-6xl">
      <Link href="/?landing=1" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"><ArrowLeft className="size-4" /> Voltar para início</Link>
      <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <aside className="lg:sticky lg:top-10 lg:h-fit"><Badge className="border border-violet-300/20 bg-violet-400/10 font-mono text-violet-200 hover:bg-violet-400/10">CONFIGURAÇÃO / 01</Badge><h1 className="mt-6 max-w-md text-4xl font-semibold tracking-[-0.05em] text-balance sm:text-5xl">Comece pelas fontes do seu trabalho.</h1><p className="mt-5 max-w-md leading-7 text-zinc-400">Você informa o essencial. O portfólio é montado a partir do currículo e dos repositórios que você escolher.</p>
          <div className="mt-10 space-y-0 border-l border-white/10"><div className="relative pb-7 pl-6"><span className="absolute -left-2 top-0 grid size-4 place-items-center rounded-full border border-violet-300/50 bg-[#09090b] text-[9px] text-violet-200">1</span><p className="text-sm font-medium">Identificação</p><p className="mt-1 text-sm text-zinc-500">Nome e direcionamento profissional.</p></div><div className="relative pb-7 pl-6"><span className="absolute -left-2 top-0 grid size-4 place-items-center rounded-full border border-cyan-300/50 bg-[#09090b] text-[9px] text-cyan-200">2</span><p className="text-sm font-medium">Fontes</p><p className="mt-1 text-sm text-zinc-500">GitHub e currículo em PDF.</p></div><div className="relative pl-6"><span className="absolute -left-2 top-0 grid size-4 place-items-center rounded-full border border-emerald-300/50 bg-[#09090b] text-[9px] text-emerald-200">3</span><p className="text-sm font-medium">Revisão</p><p className="mt-1 text-sm text-zinc-500">Você confere antes de publicar.</p></div></div>
        </aside>
        <section><Card className="border-white/10 bg-white/[0.04] text-white shadow-2xl shadow-black/30"><CardHeader className="border-b border-white/10 pb-6"><div className="flex items-start justify-between gap-4"><div><CardTitle className="text-xl text-white">{savedPortfolio ? "Editar dados" : "Dados de partida"}</CardTitle><CardDescription className="mt-2 text-zinc-400">{savedPortfolio ? "Seus dados atuais foram carregados. Só altere o que quiser." : <>Os campos com <span className="text-violet-200">*</span> são obrigatórios.</>}</CardDescription></div><Badge variant="outline" className="border-white/15 font-mono text-zinc-400">{completion}/4</Badge></div></CardHeader><CardContent className="pt-6"><form className="space-y-7" onSubmit={submit}>
          <div className="grid gap-6 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="fullName" className="text-zinc-200">Nome <span className="text-violet-300">*</span></Label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" /><Input id="fullName" className="border-white/10 bg-black/30 pl-10 text-white placeholder:text-zinc-600" placeholder="Seu nome completo" value={fullName} onChange={(event) => setFullName(event.target.value)} /></div></div><div className="space-y-2"><Label htmlFor="githubUsername" className="text-zinc-200">Usuário do GitHub <span className="text-violet-300">*</span></Label><div className="relative"><GitBranch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" /><Input id="githubUsername" className="border-white/10 bg-black/30 pl-10 text-white placeholder:text-zinc-600" placeholder="usuario-github" value={githubUsername} onChange={(event) => setGithubUsername(event.target.value)} /></div></div></div>
          <div className="grid gap-6 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="resume" className="text-zinc-200">Currículo em PDF <span className="font-normal text-zinc-500">(opcional)</span></Label><div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4"><div className="flex items-center gap-3"><FileText className="size-5 shrink-0 text-violet-300" /><Input id="resume" className="border-0 bg-transparent p-0 text-sm text-zinc-300 file:mr-2 file:rounded-md file:border-0 file:bg-violet-400/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-violet-200 hover:file:bg-violet-400/25" type="file" accept="application/pdf" onChange={(event) => { const file = event.target.files?.[0] ?? null; setResume(file); setPdfFileName(file?.name ?? null); }} /></div></div></div><div className="space-y-2"><Label htmlFor="photo" className="text-zinc-200">Foto de perfil <span className="font-normal text-zinc-500">(opcional)</span></Label><div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4"><div className="flex items-center gap-3"><ImagePlus className="size-5 shrink-0 text-cyan-300" /><Input id="photo" className="border-0 bg-transparent p-0 text-sm text-zinc-300 file:mr-2 file:rounded-md file:border-0 file:bg-cyan-400/15 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-cyan-200 hover:file:bg-cyan-400/25" type="file" accept="image/*" onChange={(event) => { void choosePhoto(event.target.files?.[0] ?? null); }} /></div></div>{photoFileName && <p className="flex items-center gap-2 text-xs text-emerald-300"><Check className="size-3" /> Foto otimizada e pronta para salvar.</p>}</div></div>
          <div className="space-y-2"><Label htmlFor="summary" className="text-zinc-200">Resumo profissional <span className="font-normal text-zinc-500">(opcional)</span></Label><Textarea id="summary" className="min-h-28 border-white/10 bg-black/30 text-white placeholder:text-zinc-600" placeholder="Em poucas linhas, descreva o foco do seu trabalho." value={summary} onChange={(event) => setSummary(event.target.value)} /></div>
          <div className="space-y-3 border-t border-white/10 pt-6"><div className="flex items-center gap-2"><Palette className="size-4 text-violet-300" /><Label className="text-zinc-200">Visual do portfólio</Label></div><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setAppearance((current) => ({ ...current, mode: "dark" }))} className={appearance.mode === "dark" ? "border-violet-300/60 bg-violet-400/15 text-white hover:bg-violet-400/15" : "border-white/15 bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}>Escuro</Button><Button type="button" variant="outline" onClick={() => setAppearance((current) => ({ ...current, mode: "light" }))} className={appearance.mode === "light" ? "border-violet-300/60 bg-violet-400/15 text-white hover:bg-violet-400/15" : "border-white/15 bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}><Sun /> Claro</Button></div><div className="flex flex-wrap items-center gap-3"><p className="w-full text-xs text-zinc-500">Cor de destaque</p>{accentPresets.map((accent) => <button key={accent} type="button" aria-label={`Usar cor ${accent}`} onClick={() => setAppearance((current) => ({ ...current, accent }))} className={`grid size-8 place-items-center rounded-full border transition-transform hover:scale-110 ${appearance.accent === accent ? "border-white" : "border-transparent"}`} style={{ backgroundColor: accent }}>{appearance.accent === accent && <Check className="size-4 text-white" />}</button>)}<label className="relative grid size-8 cursor-pointer place-items-center overflow-hidden rounded-full border border-white/20 bg-white/5" title="Escolher outra cor"><input type="color" value={appearance.accent} onChange={(event) => setAppearance((current) => ({ ...current, accent: event.target.value }))} className="absolute inset-0 size-full cursor-pointer opacity-0" /><span className="size-3 rounded-full border border-white/60" style={{ backgroundColor: appearance.accent }} /></label></div><div className="flex flex-wrap gap-2"><p className="w-full text-xs text-zinc-500">Tipografia</p>{Object.entries(portfolioFontOptions).map(([key, font]) => <Button key={key} type="button" variant="outline" onClick={() => setAppearance((current) => ({ ...current, font: key as PortfolioAppearance["font"] }))} style={{ fontFamily: font.family }} className={appearance.font === key ? "border-violet-300/60 bg-violet-400/15 text-white hover:bg-violet-400/15" : "border-white/15 bg-black/30 text-zinc-400 hover:bg-white/10 hover:text-white"}>{font.label}</Button>)}</div></div>
          {error && <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}<div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6"><p className="text-xs leading-5 text-zinc-500">Você poderá revisar o resultado antes de compartilhar.</p><Button type="submit" className="bg-violet-500 text-white hover:bg-violet-400" disabled={isSubmitting}>{isSubmitting ? "Criando..." : "Gerar portfólio"}</Button></div>
        </form></CardContent></Card>
        <Card className="mt-4 border-white/10 bg-black/25 text-white shadow-none"><CardContent className="grid gap-4 p-5 sm:grid-cols-4"><div><p className="font-mono text-[11px] tracking-wide text-zinc-500">NOME</p><p className="mt-2 truncate text-sm font-medium">{fullName || "Aguardando"}</p></div><div><p className="font-mono text-[11px] tracking-wide text-zinc-500">GITHUB</p><p className="mt-2 truncate text-sm font-medium">{githubUsername ? `@${githubUsername}` : "Aguardando"}</p></div><div><p className="font-mono text-[11px] tracking-wide text-zinc-500">CURRÍCULO</p><p className="mt-2 flex items-center gap-2 truncate text-sm font-medium">{pdfFileName ? <Check className="size-4 shrink-0 text-emerald-300" /> : null}{pdfFileName || "Opcional"}</p></div><div><p className="font-mono text-[11px] tracking-wide text-zinc-500">FOTO</p><p className="mt-2 flex items-center gap-2 truncate text-sm font-medium">{photoFileName ? <Check className="size-4 shrink-0 text-emerald-300" /> : null}{photoFileName || "Opcional"}</p></div></CardContent></Card></section>
      </div>
    </div></main>
  );
}
