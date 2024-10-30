import React from "react";
import { useState } from "react";
import { Slide } from "react-awesome-reveal";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import AboutUsImage from '../../assets/images/aboutUs.png'
import "./AboutUs.css";

export const AboutUs = ({id}) => {
  const { t } = useTranslation();
  const [isModal, setIsModal] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex justify-between gap-10 container mx-auto w-[90%] mb-20 max-md:flex-col" id={id}>
      <Slide className="w-1/2 max-md:w-full" direction="left">
        <div className="">
          <h1 className="text-secondary_color text-4xl font-bold mb-10 max-md:mb-4 max-md:text-xl">
          {t("Header.about")}
          </h1>
          <p className="text-secondary_color text-2xl max-md:text-lg">
          {t("about.title")}
          </p>
        </div>
      </Slide>

      <div
        onClick={() => setIsModal(true)}
        className={`w-1/2 max-md:w-full cursor-pointer max-md:h-96 rounded-2xl ${ !isModal ? "relative" : ""}`}
        style={{
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "container",
          backgroundImage: `url(${AboutUsImage})`,
        }}
      >
        <span className="glightbox_video">
          <span className={"play-btn"} href="#"></span>
        </span>
        {isModal && (
          <div
            className="mx-auto w-screen h-screen absolute top-0 right-0 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-2/3 max-md:w-full relative bg-black"
              onMouseEnter={() => {
                setVisible(true);
                console.log("enter");
              }}
              onMouseLeave={() => {
                setVisible(false);
                console.log("leave");
              }}
            >
              {visible && (
                <button
                  className="bg-red-600 w-16 h-16 absolute right-2 top-2 z-50 text-white font-bold text-xl rounded-full"
                  onClick={() => setIsModal(false)}
                >
                  X
                </button>
              )}
              <iframe
                width="100%"
                height="506"
                src="https://www.youtube.com/embed/G0zm9TybxpU"
                title="Firma uchun video"
                frameborder="1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
