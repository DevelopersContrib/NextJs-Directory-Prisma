"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import LinkType from "@/types/link.type";
import ListCategories from "../components/ListCategories";
type Props = {
  defaultrecents: LinkType[];
  categories: LinkType[];
};

const Search = ({ categories, defaultrecents}: Props) => {
    const [search, setSearch] = useState('');
    const [recents, setRecents] = useState<LinkType[]>(defaultrecents);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post('/api/link/search', {
            search: search,
        });
        setRecents(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
        <>
      
        <div className="container mb-4 flex flex-col">
          <div className="mb-4 flex">
            {/* <div className="flex border rounded-xl border-[#ddd] text-base w-full lg:w-[50%] lg:mx-auto"> */}
              <div className="flex border rounded-xl border-[#ddd] text-base w-full lg:w-[50%] lg:mx-auto">
              <input
                  type="search"
                  className="bg-transparent h-[50px] lg:mx-auto w-full px-4 py-1 focus:outline-none focus:ring-0 focus:border-none"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    // handleSearch() 
                  }}
                  onKeyDown={e => e.key === 'Enter' ? handleSearch() : ''}
              />
              <span onClick={handleSearch} className="flex items-center justify-center px-4 text-[#777]">
                  <FaSearch />
              </span>
            </div>
          </div>
          <ul className="flex w-full flex-wrap mb-4 justify-center">
            <li className="bg-[#e9ecef] text-[#444] rounded-sm text-sm inline-flex flex-col mr-1 mb-1">
              <a href="#" className="capitalize block font-light px-3 py-2">
                all
              </a>
            </li>
            {categories.map(cat => {
                return <li
                  key={cat.id}
                  className="bg-[#e9ecef] text-[#444] rounded-sm text-sm inline-flex flex-col mr-1 mb-1"
                  >
                    <a href="#" className="capitalize block font-light px-3 py-2">
                      {cat.category.category_name}
                    </a>
                  </li>
              })}
          </ul>
        </div>
        {/* Start:: Categories Section */}
        {loading?'Loading...':<ListCategories recents={recents} />}
        
        {/* End:: Categories Section */}
        </>
    );
  }

  export default Search;
