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
    id: "sienna",
    title: "Sienna — instalacja elektryczna i okablowanie smart home HDL",
    description:
      "Kompleksowe wykonanie instalacji elektrycznej, okablowania oraz podłączeń urządzeń systemu inteligentnego domu HDL. Zakres prac obejmował również monitoring wizyjny oraz wykonanie i konfigurację sieci LAN.",
    photos: [
      {
        id: "sienna-rozdzielnica",
        src: "/images/realizacje/sienna/rozdzielnica.jpg",
        width: 1200,
        height: 1600,
        alt: "Rozdzielnica elektryczna z modułami automatyki i okablowaniem w projekcie Sienna",
      },
      {
        id: "sienna-instalacja",
        src: "/images/realizacje/sienna/instalacja.jpg",
        width: 1200,
        height: 1600,
        alt: "Oświetlenie i wnętrze lokalu Sienna na etapie prac instalacyjnych",
      },
      {
        id: "sienna-oswietlenie",
        src: "/images/realizacje/sienna/oswietlenie.jpg",
        width: 1200,
        height: 1600,
        alt: "Żyrandol i podświetlenie dekoracyjne we wnętrzu Sienna",
      },
    ],
  },
  {
    id: "angels-warszawa",
    title: "Angel’s Karaoke & Lounge Bar — Warszawa",
    description:
      "Wykonanie instalacji elektrycznej, monitoringu wizyjnego oraz sieci LAN w lokalu Angel’s Karaoke & Lounge Bar w Warszawie. Zakres prac obejmował również konfigurację monitoringu i sieci LAN.",
    photos: [
      {
        id: "angels-rozdzielnica",
        src: "/images/realizacje/angels/rozdzielnica.jpg",
        width: 1200,
        height: 1600,
        alt: "Rozdzielnica elektryczna wykonana dla Angel’s Karaoke & Lounge Bar w Warszawie",
      },
      {
        id: "angels-wejscie",
        src: "/images/realizacje/angels/wejscie.jpg",
        width: 1000,
        height: 1280,
        alt: "Podświetlone wejście do Angel’s Karaoke & Lounge Bar w Warszawie",
      },
      {
        id: "angels-monitoring",
        src: "/images/realizacje/angels/monitoring.jpg",
        width: 1000,
        height: 1280,
        alt: "Kamera monitoringu wizyjnego we wnętrzu Angel’s Karaoke & Lounge Bar",
      },
    ],
  },
];
