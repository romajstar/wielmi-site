import Heading from "@/ui/common/heading";
import type { FC } from "react";
import Image from "next-export-optimize-images/image";

const partners = [
  // { name: "Satel", logo: "/images/logos/satel.png", alt: "Satel Logo" },
  { name: "Loxone", logo: "/images/logos/loxone.png", alt: "Loxone Logo" },
  { name: "i3 engineering", logo: "/images/logos/i3.png", alt: "i3 Logo" },
  { name: "Grenton", logo: "/images/logos/grenton.png", alt: "Grenton Logo" },
  { name: "TermoFol", logo: "/images/logos/termofol.png", alt: "Termofol Logo" },
  { name: "HikVision", logo: "/images/logos/hikvision.png", alt: "HikVision Logo" },
];

const Partners: FC = () => {
  return (
    <section className="section z-20 bg-grey text-dark-grey">
      <div className="content-left-half">
        <Heading title="PARTNERZY" />
      </div>
      <div className="content-center-span">
        <div className="grid grid-auto-fit gap-8 mt-10">
          {partners.map((partner, index) => (
            <div key={index} className="grid place-content-center">
              <div className="flex justify-center p-8 bg-[#F0F0F0] hover:shadow-[#F0F0F0] rounded-lg hover:shadow-md transition-shadow duration-300 min-h-52 max-w-60">
                <Image
                  src={partner.logo}
                  alt={partner.alt}
                  width={200} // Adjust based on your needs
                  height={100} // Adjust based on your needs
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
