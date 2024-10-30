import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Spinner } from "flowbite-react";

import { CalendarIcon } from "../../assets/icons";
import apiClient from "../../utils/apiClient";

export const MoreDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const all = useParams();
  const navigate = useNavigate();
  console.log(all);

  const [partners, setPartners] = useState({
    data: {},
    isLoading: true,
    error: null,
  });

  const getData = async () => {
    const res = await apiClient.get(`${all?.key}/${all?.id}`);
    if (res.status === 200) {
      setPartners({
        data: res.data,
        isLoading: false,
        error: "",
      });
    } else {
      setPartners({ data: [], isLoading: false, error: "Nimadir xato" });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className=" container mx-auto w-[90%] flex justify-between gap-5 lg:flex-row flex-col py-10">
      {partners.isLoading ? (
        <Spinner
          className=""
          color="info"
          aria-label="Extra large spinner example"
          size="xl"
        />
      ) : (
        <div className="w-full">
          <div className="lg:w-9/12 w-full flex flex-wrap gap-5">
            <CalendarIcon inner={true} />{" "}
            <span className="font-bold">{partners.data.date}</span>
          </div>
          <h1 className="text-4xl font-bold mb-8">
            {t("MoreDetails.title", {
              more_details_title: `${
                partners.data?.[`title_${i18next.language}`]
              }`,
            })}
          </h1>
          <div
            dangerouslySetInnerHTML={{
              __html: t("MoreDetails.body", {
                more_details_body: `${
                  partners.data?.[`body_${i18next.language}`]
                }`,
              }),
            }}
          />
        </div>
      )}
    </div>
  );
};
