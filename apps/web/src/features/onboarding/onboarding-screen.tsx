"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, ButtonLink } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

const steps = [
  {
    label: "1",
    title: "Conectar GitHub",
    description: "Vamos buscar seus repositórios públicos e normalizar os dados do perfil."
  },
  {
    label: "2",
    title: "Enviar currículo",
    description: "Suba o PDF do LinkedIn para extrair experiência, formação e skills."
  },
  {
    label: "3",
    title: "Curar e publicar",
    description: "Escolha o que aparece, revise o resultado e siga para o portfólio final."
  }
];

export function OnboardingScreen() {
  const [githubUsername, setGithubUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [summary, setSummary] = useState("");
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  const completion = useMemo(() => {
    const filled = [githubUsername, fullName, summary, pdfFileName].filter(Boolean).length;
    return `${filled}/4`;
  }, [githubUsername, fullName, summary, pdfFileName]);

  return (
    <main className="shell onboarding-shell">
      <section className="hero onboarding-hero">
        <p className="eyebrow">Onboarding</p>
        <h1>Comece conectando suas fontes profissionais.</h1>
        <p className="lead">
          Este fluxo organiza GitHub e currículo em uma base única para gerar um portfólio
          curado, público e pronto para compartilhar.
        </p>

        <div className="actions">
          <ButtonLink variant="primary" href="#form-onboarding">
            Preencher dados
          </ButtonLink>
          <Link className="button button-secondary" href="/api/health">
            Validar conexão
          </Link>
        </div>
      </section>

      <section className="grid onboarding-grid">
        {steps.map((step) => (
          <Card key={step.label} className="onboarding-card">
            <p className="step-index">{step.label}</p>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </Card>
        ))}
      </section>

      <section className="grid onboarding-form-grid" id="form-onboarding">
        <Card className="onboarding-form-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Dados iniciais</p>
              <h2>Primeira captura do perfil</h2>
            </div>
            <span className="completion-pill">{completion} concluído</span>
          </div>

          <form className="form-stack">
            <Input
              label="Nome do dev"
              name="fullName"
              placeholder="Seu nome completo"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
            />

            <Input
              label="GitHub"
              name="githubUsername"
              placeholder="usuario-github"
              value={githubUsername}
              onChange={(event) => setGithubUsername(event.target.value)}
              autoComplete="username"
              helperText="Use o username sem @."
            />

            <Input
              label="Currículo PDF"
              name="resume"
              type="file"
              accept="application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setPdfFileName(file ? file.name : null);
              }}
              helperText="Selecione o PDF exportado do LinkedIn."
            />

            <Textarea
              label="Resumo rápido"
              name="summary"
              placeholder="Conte em poucas linhas o foco do seu trabalho."
              rows={5}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              helperText="Esse texto vai ajudar a montar o topo do portfólio."
            />

            <div className="form-actions">
              <Button type="submit">Salvar rascunho</Button>
              <Button variant="secondary" type="button">
                Conectar GitHub depois
              </Button>
            </div>
          </form>
        </Card>

        <Card className="onboarding-preview-card">
          <p className="eyebrow">Prévia</p>
          <h2>Resumo do preenchimento</h2>
          <dl className="summary-list">
            <div>
              <dt>Nome</dt>
              <dd>{fullName || "Não informado"}</dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>{githubUsername ? `@${githubUsername}` : "Não informado"}</dd>
            </div>
            <div>
              <dt>Currículo</dt>
              <dd>{pdfFileName || "Nenhum arquivo selecionado"}</dd>
            </div>
            <div>
              <dt>Resumo</dt>
              <dd>{summary || "Sem resumo ainda"}</dd>
            </div>
          </dl>
        </Card>
      </section>
    </main>
  );
}
