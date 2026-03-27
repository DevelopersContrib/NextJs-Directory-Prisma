"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaFilter } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { LinkType } from "@/types/link.type";
import ListCategories from "../components/ListCategories";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  defaultrecents: LinkType[];
  categories: LinkType[];
};

const Search = ({ categories, defaultrecents }: Props) => {
  const [search, setSearch] = useState("");
  const [recents, setRecents] = useState<LinkType[]>(defaultrecents);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number[]>([]);

  const [total, setTotal] = useState(defaultrecents.length);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const handleClick = (index: number): void => {
    const updatedActiveCategory = activeCategory.includes(index)
      ? activeCategory.filter((button) => button !== index)
      : [...activeCategory, index];

    setActiveCategory(updatedActiveCategory);
    handleSearch(updatedActiveCategory.join(), 1);
  };

  const pageClick = (index: number): void => {
    setPage(index);
    handleSearch(activeCategory.join(), index);
  };

  const resetActiveCategory = (): void => {
    setActiveCategory([]);
    handleSearch("", 1);
  };

  const handleSearch = async (category: string, p: number) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/link/search", {
        page: p,
        search,
        category,
      });
      const items = data.items as LinkType[];
      setRecents(items);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePrevious = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (page > 1) setPage(page - 1);
  };

  const handleNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (page < totalPages) setPage(page + 1);
  };

  useEffect(() => {
    handleSearch(activeCategory.join(), page);
  }, [page]);

  return (
    <section
      id="search"
      className="scroll-mt-[5.5rem] md:scroll-mt-24"
      aria-labelledby="directory-search-heading"
    >
      <div className="container">
        <div className="mx-auto mb-12 max-w-5xl text-center xl:mb-14 xl:max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Search &amp; filter
          </p>
          <h2
            id="directory-search-heading"
            className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl"
          >
            Browse the directory
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-zinc-600 md:text-lg">
            Find tools and listings by keyword, or narrow results with categories.
          </p>
        </div>

        <div className="mb-12 flex justify-center px-1">
          <div className="relative w-full max-w-3xl">
            <label htmlFor="directory-search-query" className="sr-only">
              Search directory
            </label>
            <div className="relative flex items-center">
              <input
                id="directory-search-query"
                type="search"
                className="h-14 w-full rounded-2xl border border-zinc-200/90 bg-white py-3 pl-5 pr-[3.75rem] text-base text-zinc-900 shadow-sm shadow-zinc-900/5 outline-none ring-zinc-900/10 transition placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-4 sm:h-16 sm:pl-6 sm:text-lg"
                placeholder="Search tools, frameworks, products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(activeCategory.join(), 1)
                }
              />
              <button
                type="button"
                onClick={() => handleSearch(activeCategory.join(), 1)}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-zinc-900 text-white transition-colors hover:bg-zinc-800 sm:right-2.5 sm:h-11 sm:w-11"
                aria-label="Run search"
              >
                {loading ? (
                  <CgSpinner className="h-5 w-5 shrink-0 animate-spin text-white" />
                ) : (
                  <FaSearch className="h-4 w-4 shrink-0 text-white sm:h-[1.125rem] sm:w-[1.125rem]" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="mb-5 flex items-center justify-center gap-2 text-zinc-700">
            <FaFilter className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
              Categories
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                resetActiveCategory();
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                activeCategory.length === 0
                  ? "bg-zinc-900 text-white shadow-sm shadow-zinc-900/25"
                  : "border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              All
            </button>

            {categories.map((cat, index) => (
              <button
                type="button"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(parseInt(cat.categoryId));
                }}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  activeCategory.includes(parseInt(cat.categoryId))
                    ? "bg-zinc-900 text-white shadow-sm shadow-zinc-900/25"
                    : "border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {cat.category.category_name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <CgSpinner
              className="mb-4 h-10 w-10 shrink-0 animate-spin text-zinc-500"
              aria-hidden
            />
            <p className="text-sm font-medium text-zinc-600 sm:text-base">
              Loading results…
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="text-sm text-zinc-600 sm:text-base">
                <span className="font-semibold tabular-nums text-zinc-900">
                  {total}
                </span>{" "}
                {total === 1 ? "listing" : "listings"} found
              </p>
            </div>

            <ListCategories recents={recents} />

            {totalPages > 1 && (
              <div className="mb-8 mt-14 flex justify-center">
                <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-3 shadow-sm shadow-zinc-900/5 backdrop-blur-sm sm:p-4">
                  <Pagination>
                    <PaginationContent className="gap-1 sm:gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={handlePrevious}
                          isActive={page === 1}
                          href="#"
                          className="rounded-xl border border-transparent px-3 py-2 hover:bg-zinc-100 sm:px-4"
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              pageClick(i + 1);
                            }}
                            isActive={page === i + 1}
                            className={`rounded-xl px-3 py-2 transition-colors sm:px-4 ${
                              page === i + 1
                                ? "bg-zinc-900 text-white shadow-sm"
                                : "hover:bg-zinc-100"
                            }`}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={handleNext}
                          isActive={page === totalPages}
                          href="#"
                          className="rounded-xl border border-transparent px-3 py-2 hover:bg-zinc-100 sm:px-4"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Search;
