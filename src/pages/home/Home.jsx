import { useEffect, useContext } from "react";
import { Partners } from "../../components/partners/Partners";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import { Hero } from "../../components/hero/Hero";
import { Accardion } from "../../components/faq/Accardion";
import { AboutUs } from "../../components/about_us/AboutUs";
import { ContactForm } from "../../components/contact_form/ContactForm";
import { ImageGallary } from "../../components/image_gallary/ImageGalary";
import { Products } from "../../components/products/Products";
import { Card } from "../../components/card/Card";
import { LeftArrow } from "../../assets/icons";

import { newsActions, UsersContext } from "../../context";
import { News } from "../news/News";

export const Home = () => {
  const { t } = useTranslation();
  const { news, vacancys } = useContext(UsersContext);

  useEffect(() => {
    newsActions.getNews("news/all");
    newsActions.getNews("elon/all");
  }, []);

  return (
    <div>
      <Hero />
      <AboutUs id={"aboutus"}/>
      <ImageGallary />
    <div className="mb-10">

   
      <div className="container w-[90%] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-secondary_color text-2xl md:text-4xl font-bold">
          {t("Header.study")}
          </h1>
          <Link
            to={"news"}
            className="bg-primary_color py-2 px-6 rounded-md text-white flex items-center gap-2 max-md:hidden"
          >
            {t("Header.All")}
            <span>
              <LeftArrow />
            </span>
          </Link>
        </div>
      
      </div>
        <News/>
      </div>
      <Products id={"products"}/>

      <div className="container w-[90%] mx-auto mb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-secondary_color text-2xl md:text-4xl font-bold">
          {t("Header.Vacancies")}
          </h1>
          <Link
            to={"vacancies"}
            className="bg-primary_color py-2 px-6 rounded-md text-white flex items-center gap-2 max-md:hidden"
          >
            {t("Header.All")}
            <span>
              <LeftArrow />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
          {vacancys.slice(0, 3).reverse().map((item) => (
            <Card
              to={`details/elon/${item._id}`}
              key={item._id}
              imgSrc={item.photo}
              imgAlt={item.title_uz}
              title={t("NewsCard.title", {news_card_title: `${item?.[`title_${i18next.language}`]}`})}
              description={item.body_uz}
            />
          ))}
        </div>
        <Link
          to={"vacancies"}
          className="bg-primary_color py-2 px-6 mt-7 text-center rounded-md text-white hidden items-center justify-center gap-2 max-md:flex"
        >
          <p className="gap-2 flex items-center">
          {t("Header.All")}
            <span>
              <LeftArrow />
            </span>
          </p>
        </Link>
      </div>

      <Accardion />

      <Partners id={"partners"}/>

      <ContactForm />
    </div>
  );
};
