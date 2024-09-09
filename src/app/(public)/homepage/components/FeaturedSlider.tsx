"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const FeaturedSlider = () => {
  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Pagination]}
        className="mySwiper main-featured-slider !mb-14"
      >
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <SwiperSlide key={index}>
              <div className="w-full flex flex-col space-y-4">
                <div>
                  <Image
                    src={"https://cdn.vnoc.com/background/contrib/task.jpg"}
                    width={0}
                    height={0}
                    alt=""
                    className="w-full h-full object-contain shadow-[rgb(23_43_99/24%)_0_3px_8px]"
                    sizes="100vw"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#333] text-xl mb-0">
                    <a href="#" className="inline-flex">
                      Domain Name {index + 1}
                    </a>
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
};

export default FeaturedSlider;
