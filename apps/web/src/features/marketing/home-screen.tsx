import Link from "next/link";
import { ButtonLink } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

const highlights = [
  "GitHub + currículo em um único fluxo",
  "Curadoria rápida do que vai para o portfólio",
  "Página pública com foco em performance e SEO"
];

export function HomeScreen() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">MyPortfolio</p>
        <h1>Seu portfólio, organizado a partir do currículo e do GitHub.</h1>
        <p className="lead">
          Uma base para gerar identidade profissional com entrada de PDF, integração com
          GitHub e publicação rápida em uma página pública elegante.
        </p>

        <div className="actions">
          <ButtonLink variant="primary" href="/onboarding">
            Começar onboarding
          </ButtonLink>
          <Link className="button button-secondary" href="/dashboard">
            Ver dashboard
          </Link>
        </div>
      </section>

      <Card>
        <h2>O que essa base já prepara</h2>
        <ul className="feature-list">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
