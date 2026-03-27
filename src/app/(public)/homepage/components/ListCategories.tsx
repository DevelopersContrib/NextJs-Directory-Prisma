"use client";

import Image from "next/image";
import { LinkType } from "@/types/link.type";
import Likes from "./Likes";
import Link from "next/link";
import { FaExternalLinkAlt, FaStar } from "react-icons/fa";
import { capitalizeFirstLetter } from "@/helpers/capitalize-first-letter";

type Props = {
  recents: LinkType[];
};

const ListCategories = ({ recents }: Props) => {
  const safeRecents = Array.isArray(recents) ? recents : [];

  const processTitle = (title: string) => {
    const processedTitle = title.replace(/\.(com|org|net|io|co|app|dev)$/i, "");
    return capitalizeFirstLetter(processedTitle);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
      {safeRecents.length ? (
        safeRecents.map((recent, index) => (
          <article
            key={recent.id || index}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/5 ring-1 ring-transparent transition duration-300 hover:border-zinc-300/90 hover:shadow-md hover:ring-zinc-200/60"
          >
            <div className="relative aspect-[5/4] w-full shrink-0 overflow-hidden bg-zinc-100">
              <Link
                href={`/details/${recent.id}/${recent.title}`}
                className="relative block h-full w-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-zinc-900"
              >
                <Image
                  src={recent.screenshot ?? ""}
                  width={0}
                  height={0}
                  alt={recent.title || "Listing screenshot"}
                  className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={index < 8}
                />
              </Link>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

              <div className="pointer-events-none absolute left-3 top-3 z-[5] max-w-[calc(100%-4rem)] truncate rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-800 shadow-sm backdrop-blur-md">
                {recent.category?.category_name || "Uncategorized"}
              </div>

              <a
                href={recent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/90 text-zinc-700 shadow-md backdrop-blur-md transition hover:bg-white hover:text-zinc-900"
                aria-label={`Visit ${processTitle(recent.title || "")} (opens in new tab)`}
              >
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>

            <div className="flex flex-1 flex-col gap-4 px-6 py-6 sm:px-7 sm:py-7">
              <div className="flex gap-3">
                {recent.company_logo ? (
                  <Image
                    src={recent.company_logo}
                    width={40}
                    height={40}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-lg border border-zinc-100 bg-white object-contain p-1"
                  />
                ) : null}
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-base font-semibold leading-snug tracking-tight text-zinc-900">
                    <Link
                      href={`/details/${recent.id}/${recent.title}`}
                      className="line-clamp-2 transition hover:text-violet-700"
                    >
                      {processTitle(recent.title || "Untitled")}
                    </Link>
                  </h3>
                </div>
              </div>

              <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600">
                {recent.description || "No description available"}
              </p>

              <div className="min-h-[2.5rem]">
                <Likes id={recent.id} />
              </div>

              <div className="mt-auto flex gap-3 border-t border-zinc-100 pt-5">
                <Link
                  href={`/details/${recent.id}/${recent.title}`}
                  className="flex flex-1 items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Details
                </Link>
                <a
                  href={recent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Visit
                </a>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200/80">
              <FaStar className="text-lg text-amber-500" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">No listings found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
              Try another search or clear filters to see more results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCategories;
