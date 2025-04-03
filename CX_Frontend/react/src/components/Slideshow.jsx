import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

// Import images
import img1 from "../assets/lp1.png";
import img2 from "../assets/lp2.png";
import img3 from "../assets/lp3.png";
import img4 from "../assets/lp4.png";

const Slideshow = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      className="rounded-xl shadow-lg"
    >
      <SwiperSlide>
        <img src={img1} alt="Slide 1" className="w-full rounded-xl" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={img2} alt="Slide 2" className="w-full rounded-xl" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={img3} alt="Slide 3" className="w-full rounded-xl" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={img4} alt="Slide 4" className="w-full rounded-xl" />
      </SwiperSlide>
    </Swiper>
  );
};

export default Slideshow;
