import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import "./Navbar.css";

import { PhoneIcon, LangIcon } from "../../assets/icons";
import logo from "../../assets/images/logo.png";
import { UsersContext } from "../../context";

export const Navbar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { scrollValue } = useContext(UsersContext);
  const [isOpen, setOpen] = useState({ hamburger: false, lang: false });
  const language = [
    {
      code: "uz",
      name: "Uz",
      conuntry_code: "uz",
    },
    {
      code: "ru",
      name: "Ru",
      conuntry_code: "ru",
    },
    {
      code: "en",
      name: "En",
      conuntry_code: "gb",
    },
    {
      code: "ar",
      name: "Fr",
      conuntry_code: "ar",
    },
  ];

  const toggleHamburger = () => {
    setOpen({ hamburger: !isOpen.hamburger });
  };

  const changeLanguage = (code) => {
    // let pathnameLang = "uz";
    // if (pathname.split("/")[1] === "uz") pathnameLang = "uz";
    // if (pathname.split("/")[1] === "ru") pathnameLang = "ru";
    // if (pathname.split("/")[1] === "en") pathnameLang = "en";
    // if (pathname.split("/")[1] === "ar") pathnameLang = "ar";
    // navigate(pathname.replace(pathnameLang, code));
    
    i18next.changeLanguage(code);
    window.location.reload(false);
  };
  return (
    <header
      className={`py-0 text-white transition-opacity relative md:backdrop-blur-xl max-md:bg-secondary_color
      ${scrollValue > 0 || pathname !== "/" ? "bg-secondary_color" : ""}
      ${pathname === "/" ? "absolute w-full md:absolute " : ""}
      ${pathname !== "/" ? "sticky top-0" : ""} w-full z-10`}
    >
      <div className="flex items-center justify-between container mx-auto w-[90%]">
        <div className="">
          <a href="/" className="my-4 block">
            <iv className="flex items-center">
              <img src={logo} alt="Main logo" className="w-14 h-14" />
              <p className={`text-white text-center  font-bold`}>
                <span>
                  YANGIYER FLOUR
                  <br />
                </span>
                <span className={`text-primary_color ml-1`}>TRADING</span>
              </p>
            </iv>
          </a>
        </div>
        <div
          className={`w-3/6 xl:flex justify-end gap-10
          ${
            isOpen.hamburger
              ? "xl:static fixed top-0 left-0 max-xl:w-full max-xl:h-screen xl:bg-inherit bg-[rgba(0,0,0,0.96)] max-xl:flex max-xl:flex-col max-xl:justify-start max-xl:pt-24"
              : "hidden"
          }`}
        >
          <a
            href="#"
            className="max-xl:flex items-center hidden pl-14 -mt-20 mb-2 gap-4"
            onClick={() => toggleHamburger()}
          >
            <img src={logo} alt="" width={"60"} height={"20"} className="" />
            <p className={`text-white text-center font-bold text-sm`}>
              <span>
                YANGIYER FLOUR
                <br />
              </span>
              <span className={`text-primary_color ml-1`}>TRADING</span>
            </p>
          </a>

          <a
            href={`#aboutus`}
            className="max-xl:pl-14 max-xl:text-[#F06D06] font-bold text-xl max-xl:mb-2"
            onClick={() => toggleHamburger()}
          >
            {t("Header.about")}
          </a>
          <a
            href={`#products`}
            className="max-xl:pl-14 max-xl:text-[#F06D06] font-bold text-xl max-xl:mb-2"
            onClick={() => toggleHamburger()}
          >
            {t("Header.product")}
          </a>
          <a
            href={`#partners`}
            className="max-xl:pl-14 max-xl:text-[#F06D06] font-bold text-xl max-xl:mb-2"
            onClick={() => toggleHamburger()}
          >
            {t("Header.partners")}
          </a>
          <a
            href={`#contactus`}
            className="max-xl:pl-14 max-xl:text-[#F06D06] font-bold text-xl"
            onClick={() => toggleHamburger()}
          >
            {t("Header.ContactUs")}
          </a>
          <div className="max-xl:flex gap-4 hidden pl-14 mt-8">
            {" "}
            {language.map((item) => (
              <button
                key={item.code}
                className="bg-[#F2F2F2] text-black rounded p-2"
                onClick={() => {
                  changeLanguage(item.code);
                  toggleHamburger();
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="w-2/6 flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 max-[779px]:hidden">
            <PhoneIcon />
            <span> +998909795055 </span>
          </div>
          <div
            className="items-center gap-3 text-black bg-[#F2F2F2] ml-10 p-2.5 rounded cursor-pointer xl:flex hidden relative"
            onClick={() => setOpen({ ...isOpen, lang: !isOpen.lang })}
          >
            <LangIcon />
            {isOpen.lang && (
              <ul className="absolute bg-[#F2F2F2] pb-2 text-black top-10 left-0 w-full rounded">
                {language.map((item) => (
                  <li
                    key={item.code}
                    className="px-2.5 hover:bg-black hover:text-white"
                    onClick={() => {
                      changeLanguage(item.code);
                    }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="xl:hidden block">
            <Hamburger
              toggled={isOpen.hamburger}
              toggle={() => toggleHamburger()}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
