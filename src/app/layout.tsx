import "./globals.css";
import "yet-another-react-lightbox/styles.css";
import "react-photo-album/columns.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import type { FC } from "react";
import classNames from "classnames";
import Footer from "@/ui/sections/footer";
import NavBar from "@/ui/sections/navbar";
import GridLines from "@/ui/sections/grid-lines";
import { siteMetadata } from "@/lib/meta";

const font = Montserrat({ subsets: ["latin", "latin-ext"] });

interface RootLayoutProps {
  children?: React.ReactNode;
}

export const metadata = siteMetadata; // Re-export metadata

const RootLayout: FC<RootLayoutProps> = function ({ children }) {
  return (
    <html lang="pl-PL" className="scroll-smooth scroll-pt-20">
      <body className={classNames(font.className, "text-left text-grey bg-[#F6FAFF] relative")}>
        <GridLines />
        <NavBar />
        <main className="flex flex-col justify-between pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
