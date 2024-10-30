import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Spinner } from "flowbite-react";
import { Fade } from "react-awesome-reveal";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";

import { LeftChevron, RigthChevron } from "../../assets/icons";

// Statik rasmlar import qilish
import banner1 from '../../assets/images/image2.png';
import banner2 from '../../assets/images/image9.png';
import banner3 from '../../assets/images/image7.png';
import banner4 from '../../assets/images/image5.png';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        background: "#EEAD0F",
        width: "40px",
        height: "40px",
        padding: "5px",
        borderRadius: "10px",
        boxSizing: "border-box",
      }}
      onClick={onClick}
    >
      <RigthChevron />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        background: "#EEAD0F",
        width: "40px",
        height: "40px",
        padding: "5px",
        borderRadius: "10px",
        boxSizing: "border-box",
      }}
      onClick={onClick}
    >
      <LeftChevron />
    </div>
  );
}

const settings = {
  infinite: true,
  slidesToShow: 4,
  speed: 500,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export const Products = ({ id }) => {
  const { t } = useTranslation();

  // Statik ma'lumotlar
  const products = [
    { _id: "1", image: banner1, name: "Product 1" },
    { _id: "2", image: banner2, name: "Product 2" },
    { _id: "3", image: banner3, name: "Product 3" },
    { _id: "4", image: banner4, name: "Product 4" },
  ];

  return (
    <div className="bg-[#F0F0F0] py-10 mb-20" id={id}>
      <div className="container mx-auto w-[90%] mb-10 ">
        <h1 className="text-secondary_color text-4xl font-bold mb-10 text-center">
          {t("Header.OurProducts")}
        </h1>

        <Slider {...settings}>
          {products.map((item) => (
            <Fade key={item._id} className="px-3 ">
              <LazyLoadImage
                key={item._id}
                src={item.image}
                alt={item.name}
                effect={"opacity"}
                className="w-full h-full object-fill img-lazy rounded mb-4 px-5"
                width={"100%"}
                height={"100%"}
              />
            </Fade>
          ))}
        </Slider>
      </div>
    </div>
  );
};
