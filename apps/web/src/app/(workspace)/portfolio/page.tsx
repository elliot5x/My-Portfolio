"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PortfolioScreen } from "@/features/portfolio/portfolio-screen";
import { getCurrentPortfolio, type PortfolioData } from "@/lib/portfolio";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(() => getCurrentPortfolio());
  const router = useRouter();

  useEffect(() => {
    if (!getCurrentPortfolio()) router.replace("/");
  }, [router]);

  if (!portfolio) return null;
  return <PortfolioScreen portfolio={portfolio} onPortfolioChange={setPortfolio} />;
}