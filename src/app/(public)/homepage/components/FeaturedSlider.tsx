"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

import { LinkType } from "@/types/link.type";
import Link from "next/link";
import { FaStar, FaExternalLinkAlt } from "react-icons/fa";

type Props = {
  featured: LinkType[];
};

const FeaturedSlider = ({ featured }: Props) => {
  return (
    <>
      <Swiper
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
        spaceBetween={30}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Pagination, Autoplay]}
        className="featured-slider !pb-16"
      >
        {featured.length ? (
          featured.map((feature, index) => (
            <SwiperSlide key={feature.id || index}>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <Link href={`/details/${feature.id}/${feature.title}`}>
                    <Image
                      src={feature.screenshot ?? ""}
                      width={0}
                      height={0}
                      alt={feature.description || feature.title}
                      className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </Link>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center space-x-1">
                      <FaStar className="text-yellow-300" />
                      <span>Featured</span>
                    </div>
                  </div>
                  
                  {/* External Link Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                      <FaExternalLinkAlt className="text-gray-600 text-sm" />
                    </div>
                  </div>
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    <Link href={`/details/${feature.id}/${feature.title}`} className="hover:underline">
                      {feature.title}
                    </Link>
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {feature.description || "No description available"}
                  </p>
                  
                  {/* Category */}
                  <div className="mb-4">
                    <div className="inline-flex py-2 px-3 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {feature.category?.category_name || "Uncategorized"}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link 
                      href={`/details/${feature.id}/${feature.title}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </Link>
                    
                    <Link 
                      href={feature.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      Visit
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaStar className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Featured Tools</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're currently curating amazing tools to feature. Check back soon!
            </p>
          </div>
        )}
      </Swiper>
      
      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .featured-slider .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        
        .featured-slider .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 1;
          transform: scale(1.2);
        }
        
        .featured-slider .swiper-pagination {
          bottom: 0;
        }
      `}</style>
    </>
  );
};

export default FeaturedSlider;
