export type PortfolioPhoto = {
  type: "photo";
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PortfolioVideo = {
  type: "video";
  id: string;
  src: string;
  poster: string;
  posterWidth: number;
  posterHeight: number;
  width: number;
  height: number;
  mimeType: `video/${string}`;
  alt: string;
};

export type PortfolioMedia = PortfolioPhoto | PortfolioVideo;

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  media: PortfolioMedia[];
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: "sienna",
    title: "Sienna — instalacja elektryczna i okablowanie smart home HDL",
    description:
      "Kompleksowe wykonanie instalacji elektrycznej, okablowania oraz podłączeń urządzeń systemu inteligentnego domu HDL. Zakres prac obejmował również monitoring wizyjny oraz wykonanie i konfigurację sieci LAN.",
    media: [
      {
        type: "photo",
        id: "sienna-rozdzielnica",
        src: "/images/realizacje/sienna/rozdzielnica.jpg",
        width: 1200,
        height: 1600,
        alt: "Rozdzielnica elektryczna z modułami automatyki i okablowaniem w projekcie Sienna",
      },
      {
        type: "photo",
        id: "sienna-instalacja",
        src: "/images/realizacje/sienna/instalacja.jpg",
        width: 1200,
        height: 1600,
        alt: "Oświetlenie i wnętrze lokalu Sienna na etapie prac instalacyjnych",
      },
      {
        type: "photo",
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
    media: [
      {
        type: "photo",
        id: "angels-rozdzielnica",
        src: "/images/realizacje/angels/rozdzielnica.jpg",
        width: 1200,
        height: 1600,
        alt: "Rozdzielnica elektryczna wykonana dla Angel’s Karaoke & Lounge Bar w Warszawie",
      },
      {
        type: "video",
        id: "angels-film",
        src: "/videos/portfolio/angels.mp4",
        poster: "/images/realizacje/angels/video-poster.jpg",
        posterWidth: 1080,
        posterHeight: 1920,
        width: 1080,
        height: 1920,
        mimeType: "video/mp4",
        alt: "Film z realizacji Angel’s Karaoke & Lounge Bar w Warszawie",
      },
    ],
  },
  {
    id: "instalacja-elektryczna-etap-wykonawczy",
    title: "Instalacja elektryczna — etap wykonawczy",
    description:
      "Prowadzenie przewodów na ścianach, stropach i w podłodze przed rozpoczęciem prac wykończeniowych. Dokumentacja pokazuje przygotowanie tras kablowych, punktów instalacyjnych oraz miejsca montażu rozdzielnicy.",
    media: [
      {
        type: "photo",
        id: "instalacja-okablowanie-pomieszczenia",
        src: "/images/realizacje/instalacja-elektryczna/okablowanie-pomieszczenia.jpg",
        width: 960,
        height: 1280,
        alt: "Okablowanie ścian, stropu i podłogi przed pracami wykończeniowymi",
      },
      {
        type: "photo",
        id: "instalacja-trasy-kablowe",
        src: "/images/realizacje/instalacja-elektryczna/trasy-kablowe.jpg",
        width: 960,
        height: 1280,
        alt: "Uporządkowane trasy kablowe w pomieszczeniu w stanie surowym",
      },
      {
        type: "photo",
        id: "instalacja-podejscie-do-rozdzielnicy",
        src: "/images/realizacje/instalacja-elektryczna/podejscie-do-rozdzielnicy.jpg",
        width: 1280,
        height: 960,
        alt: "Przewody w rurach osłonowych prowadzone do miejsca montażu rozdzielnicy",
      },
      {
        type: "photo",
        id: "instalacja-okablowanie-stropu",
        src: "/images/realizacje/instalacja-elektryczna/okablowanie-stropu.jpg",
        width: 960,
        height: 1280,
        alt: "Przewody instalacyjne prowadzone pod stropem",
      },
      {
        type: "photo",
        id: "instalacja-punkty-instalacyjne",
        src: "/images/realizacje/instalacja-elektryczna/punkty-instalacyjne.jpg",
        width: 960,
        height: 1280,
        alt: "Puszki i rury osłonowe przygotowane w ścianie",
      },
      {
        type: "photo",
        id: "instalacja-rury-oslonowe",
        src: "/images/realizacje/instalacja-elektryczna/rury-oslonowe.jpg",
        width: 1042,
        height: 1280,
        alt: "Uporządkowane rury osłonowe mocowane pod stropem",
      },
      {
        type: "photo",
        id: "instalacja-okablowanie-podlogi",
        src: "/images/realizacje/instalacja-elektryczna/okablowanie-podlogi.jpg",
        width: 960,
        height: 1280,
        alt: "Trasy kablowe prowadzone w podłodze między pomieszczeniami",
      },
      {
        type: "photo",
        id: "instalacja-montaz-obudowy",
        src: "/images/realizacje/instalacja-elektryczna/montaz-obudowy.jpg",
        width: 960,
        height: 1280,
        alt: "Montaż obudowy rozdzielnicy i przygotowanie przewodów",
      },
      {
        type: "photo",
        id: "instalacja-przygotowanie-rozdzielnicy",
        src: "/images/realizacje/instalacja-elektryczna/przygotowanie-rozdzielnicy.jpg",
        width: 960,
        height: 1280,
        alt: "Przewody przygotowane do montażu i podłączenia rozdzielnicy",
      },
    ],
  },
];
