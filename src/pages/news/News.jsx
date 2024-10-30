import React from "react";
import { Link } from "react-router-dom";
import newsData from './NewsData';  // 'newsData' ni import qilamiz
import i18next from "i18next";
import { useTranslation } from "react-i18next";

export const News = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto w-[80%] ">
     
      <div className="grid lg:grid-cols-2 gap-6">
        {newsData.map((item) => (
          <div key={item._id} className="bg-white shadow-lg rounded-lg p-4">
            <img src={item.photo} alt={item.title_uz} className="w-full   object-cover rounded-t-lg" />

            <h2 className="text-xl font-bold my-6">
              {t("NewsCard.title", {
                news_card_title: `${item?.[`title_${i18next.language}`]}`,
              })}
            </h2>

            {/* Yangi sahifaga o'tish uchun Link ishlatildi */}
            <Link to={`/news/${item._id}`} className="mt-4 px-4 py-2 bg-primary_color text-white rounded-lg">
              {t('Batafsil ma\'lumot')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
