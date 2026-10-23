export type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stars: number;
  forks: number;
  updated_at: string;
};

export type PortfolioAppearance = {
  mode: "dark" | "light";
  accent: string;
  font?: "display" | "clean" | "editorial" | "mono";
};

export const portfolioFontOptions = {
  display: { label: "Space", family: "var(--font-display), sans-serif", exportFamily: "Space Grotesk, Arial, sans-serif" },
  clean: { label: "Clean", family: "Arial, Helvetica, sans-serif", exportFamily: "Arial, Helvetica, sans-serif" },
  editorial: { label: "Editorial", family: "Georgia, Times New Roman, serif", exportFamily: "Georgia, Times New Roman, serif" },
  mono: { label: "Mono", family: "var(--font-mono), monospace", exportFamily: "IBM Plex Mono, Consolas, monospace" },
} as const;

export type PortfolioData = {
  name: string;
  avatarDataUrl?: string | null;
  resumeFileName?: string | null;
  appearance?: PortfolioAppearance;
  summary: string;
  email: string | null;
  phone: string | null;
  skills: string[];
  experiences: string[];
  githubUsername: string;
  repos: GitHubRepo[];
};

export const portfolioStorageKey = "myportfolio:portfolio";
