"use client";
import { useEffect, useState, type FC } from "react";
import { throttle } from "lodash";
import { usePathname } from "next/navigation";
import Link from "next/link";
import classNames from "classnames";
import { formatNumber, PHONENUMBER } from "@/constants";
import Logo from "@/ui/common/logo";
import MenuButton from "@/ui/common/menu-button";

const navigation = [
  { id: 0, name: "Inteligentny Dom", href: "/inteligentny-dom/" },
  { id: 1, name: "Instalacje Elektryczne", href: "/instalacje-elektryczne/" },
  { id: 2, name: "Sieci LAN", href: "/sieci-lokalne/" },
  { id: 3, name: "Współpraca", href: "/wspolpraca/" },
  { id: 4, name: "Realizacje", href: "/realizacje/" },
  { id: 5, name: "O Nas", href: "/o-nas/" },
  { id: 6, name: "Kontakt", href: "/kontakt/" },
];

const NavBar: FC = function () {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const close = (): void => {
    setIsOpen(false);
  };

  const THRESHOLD = 100; // px
  const THROTTLE_THRESHOLD = 100; // ms
  const [isTop, setIsTop] = useState(false);
  const path = usePathname();
  useEffect(() => {
    if (path === "/") {
      const scroll = throttle(() => {
        const { scrollY } = window;
        setIsTop(scrollY < THRESHOLD);
      }, THROTTLE_THRESHOLD);
      document.addEventListener("scroll", scroll);
      scroll();
      return () => document.removeEventListener("scroll", scroll);
    } else {
      setIsTop(false);
    }
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const navLiClass =
    "whitespace-nowrap flex justify-center lg:justify-end p-2 lg:p-2 hover:text-brand hover:underline underline-offset-8 hover:scale-105 transform transition duration-150 ease-in-out";
  return (
    <nav
      className={classNames(
        "grid-layout content-start items-center content-padding sm:px-0 py-2 fixed z-30 w-full text-dark-grey bg-grey transition-all duration-500",
        isTop && "bg-opacity-0",
        isOpen && "bg-[#242424] bg-opacity-100 h-[100vh]"
      )}
    >
      <div className="flex items-center lg:justify-center justify-between col-span-full lg:col-span-1">
        <div className="h-12 w-24 sm:w-[12vw] sm:px-2 grid place-items-center">
          <Logo />
        </div>
        <div className="sm:w-[12vw] grid place-items-center lg:hidden sm:col-start-3">
          <MenuButton onClick={toggleOpen} isOpen={isOpen} />
        </div>
      </div>
      <ul
        onClick={close}
        className={classNames(
          "flex-col p-0 xs:text-2xl text-xl justify-center col-span-full",
          "lg:h-auto lg:text-base lg:flex lg:flex-row lg:justify-center lg:col-span-2",
          isOpen ? "flex uppercase mt-12" : "hidden"
        )}
      >
        {navigation.map(({ id, name, href }) => (
          <li key={id} className={classNames("xl:px-2", id === 3 && "mt-8 lg:mt-0")}>
            <Link className={classNames(navLiClass, path === href && "text-brand")} href={href}>
              {name}
            </Link>
          </li>
        ))}
        <li className="mt-16 lg:hidden">
          <Link className={navLiClass} href={`tel:${PHONENUMBER}`}>
            {formatNumber(PHONENUMBER)}
          </Link>
        </li>
      </ul>
      <div className="lg:flex lg:justify-end xl:justify-center hidden">
        <Link className={navLiClass} href={`tel:${PHONENUMBER}`}>
          {formatNumber(PHONENUMBER)}
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
