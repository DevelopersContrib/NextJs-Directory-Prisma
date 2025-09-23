import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaSearch, FaRocket, FaStar, FaUsers, FaChartLine } from "react-icons/fa";
import Search from "./components/Search";
import { LinkType } from "@/types/link.type";

type Props = {
  recents: LinkType[];
  categories: LinkType[];
  featured: LinkType[];
  data: any | null | undefined;
  domain: string | null | undefined;
};
import FeaturedSlider from "./components/FeaturedSlider";
import { capitalizeFirstLetter } from "@/helpers/capitalize-first-letter";

const Homepage = ({ categories, recents, featured, data, domain }: Props) => {
  const currentYear = new Date().getFullYear();
  
  // Process domain name to remove extensions and capitalize
  const processedDomain = domain ? domain.replace(/\.(com|org|net|io|co|app|dev)$/i, '') : 'localhost';
  const capitalizedDomain = capitalizeFirstLetter(processedDomain);
  
  // Process title - if it contains the domain, replace it with processed version
  let title = data.title || `Welcome to ${capitalizedDomain}`;
  if (data.title && domain) {
    // Replace domain in title with processed version
    const domainRegex = new RegExp(domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    title = data.title.replace(domainRegex, capitalizedDomain);
  }
  return (
    <>
      {/* Enhanced Flash News Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative z-10">
          <a 
            href="https://adao.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <FaRocket className="animate-bounce text-yellow-300" />
            <span className="font-semibold">Flash News!</span>
            <span className="text-sm opacity-90">
              ADAO token is dropping to your Base chain soon! Get ADAO today while it's on sale!
            </span>
          </a>
        </div>
      </div>

      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container items-center justify-between flex py-6">
          <div className="flex items-center space-x-3">
            <Link href="/" className="group">
              {data.logo && domain ? (
                <Image
                  src={data.logo}
                  width={0}
                  height={0}
                  alt={data.title}
                  className="w-[280px] h-[80px] object-contain transition-transform group-hover:scale-105"
                  sizes="100vw"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {domain && capitalizeFirstLetter(domain)}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Powered by <a href="https://ventureos.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">VENTUREOS</a>
                    </p>
                  </div>
                </div>
              )}
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Button asChild variant="ghost" size="lg" className="hover:bg-gray-100 rounded-full">
              <Link href="#search" className="flex items-center space-x-2">
                <FaSearch className="text-lg text-gray-600" />
                <span className="hidden md:block">Search</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-2 hover:border-blue-500 hover:text-blue-600 transition-all">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-wrap">
        {/* Enhanced Hero Section */}
        <div className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20">
          <div className="container text-center">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-8">
                <FaStar className="text-yellow-500" />
                <span className="text-sm font-medium">Discover Amazing Apps and Sites</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
                {data.description || "DirectoryGraph is a comprehensive directory for discovering tools, frameworks, and SaaS platforms tailored to graph visualization and network mapping."}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                  <Link href="/auth/register">
                    Add your site to &nbsp;<span className="capitalize">{domain}</span>&nbsp; today
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition-all">
                  <Link href="#search">Explore Tools</Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-center space-x-12 mt-16 pt-16 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Tools Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                  <div className="text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                  <div className="text-gray-600">Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Featured Section */}
        <div className="w-full py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Tools</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the most popular and innovative tools in our directory
              </p>
            </div>
            <FeaturedSlider featured={featured} />
          </div>
        </div>

        {/* Search Section */}
        <div className="w-full py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <Search categories={categories} defaultrecents={recents} />
        </div>

        {/* Enhanced Footer */}
        <footer className="w-full bg-gray-900 text-white py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{domain && capitalizeFirstLetter(domain)}</h3>
                    <p className="text-sm text-gray-400">Graph, Sheets & SaaS Tools</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your comprehensive directory for discovering the best tools, frameworks, and SaaS solutions.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Categories</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Technology</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Finance</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Development</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Connect</h4>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                    <FaUsers className="text-white" />
                  </div>
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer">
                    <FaStar className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400">
                &copy; {currentYear} {domain && capitalizeFirstLetter(domain)}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Homepage;
