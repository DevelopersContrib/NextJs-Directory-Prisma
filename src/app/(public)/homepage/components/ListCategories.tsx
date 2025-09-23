"use client";

import { Button } from "@/components/ui/button";
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
  // Ensure recents is always an array to prevent hydration issues
  const safeRecents = Array.isArray(recents) ? recents : [];
  
  // Function to process domain titles
  const processTitle = (title: string) => {
    // Remove domain extensions and capitalize
    const processedTitle = title.replace(/\.(com|org|net|io|co|app|dev)$/i, '');
    return capitalizeFirstLetter(processedTitle);
  };
  
  return (
    <>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {safeRecents.length ? (
            safeRecents.map((recent, index) => (
              <div key={recent.id || index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <Link href={`/details/${recent.id}/${recent.title}`}>
                    <Image
                      src={recent.screenshot ?? ""}
                      width={0}
                      height={0}
                      alt={recent.title || "Image"}
                      className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </Link>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      {recent.category?.category_name || "Uncategorized"}
                    </div>
                  </div>
                  
                  {/* External Link Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                      <FaExternalLinkAlt className="text-gray-600 text-sm" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    <Link href={`/details/${recent.id}/${recent.title}`} className="hover:underline">
                      {processTitle(recent.title || "Untitled")}
                    </Link>
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {recent.description || "No description available"}
                  </p>
                  
                  {/* Likes Section */}
                  <div className="mb-6">
                    <Likes id={recent.id} />
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex space-x-3">
                    <Button 
                      asChild 
                      size="lg" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Link href={`/details/${recent.id}/${recent.title}`}>
                        View Details
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg" 
                      className="px-4 border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-300"
                    >
                      <Link href={recent.url} target="_blank" rel="noopener noreferrer">
                        Visit Site
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaStar className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No Tools Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any tools matching your criteria. Try adjusting your search or browse all categories.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListCategories;
