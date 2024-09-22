"use client";
import { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { LinkType } from "@/types/link.type";
import ListCategories from "../components/ListCategories";

type Props = {
  defaultrecents: LinkType[];
  categories: LinkType[];
};

const Search = ({ categories, defaultrecents }: Props) => {
  const [search, setSearch] = useState("");
  const [recents, setRecents] = useState<LinkType[]>(defaultrecents);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number[]>([]);

  const handleClick = (index: number): void => {
    const updatedActiveCategory = activeCategory.includes(index)
      ? activeCategory.filter((button) => button !== index)
      : [...activeCategory, index];

    setActiveCategory(updatedActiveCategory);
    handleSearch(updatedActiveCategory.join());
  };

  const resetActiveCategory = (): void => {
    setActiveCategory([]);
    handleSearch("");
  };

  const handleSearch = async (category: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/link/search", {
        search,
        category,
      });
      setRecents(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mb-4 flex flex-col">
        <div className="mb-4 flex">
          <div className="flex border rounded-xl border-[#ddd] text-base w-full lg:w-[50%] lg:mx-auto">
            <input
              type="search"
              className="bg-transparent h-[50px] lg:mx-auto w-full px-4 py-1 focus:outline-none focus:ring-0 focus:border-none"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch(activeCategory.join())
              }
            />
            <span
              onClick={() => handleSearch(activeCategory.join())}
              className="flex items-center justify-center px-4 text-[#777]"
            >
              {loading ? (
                <CgSpinner className="animate-spin  w-8 h-8" />
              ) : (
                <FaSearch />
              )}
            </span>
          </div>
        </div>
        <ul className="flex w-full flex-wrap mb-4 justify-center">
          <li className="bg-[#e9ecef] text-[#444] rounded-sm text-sm inline-flex flex-col mr-1 mb-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                resetActiveCategory();
              }}
              className="capitalize block font-light px-3 py-2"
            >
              all
            </button>
          </li>
          {categories.map((cat, index) => (
            <li
              key={index}
              className="bg-[#e9ecef] text-[#444] rounded-sm text-sm inline-flex flex-col mr-1 mb-1"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(parseInt(cat.categoryId));
                }}
                className={
                  activeCategory.includes(parseInt(cat.categoryId))
                    ? " capitalize block font-light px-3 py-2 btn-primary rounded"
                    : "capitalize block font-light px-3 py-2"
                }
              >
                {cat.category.category_name}
              </button>
            </li>
          ))}
        </ul>
        {loading ? (
          <div className="flex justify-center items-center">
            <CgSpinner className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <ListCategories recents={recents} />
        )}
      </div>
    </>
  );
};

export default Search;
