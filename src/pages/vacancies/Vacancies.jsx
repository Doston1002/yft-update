import React, { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { Card } from "../../components/card/Card";
import apiClient from "../../utils/apiClient";

export const Vacancies = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState({
    data: [],
    isLoading: true,
    error: null,
  });

  const getData = async () => {
    const res = await apiClient.get("elon/all");
    if (res.status === 200) {
      setNews({
        data: res.data,
        isLoading: false,
        error: "",
      });
    } else {
      setNews({ data: [], isLoading: false, error: "Nimadir xato" });
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <h1 className="text-3xl text-secondary_color container mx-auto w-[90%] mt-10 font-bold">
        Vacancies
      </h1>
      <div className="container mx-auto w-[90%] grid grid-cols-3 gap-6 py-10 ">
        {news.isLoading ? (
          <Spinner
            color="info"
            aria-label="Extra large spinner example"
            size="xl"
          />
        ) : (
          news.data.reverse().map((item) => (
            <Card
              to={`/details/elon/${item._id}`}
              className={""}
              key={item._id}
              imgSrc={item.photo}
              imgAlt={item.title_uz}
              title={t("NewsCard.title", {news_card_title: `${item?.[`title_${i18next.language}`]}`})}
              description={item.body_uz}
            />
          ))
        )}
      </div>
    </>
  );
};
