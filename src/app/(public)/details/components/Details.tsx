"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaSearch, FaHeart, FaThumbsDown, FaShare, FaCopy, FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaBookmark, FaEye } from "react-icons/fa";
import { capitalizeFirstLetter } from "@/helpers/capitalize-first-letter";
import FeaturedSlider from "../../homepage/components/FeaturedSlider";
import { LinkType } from "@/types/link.type";
import { likeAction, countLikesAction } from "@/actions/like.action";
import { unlikeAction, countUnlikesAction } from "@/actions/unlike.action";
import { historyAction } from "@/actions/history.action";
import { toast } from "sonner";


type Props = {
  link: LinkType;
  featured: LinkType[];
  countLikes: any;
  countDislikes: any;
  data: any | null | undefined;
  domain: string | null | undefined;
};

const Details = ({
  link,
  featured,
  countLikes,
  countDislikes,
  data,
  domain,
}: Props) => {

  const [likes, setLikes] = useState<number>(countLikes || 0);
  const [unlikes, setUnlikes] = useState<number>(countDislikes || 0);
  const [isMutation, setIsMutation] = useState<boolean>(false);
  const [isUnlikeMutation, setUnlikeMutation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [likesRes, unlikesRes] = await Promise.all([
          countLikesAction(link.id, '/'),
          countUnlikesAction(link.id, '/')
        ]);
        
        if (likesRes.data !== null) {
          setLikes(likesRes.data);
        }
        if (unlikesRes.data !== null) {
          setUnlikes(unlikesRes.data);
        }
      } catch (error) {
        console.error('Error fetching likes/unlikes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [link.id]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.share-menu-container')) {
          setShowShareMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

    const clientAction = async () => {
        if (isMutation) return null;
        setIsMutation(true);

        try {
            const res = await likeAction({
                LinkId: link.id,
                userId: '8c903015-2300-4dad-b4bd-db1ed4b43508',
                path: '/',
            });
            if (res.message === "Like created successfully") {
                setLikes(likes + 1);
                setIsLiked(true);
                setIsDisliked(false);
                toast.success("Thanks for your feedback! ❤️");
            }
        } catch (error) {
            console.info("[ERROR_CLIENT_ACTION]", error);
            toast.error("Something went wrong");
        } finally {
            setIsMutation(false);
        }
    };

    const clientUnlikeAction = async () => {
        if (isUnlikeMutation) return null;
        setUnlikeMutation(true);

        try {
            const res = await unlikeAction({
                LinkId: link.id,
                userId: '8c903015-2300-4dad-b4bd-db1ed4b43508',
                path: '/',
            });
            if (res.message === "Unlike created successfully") {
                setUnlikes(unlikes + 1);
                setIsDisliked(true);
                setIsLiked(false);
                toast.success("Thanks for your feedback! 👍");
            }
        } catch (error) {
            console.info("[ERROR_CLIENT_ACTION]", error);
            toast.error("Something went wrong");
        } finally {
            setUnlikeMutation(false);
        }
    };

    // Share functionality
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = `${capitalizeFirstLetter(link.title?.replace(/\.(com|org|net|io|co|app|dev)$/i, '') || 'Tool')} - ${link.title}`;
    const shareText = `Check out ${shareTitle}: ${link.description}`;

    const handleShare = async (platform: string) => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedTitle = encodeURIComponent(shareTitle);
        const encodedText = encodeURIComponent(shareText);

        let shareLink = '';
        
        switch (platform) {
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success("Link copied to clipboard! 📋");
                    return;
                } catch (err) {
                    toast.error("Failed to copy link");
                    return;
                }
        }

        if (shareLink) {
            window.open(shareLink, '_blank', 'width=600,height=400');
        }
        setShowShareMenu(false);
    };

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks! 🔖");
    };

    // Generate structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": capitalizeFirstLetter(link.title?.replace(/\.(com|org|net|io|co|app|dev)$/i, '') || 'Tool'),
        "url": link.url,
        "description": link.description,
        "image": link.screenshot || link.company_logo,
        "logo": link.company_logo,
        "applicationCategory": link.category?.category_name || "WebApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "ratingCount": countLikes + countDislikes || 1
        }
    };

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
      
            <header className="flex w-full ">
        <div className="container items-center justify-between flex py-4">
          <div>
            <Link href="/">
              {data.logo && domain ? (
                <Image
                  src={data.logo}
                  width={0}
                  height={0}
                  alt={domain}
                  className="w-[200px] h-[34px] object-contain"
                  sizes="100vw"
                />
              ) : (
                <h3 className="font-bold text-xl">
                  {domain && capitalizeFirstLetter(domain)}
                </h3>
              )}
            </Link>
          </div>
          <div className="flex space-x-4">
            <Button asChild variant={"link"}>
              <Link href="#">
                <FaSearch className="text-xl" />
              </Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex w-full flex-wrap">
        {/* Two Column Layout */}
        <div className="container pt-14 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column - Preview */}
            <div className="order-2 lg:order-1">
              <div className="sticky top-8">
                <div className="relative group">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full group"
                    aria-label={`View ${link.title} screenshot`}
                  >
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-gray-100 to-gray-200 p-4">
                      <div className="relative overflow-hidden rounded-2xl bg-white shadow-inner">
                        <Image
                          src={link.screenshot ?? ""}
                          alt={`${link.title} website screenshot`}
                          width={800}
                          height={600}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Elegant overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <div className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-gray-800 font-semibold text-lg">Visit Website</span>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Browser-like frame */}
                      <div className="absolute top-4 left-4 right-4 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Details & Actions */}
            <div className="order-1 lg:order-2">
              <article className="space-y-10">
                {/* Logo/Title Section */}
                <div className="text-center lg:text-left">
                  {link.company_logo ? (
                    <div className="mb-8">
                      <a href={link.url} className="inline-block group" aria-label={`Visit ${link.title} website`}>
                        <div className="bg-white rounded-3xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                          <Image
                            src={link.company_logo ?? ""}
                            alt={`${link.title} logo`}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="h-24 w-auto object-contain mx-auto lg:mx-0"
                          />
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <h1 className="text-5xl lg:text-6xl mb-6 font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                          {capitalizeFirstLetter(link.title?.replace(/\.(com|org|net|io|co|app|dev)$/i, '') || 'Tool')}
                        </a>
                      </h1>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 shadow-lg">
                    <p className="text-xl font-normal text-gray-700 leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <span className="w-4 h-4 bg-white rounded-full mr-4 animate-pulse"></span>
                    {link.category?.category_name || 'Uncategorized'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-6">
                  {/* Primary Action - Visit Website */}
                  <div className="flex justify-center lg:justify-start">
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center py-5 px-10 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                      aria-label={`Visit ${link.title} website`}
                    >
                      <FaEye className="mr-4 text-2xl" />
                      Visit Website
                      <div className="ml-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </Link>
                  </div>

                  {/* Interactive Buttons Grid */}
                  <div className="bg-white rounded-3xl p-6 shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Engage with this tool</h3>
                    <div className="grid grid-cols-2 gap-4">
                    {/* Like Button */}
                    <Button 
                      variant="outline" 
                      size="lg"
                      className={`group flex items-center justify-center py-4 px-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        isLiked 
                          ? 'bg-red-50 border-red-300 text-red-600 shadow-lg' 
                          : 'hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                      }`}
                      onClick={clientAction} 
                      disabled={isMutation}
                      aria-label={`Like ${link.title}`}
                    >
                      <FaHeart className={`mr-3 text-2xl transition-all duration-300 ${
                        isLiked ? 'text-red-500 animate-pulse' : 'group-hover:text-red-500'
                      }`} />
                      <span className="text-lg font-semibold">{likes}</span>
                    </Button>

                    {/* Dislike Button */}
                    <Button 
                      variant="outline" 
                      size="lg"
                      className={`group flex items-center justify-center py-4 px-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        isDisliked 
                          ? 'bg-gray-50 border-gray-300 text-gray-600 shadow-lg' 
                          : 'hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600'
                      }`}
                      onClick={clientUnlikeAction}
                      disabled={isUnlikeMutation}
                      aria-label={`Dislike ${link.title}`}
                    >
                      <FaThumbsDown className={`mr-3 text-2xl transition-all duration-300 ${
                        isDisliked ? 'text-gray-500' : 'group-hover:text-gray-500'
                      }`} />
                      <span className="text-lg font-semibold">{unlikes}</span>
                    </Button>

                    {/* Bookmark Button */}
                    <Button 
                      variant="outline" 
                      size="lg"
                      className={`group flex items-center justify-center py-4 px-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        isBookmarked 
                          ? 'bg-yellow-50 border-yellow-300 text-yellow-600 shadow-lg' 
                          : 'hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600'
                      }`}
                      onClick={toggleBookmark}
                      aria-label={`Bookmark ${link.title}`}
                    >
                      <FaBookmark className={`mr-3 text-2xl transition-all duration-300 ${
                        isBookmarked ? 'text-yellow-500' : 'group-hover:text-yellow-500'
                      }`} />
                      <span className="text-lg font-semibold">Save</span>
                    </Button>

                    {/* Share Button */}
                    <div className="relative share-menu-container">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="group flex items-center justify-center py-4 px-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 w-full"
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        aria-label={`Share ${link.title}`}
                      >
                        <FaShare className="mr-3 text-2xl group-hover:text-blue-500" />
                        <span className="text-lg font-semibold">Share</span>
                      </Button>

                      {/* Share Menu Dropdown */}
                      {showShareMenu && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => handleShare('twitter')}
                              className="flex items-center justify-center py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                            >
                              <FaTwitter className="mr-2" />
                              Twitter
                            </button>
                            <button
                              onClick={() => handleShare('facebook')}
                              className="flex items-center justify-center py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                            >
                              <FaFacebook className="mr-2" />
                              Facebook
                            </button>
                            <button
                              onClick={() => handleShare('linkedin')}
                              className="flex items-center justify-center py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                            >
                              <FaLinkedin className="mr-2" />
                              LinkedIn
                            </button>
                            <button
                              onClick={() => handleShare('whatsapp')}
                              className="flex items-center justify-center py-3 px-4 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                            >
                              <FaWhatsapp className="mr-2" />
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleShare('copy')}
                              className="col-span-2 flex items-center justify-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <FaCopy className="mr-2" />
                              Copy Link
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        {/* Rolling Sites Section */}
        <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-100 py-20 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
          </div>
          
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Discover More Amazing Tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore our curated collection of trending and popular tools that are making waves in the industry
              </p>
            </div>
            
            {/* Rolling Sites Carousel */}
            <div className="relative">
              <div className="flex animate-scroll space-x-6">
                {/* Duplicate the featured items for seamless scrolling */}
                {[...featured, ...featured, ...featured].map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex-shrink-0 group">
                    <div className="w-72 h-48 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 overflow-hidden border border-gray-200 relative">
                      <Link href={`/details/${item.id}/${item.title}`} className="block h-full">
                        <div className="relative h-full">
                          <Image
                            src={item.screenshot ?? ""}
                            alt={item.title}
                            width={288}
                            height={192}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Elegant overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Content overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 shadow-lg">
                              <h3 className="font-bold text-gray-800 text-lg truncate mb-2">
                                {capitalizeFirstLetter(item.title?.replace(/\.(com|org|net|io|co|app|dev)$/i, '') || 'Tool')}
                              </h3>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">
                                  {item.category?.category_name || 'Uncategorized'}
                                </p>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Floating badge */}
                          <div className="absolute top-4 right-4">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              Featured
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Enhanced gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-purple-100 via-purple-100/80 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Custom CSS for rolling animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `
      }} />
      
      <footer className="py-8 w-full border-t border-[#ddd]">
        <div className="container flex justify-between text-sm text-[#777]">
          <div>
            &copy; 2024 {capitalizeFirstLetter("generalpoll.com")}. All rights
            reserved.
          </div>
          <div className="flex lg:justify-end">
            <ul className="flex space-x-2">
              <li>
                <a href="/about" className="inline-flex">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="inline-flex">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/terms" className="inline-flex">
                  Terms
                </a>
              </li>
              <li>
                <a href="/privacy" className="inline-flex">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Details;
