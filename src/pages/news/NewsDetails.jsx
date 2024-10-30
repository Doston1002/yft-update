import React from 'react';
import { useParams } from 'react-router-dom';
import newsData from './NewsData'; 
import i18next from "i18next";
import { useTranslation } from "react-i18next";

export const NewsDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();  
  const newsItem = newsData.find((item) => item._id === id); 

  return (
    <div className="container mx-auto w-[80%] py-10">
      {newsItem ? (
        <>
          <img src={newsItem.photo || "https://example.com/default.jpg"} alt={newsItem.title_uz} className="w-full h-96 object-cover rounded-lg mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            {t("NewsCard.title", {
              news_card_title: `${newsItem?.[`title_${i18next.language}`]}`,
            })}
          </h1>

          {/* Yangilik tavsifi */}
          <p>
            {t("NewsCard.desc", {
              news_card_body: `${newsItem?.[`body_${i18next.language}`]}`,
            })}
          </p>
        </>
      ) : (
        <p>{t('Yangilik topilmadi.')}</p>
      )}
    </div>
  );
};
