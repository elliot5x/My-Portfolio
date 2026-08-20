import { Card } from "../../components/ui/card";

const cards = [
  {
    title: "Entrada",
    description: "Conectar GitHub e enviar o PDF do currículo."
  },
  {
    title: "Curadoria",
    description: "Escolher o que aparece no portfólio e em destaque."
  },
  {
    title: "Publicação",
    description: "Gerar a página pública e o card para divulgação."
  }
];

export function DashboardScreen() {
  return (
    <main className="shell dashboard-shell">
      <section className="hero hero-compact">
        <p className="eyebrow">Dashboard</p>
        <h1>Fluxo operacional do portfólio.</h1>
        <p className="lead">
          Espaço inicial para onboarding, upload, curadoria e preview da identidade
          profissional.
        </p>
      </section>

      <section className="grid">
        {cards.map((card) => (
          <Card key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
