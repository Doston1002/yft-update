import { useState,useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Spinner } from "flowbite-react";
import Slider from "react-slick";
import { Fade } from "react-awesome-reveal";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-lazy-load-image-component/src/effects/blur.css";

import banner1 from '../../assets/images/photo_24.jpg'
import banner2 from '../../assets/images/photo_23.jpg'
import banner3 from '../../assets/images/photo_25.jpg'

const bannerData = [
  {
    _id: "1",
    title_uz: "“Yangiyer Flour Trading” MChJ mustaqil, oilaviy kompaniya hisoblanadi. 1991 yildan beri faoliyat yuritadi.",
    title_ru: "ТОО Yangiyer Flour Trading является независимой семейной компанией. Работает с 1991 года. ",
    title_ar: "LLP Yangiyer Flour Trading یک شرکت مستقل و خانوادگی است. فعال از سال 1991. مستقر در قلب آسیای مرکزی.",
    title_en:"LLP Yangiyer Flour Trading is an independent, family owned company. Operating since 1991.",
    banner_img: banner1
  },
  {
    _id: "2",
    title_uz: "Markaziy Osiyoning markazida joylashgan. \"Yangiyer Flour Trading\" MChJ o'z maqsadi bo'yicha birinchi navli undan ikkinchi va uchinchi navgacha eng sifatli bug'doy unini ishlab chiqarish va raqobatbardosh narxlarda hech kimdan kam bo'lmagan xizmat ko'rsatish uchun qurilgan.",
    title_ru: "Базируется в самом сердце Центральной Азии. ТОО Yangiyer Flour Trading работает с целью производства пшеничной муки самого высокого качества от муки первого сорта до второго и третьего сорта и предлагает непревзойденные услуги по очень конкурентоспособным ценам.",
    title_ar: " LLP Yangiyer Flour Trading با هدف تولید آرد گندم با بهترین کیفیت از آرد درجه یک تا درجه دوم و سوم و ارائه خدماتی با قیمت های بسیار رقابتی عمل می کند",
    title_en:"Based in the heart of central Asia. LLP Yangiyer Flour Trading operates from their purpose built for producing best quality wheat flour from first class flour to second and third class and offering a service second to none at very competitive prices. ",
    banner_img: banner2
  },
  {
    _id: "3",
    title_uz: "Ulgurji va ishlab chiqarish bozori sohasida 30 yildan ortiq tajribaga ega. Bizning xodimlarimiz o'zlarining tajriba va bilimlarini mijozlarga har kuni yangi mahsulotlarni to'plash yoki yetkazib berishga yordam berish uchun ishlatadilar.",
    title_ru: "Обладая более чем 30-летним опытом работы в сфере оптового и производственного рынка. наши сотрудники будут использовать свой опыт и знания, чтобы помочь клиентам ежедневно собирать или доставлять свежие продукты.",
    title_ar: " با بیش از 30 سال سابقه در صنعت عمده فروشی و بازار تولید. کارکنان ما از تجربیات و دانش خود برای کمک به مشتریان برای دستیابی به مجموعه های محصولات تازه یا تحویل روزانه خود استفاده خواهند کرد.",
    title_en:"With over 30 years’ experience in the wholesale and production market industry. our staff will use their experience and knowledge to help customers achieve their fresh produce collections or deliveries on a daily basis.",
    banner_img: banner3
  }
];

export const Hero = () => {
  const { t } = useTranslation();
  const [banner, setBanner] = useState({
    data: bannerData,
    isLoading: false,
    error: null
  });

  const settings = {
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="mb-24">
      <Slider
        {...settings}
        autoplay={true}
        cssEase="linear"
        autoplaySpeed={4000}
        pauseOnHover={false}
      >
        {banner.isLoading ? (
          <Spinner
            color="info"
            aria-label="Extra large spinner example"
            size="xl"
            className="ml-20"
          />
        ) : banner.error ? (
          <h1 className="text-center text-2xl p-56 bg-black text-white">
            Xatolik
          </h1>
        ) : (
          banner.data.map((item) => (
            <div
              className="w-full h-[700px] max-md:h-auto relative -z-30 bg-black"
              key={item._id}
            >
              <div className="absolute md:top-1/3 left-1/2 md:-translate-x-1/2 z-50 max-md:bottom-20 max-md:left-0 max-md:px-4">
                <h1 className="text-5xl font-bold text-white text-center shadow-md max-md:hidden">
                  YANGIYER FLOUR{" "}
                  <span className="text-primary_color">TRADING</span>
                </h1>
                <p className="text-xl text-white text-center mt-10">
                {t("bannerItem.title", {
                  banner_title_desc: `${item?.[`title_${i18next.language}`]}`,
                })}
                 
                </p>
              </div>
              <LazyLoadImage
                style={{
                  opacity: "0.5"
                }}
                src={item.banner_img}
                alt={item.title}
                effect={"blur"}
                placeholder={
                  <Spinner
                    color="info"
                    aria-label="Extra large spinner example"
                    size="xl"
                  />
                }
                width={"100%"}
                height={"100%"}
              />
            </div>
          ))
        )}
      </Slider>
    </div>
  );
};
