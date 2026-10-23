import { BarChart3, FileUp, Rocket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stages = [
  [FileUp, "Entrada", "Conecte GitHub e envie o currículo."],
  [BarChart3, "Curadoria", "Escolha os destaques do seu perfil."],
  [Rocket, "Publicação", "Revise e compartilhe sua página pública."]
];

export function DashboardScreen() {
  return (
    <main className="min-h-svh bg-muted/30 px-4 py-8 sm:px-6"><div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl bg-card p-6 shadow-sm sm:p-8"><Badge variant="secondary">DASHBOARD</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight">Fluxo do portfólio.</h1><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Organize suas fontes profissionais e publique uma versão que represente seu trabalho.</p></header>
      <section className="grid gap-4 md:grid-cols-3">{stages.map(([Icon, title, description]) => { const StageIcon = Icon as typeof FileUp; return <Card key={title as string}><CardHeader><StageIcon className="size-5 text-primary" /><CardTitle>{title as string}</CardTitle><CardDescription>{description as string}</CardDescription></CardHeader><CardContent><p className="text-sm font-medium text-primary">Em preparação</p></CardContent></Card>; })}</section>
    </div></main>
  );
}
