import type { FC } from "react";
import Heading from "@/ui/common/heading";
import PortfolioGallery from "@/ui/portfolio/portfolio-gallery";
import { portfolioItems } from "@/lib/portfolio";

const PortfolioSection: FC = function () {
  return (
    <section className="section">
      <div className="content-center-span">
        <Heading
          title="Realizacje"
          titleClass="text-4xl sm:text-5xl"
          tag="h1"
        />
        <p className="max-w-3xl text-lg">
          Poznaj wybrane realizacje, które pokazują nasze podejście do projektowania inteligentnych
          instalacji. Każdy projekt to indywidualny plan, precyzyjne wykonanie i efekt końcowy,
          który ułatwia codzienne życie.
        </p>
        <div className="mt-12 grid gap-16">
          {portfolioItems.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-[#E5E5E5] bg-white/95 p-8 shadow-sm z-10"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:max-w-2xl">
                  <h2 className="text-2xl font-semibold text-grey sm:text-3xl">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-lg text-grey/90">{item.description}</p>
                </div>
              </div>
              <PortfolioGallery photos={item.photos} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
