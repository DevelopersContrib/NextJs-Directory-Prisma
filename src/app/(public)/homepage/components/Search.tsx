"use client";
import { useEffect, useState } from 'react';
import axios from "axios";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { LinkType } from "@/types/link.type";
import ListCategories from "../components/ListCategories";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
    handleSearch(updatedActiveCategory.join(),1);
  };

  const pageClick = (index: number): void => {
    setPage(index);
    handleSearch(activeCategory.join(),index);
  };

  const resetActiveCategory = (): void => {
    setActiveCategory([]);
    handleSearch("",1);
  };

  const handleSearch = async (category: string, p:number) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/link/search", {
        page:p,
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
    handleSearch(activeCategory.join(),page);
  }, [page]);

  return (
    <>
      <div className="container">
        {/* Enhanced Search Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Tools</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search through our comprehensive collection of tools, frameworks, and SaaS solutions
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="relative">
              <input
                id="search"
                type="search"
                className="w-full h-16 px-6 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                placeholder="Search for tools, frameworks, or solutions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(activeCategory.join(),1)
                }
              />
              <button
                onClick={() => handleSearch(activeCategory.join(),1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <CgSpinner className="animate-spin w-5 h-5" />
                ) : (
                  <FaSearch className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Category Filters */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <FaFilter className="text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Filter by Category</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                resetActiveCategory();
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory.length === 0
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              All Categories
            </button>
            
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(parseInt(cat.categoryId));
                }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory.includes(parseInt(cat.categoryId))
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105"
                }`}
              >
                {cat.category.category_name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <CgSpinner className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Searching for amazing tools...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Found <span className="font-semibold text-blue-600">{total}</span> amazing tools
              </p>
            </div>
            
            <ListCategories recents={recents} />
            
            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <Pagination>
                    <PaginationContent className="gap-2">
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={handlePrevious} 
                          isActive={page === 1} 
                          href="#" 
                          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                              page === i + 1
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                : "hover:bg-gray-100"
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
                          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
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
    </>
  );
};

export default Search;
