export type PortfolioPhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  photos: PortfolioPhoto[];
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: "smart-villa-krakow",
    title: "Willa smart w Krakowie",
    description:
      "Kompleksowa automatyka domu jednorodzinnego z integracją oświetlenia, rolet, alarmu i audio. Projekt obejmował projekt instalacji, konfigurację scen oraz szkolenie domowników.",
    photos: [
      {
        id: "1",
        src: "/images/landing_id.png",
        width: 1200,
        height: 900,
        alt: "Sterowanie inteligentnym domem w Krakowie",
      },
      {
        id: "2",
        src: "/images/landing_id.png",
        width: 1400,
        height: 900,
        alt: "Strefa dzienna z inteligentnym oświetleniem",
      },
      {
        id: "3",
        src: "/images/landing_id.png",
        width: 1200,
        height: 900,
        alt: "Panel sterowania inteligentnym domem",
      },
    ],
  },
  {
    id: "office-network-krakow",
    title: "Sieć biurowa dla firmy technologicznej",
    description:
      "Zaprojektowanie i wykonanie sieci LAN z monitoringiem i kontrolą dostępu. W ramach realizacji wykonaliśmy okablowanie strukturalne, szafę rack oraz integrację z systemem bezpieczeństwa.",
    photos: [
      {
        id: "1",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "Nowoczesna infrastruktura sieci lokalnej",
      },
      {
        id: "2",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "Okablowanie strukturalne w biurze",
      },
      {
        id: "3",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "System bezpieczeństwa i monitoring",
      },
      {
        id: "4",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "Szafa rack z urządzeniami sieciowymi",
      }
    ],
  },
  {
    id: "electrical-renovation",
    title: "Instalacja elektryczna apartamentu",
    description:
      "Modernizacja instalacji elektrycznej w apartamencie premium. Zakres prac obejmował nowe rozdzielnice, inteligentne sterowanie ogrzewaniem i przygotowanie pod fotowoltaikę.",
    photos: [
      {
        id: "1",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "Nowa instalacja elektryczna w apartamencie",
      },
      {
        id: "2",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "Rozdzielnica elektryczna po modernizacji",
      },
      {
        id: "3",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "Sterowanie ogrzewaniem w apartamencie",
      },
      {
        id: "4",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "Przygotowanie instalacji pod fotowoltaikę",
      },
      {
        id: "5",
        src: "/images/landing_id.png",
        width: 1200,
        height: 800,
        alt: "Inteligentne oświetlenie w apartamencie",
      }
    ],
  },
];
