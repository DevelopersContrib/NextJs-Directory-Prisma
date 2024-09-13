"use client";
import { useState, useEffect, useCallback } from "react";
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
  const [allResults, setAllResults] = useState<LinkType[]>(defaultrecents); // Cached results
  const [loading, setLoading] = useState(false);

  // Initialize the cache on component mount
  useEffect(() => {
    setAllResults(defaultrecents);
    setRecents(defaultrecents);
  }, [defaultrecents]);

  // Function to perform search
  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      if (!search.trim()) {
        // Show all cached results if the search is empty
        setRecents(allResults);
      } else {
        // Filter search results
        const filteredResults = allResults.filter((item) =>
          [
            item.title,
            item.description,
            item.company_name,
            item.category.category_name,
          ].some((field) =>
            field.toLowerCase().includes(search.trim().toLowerCase())
          )
        );
        setRecents(filteredResults);
      }
    } catch (error) {
      console.error("Error filtering search results:", error);
    } finally {
      setLoading(false);
    }
  }, [search, allResults]);

  // Handle search when Enter key is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  // Handle search when the search input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="container mb-4 flex flex-col">
        <div className="mb-4 flex">
          <div className="flex border rounded-xl border-[#ddd] text-base w-full lg:w-[50%] lg:mx-auto">
            <input
              type="search"
              className="bg-transparent h-[50px] w-full px-4 py-1 focus:outline-none"
              placeholder="Search"
              value={search}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Handle Enter key press
            />
            <span
              onClick={performSearch} // Trigger search on click
              className="flex items-center justify-center px-4 text-[#777] cursor-pointer"
            >
              <FaSearch />
            </span>
          </div>
        </div>
        {/* Categories Filter */}
        <ul className="flex w-full flex-wrap mb-4 justify-center">
          <li className="bg-[#e9ecef] text-[#444] rounded-sm text-sm inline-flex flex-col mr-1 mb-1">
            <button className="capitalize block font-light px-3 py-2">
              all
            </button>
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="bg-[#e9ecef] text-[#444] rounded-sm text-sm inline-flex flex-col mr-1 mb-1"
            >
              <button className="capitalize block font-light px-3 py-2">
                {cat.category.category_name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Show loading spinner or search results */}
      {loading ? (
        <div className="flex items-center justify-center h-48 w-full">
          <CgSpinner className="fa-spin text-4xl" />
        </div>
      ) : (
        <ListCategories recents={recents} />
      )}
    </>
  );
};

export default Search;
