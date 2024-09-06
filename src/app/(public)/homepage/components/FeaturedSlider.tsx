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

import LinkType from "@/types/link.type";

type Props = {
  featured: LinkType[];
};

const FeaturedSlider = ({featured}: Props) => {
  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        loop={true}
        centeredSlides={true}
        modules={[Pagination]}
        className="mySwiper main-featured-slider !mb-14"
      >
        {featured.length ? (
          featured.map((feature, index) => (
            <SwiperSlide key={index}>
              <div className="w-full flex flex-col space-y-4">
                <div>
                  <Image
                    src={feature.screenshot}
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
                      {feature.title}
                    </a>
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <h3 className="subheading px-5">There are no recent posts</h3>
        )}
        
      </Swiper>
    </>
  );
};

export default FeaturedSlider;
