"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";

import { LinkType } from "@/types/link.type";
import { FaStar, FaExternalLinkAlt } from "react-icons/fa";
import { capitalizeFirstLetter } from "@/helpers/capitalize-first-letter";

type Props = {
  featured: LinkType[];
};

const FeaturedSlider = ({ featured }: Props) => {
  const processTitle = (title: string) => {
    const processedTitle = title.replace(/\.(com|org|net|io|co|app|dev)$/i, "");
    return capitalizeFirstLetter(processedTitle);
  };

  if (!featured.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 py-16 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/80">
          <FaStar className="text-xl text-amber-500" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">No featured listings yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
          We&apos;re curating picks for this directory. Check back soon or submit your tool.
        </p>
      </div>
    );
  }

  const enableLoop = featured.length > 6;

  return (
    <>
      <div className="featured-slider-wrap relative">
        <Swiper
          slidesPerView={1.08}
          spaceBetween={16}
          breakpoints={{
            480: { slidesPerView: 1.2, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation
          autoplay={{
            delay: 4200,
            disableOnInteraction: false,
          }}
          loop={enableLoop}
          rewind={!enableLoop}
          grabCursor
          modules={[Pagination, Autoplay, Navigation]}
          className="featured-slider !pb-14 md:!pb-16"
        >
          {featured.map((feature, index) => (
            <SwiperSlide key={feature.id || index} className="!h-auto">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/5 ring-1 ring-transparent transition duration-300 hover:border-zinc-300/90 hover:shadow-md hover:ring-zinc-200/60">
                <div className="relative aspect-[5/4] w-full shrink-0 overflow-hidden bg-zinc-100">
                  <Link
                    href={`/details/${feature.id}/${feature.title}`}
                    className="relative block h-full w-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-zinc-900"
                  >
                    <Image
                      src={feature.screenshot ?? ""}
                      width={0}
                      height={0}
                      alt={feature.description || feature.title}
                      className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 22vw"
                      priority={index < 4}
                    />
                  </Link>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute left-3 top-3 z-[5] flex items-center gap-1.5 rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-800 shadow-sm backdrop-blur-md">
                    <FaStar className="text-amber-500" aria-hidden />
                    Featured
                  </div>

                  <a
                    href={feature.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/90 text-zinc-700 shadow-md backdrop-blur-md transition hover:bg-white hover:text-zinc-900"
                    aria-label={`Visit ${processTitle(feature.title)} (opens in new tab)`}
                  >
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>

                <div className="flex flex-1 flex-col gap-5 px-6 py-6 sm:px-7 sm:py-7">
                  <div className="flex gap-3">
                    {feature.company_logo ? (
                      <Image
                        src={feature.company_logo}
                        width={40}
                        height={40}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg border border-zinc-100 bg-white object-contain p-1"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3 className="text-base font-semibold leading-snug tracking-tight text-zinc-900">
                        <Link
                          href={`/details/${feature.id}/${feature.title}`}
                          className="line-clamp-2 transition hover:text-violet-700"
                        >
                          {processTitle(feature.title)}
                        </Link>
                      </h3>
                    </div>
                  </div>

                  <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-600">
                    {feature.description || "No description available"}
                  </p>

                  <div>
                    <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                      {feature.category?.category_name || "Uncategorized"}
                    </span>
                  </div>

                  <div className="mt-auto flex gap-3 border-t border-zinc-100 pt-5">
                    <Link
                      href={`/details/${feature.id}/${feature.title}`}
                      className="flex flex-1 items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                      Details
                    </Link>
                    <a
                      href={feature.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      Visit
                    </a>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .featured-slider-wrap {
              margin: 0 -0.25rem;
              padding: 0 0.25rem;
            }
            @media (min-width: 640px) {
              .featured-slider-wrap {
                margin: 0;
                padding: 0 2.75rem;
              }
            }
            .featured-slider .swiper-pagination-bullet {
              width: 8px;
              height: 8px;
              background: rgb(161 161 170);
              opacity: 0.45;
              transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease;
            }
            .featured-slider .swiper-pagination-bullet-active {
              opacity: 1;
              background: rgb(24 24 27);
              transform: scale(1.15);
            }
            .featured-slider .swiper-pagination {
              bottom: 0;
            }
            .featured-slider .swiper-button-prev,
            .featured-slider .swiper-button-next {
              width: 2.5rem;
              height: 2.5rem;
              margin-top: 0;
              top: 42%;
              border-radius: 9999px;
              background: white;
              border: 1px solid rgb(228 228 231);
              color: rgb(24 24 27);
              box-shadow: 0 4px 14px -4px rgb(0 0 0 / 0.12);
              transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .featured-slider .swiper-button-prev:hover,
            .featured-slider .swiper-button-next:hover {
              background: rgb(250 250 250);
              border-color: rgb(212 212 216);
              box-shadow: 0 6px 20px -6px rgb(0 0 0 / 0.15);
            }
            .featured-slider .swiper-button-prev:after,
            .featured-slider .swiper-button-next:after {
              font-size: 0.65rem;
              font-weight: 700;
            }
            .featured-slider .swiper-button-disabled {
              opacity: 0.35;
              pointer-events: none;
            }
            @media (max-width: 639px) {
              .featured-slider .swiper-button-prev,
              .featured-slider .swiper-button-next {
                display: none;
              }
            }
          `,
        }}
      />
    </>
  );
};

export default FeaturedSlider;
