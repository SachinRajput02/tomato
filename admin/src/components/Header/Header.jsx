import React, { useEffect, useState } from "react";
import "./Header.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Desktop images

import desktopImg11 from "../../assets/frontend_assets/header_img8.png";
import desktopImg1 from "../../assets/frontend_assets/header_img.png";
import desktopImg2 from "../../assets/frontend_assets/header_img7.png";
import desktopImg3 from "../../assets/frontend_assets/header_img3.jpg";

// Mobile images
import mobileImg1 from "../../assets/frontend_assets/header_img.png";
import mobileImg2 from "../../assets/frontend_assets/header_img3.jpg";
import mobileImg7 from "../../assets/frontend_assets/header_img7.png";

import mobileImg3 from "../../assets/frontend_assets/header_img8.png";

const Header = ({ shopName }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopSlides = [desktopImg1, desktopImg11, desktopImg2, desktopImg3];
  const mobileSlides = [mobileImg1, mobileImg2, mobileImg3, mobileImg7];
  const slidesToShow = isMobile ? mobileSlides : desktopSlides;

  return (
    <div className="header">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="header-swiper"
      >
        {slidesToShow.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide"
              style={{
                backgroundImage: `url(${img})`,
              }}
            >
              <div className="header-contents">
                <h2>Welcome to {shopName} Dashboard</h2>
                <p>
                  Choose from a diverse menu featuring a delectable array of
                  dishes crafted with the finest ingredients and culinary
                  expertise. Our mission is to satisfy your cravings and
                  elevate your dining experience, one delicious meal at a time.
                </p>
                <a href="#explore-menu">
                  <button>View Menu</button>
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Header;



