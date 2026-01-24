import type { FC } from "react";
import { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";
import PortfolioSection from "@/ui/portfolio/portfolio-section";

export const metadata: Metadata = getPageMetadata("Realizacje", "realizacje", [
  "Realizacje Wielmi Smart Homes",
  "Portfolio inteligentnych instalacji Kraków",
  "Projekty smart home Kraków",
  "Instalacje elektryczne realizacje",
  "Sieci lokalne realizacje Kraków",
  "Automatyka budynkowa portfolio",
]);

const Page: FC = function () {
  return <PortfolioSection />;
};

export default Page;
