import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaSearch,
  FaRocket,
  FaStar,
  FaChartLine,
  FaArrowRight,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";
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
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 shadow-sm shadow-zinc-900/5 backdrop-blur-md">
        <div className="container flex items-center justify-between py-2 md:py-3">
          <div className="flex items-center space-x-3">
            <Link href="/" className="group">
              {data.logo && domain ? (
                <Image
                  src={data.logo}
                  width={0}
                  height={0}
                  alt={data.title}
                  className="h-10 md:h-12 w-auto max-w-[200px] md:max-w-[240px] object-contain object-left transition-transform group-hover:scale-105"
                  sizes="100vw"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <FaChartLine className="text-white text-base" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                      {domain && capitalizeFirstLetter(domain)}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider leading-tight">
                      Powered by <a href="https://ventureos.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">VENTUREOS</a>
                    </p>
                  </div>
                </div>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <Button
              asChild
              variant="ghost"
              className="h-9 rounded-full px-3 text-zinc-700 hover:bg-zinc-100/90 md:px-4"
            >
              <Link href="#search" className="flex items-center gap-2">
                <FaSearch className="h-[1em] w-[1em] shrink-0 text-zinc-500" aria-hidden />
                <span className="hidden md:inline text-sm font-medium">Search</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-full border border-zinc-200 bg-white/90 px-4 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-full bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm shadow-zinc-900/20 transition-colors hover:bg-zinc-800"
            >
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-wrap">
        {/* Hero — layered background, refined type, glass stats */}
        <section className="relative w-full overflow-hidden bg-zinc-50">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-32 top-0 h-[min(520px,70vw)] w-[min(520px,70vw)] rounded-full bg-violet-400/25 blur-3xl" />
            <div className="absolute -right-24 top-24 h-[min(440px,60vw)] w-[min(440px,60vw)] rounded-full bg-sky-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-[min(360px,50vw)] w-[min(360px,50vw)] -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.45]"
              style={{
                backgroundImage: `linear-gradient(to right, rgb(24 24 27 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(24 24 27 / 0.06) 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
                maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
              }}
            />
          </div>

          <div className="container relative px-4 pb-16 pt-14 md:pb-24 md:pt-20">
            <div className="mx-auto w-full max-w-5xl text-center xl:max-w-6xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm shadow-zinc-900/5 backdrop-blur-md">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                  <FaStar className="h-3 w-3" aria-hidden />
                </span>
                <span>Curated apps &amp; sites</span>
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.08]">
                <span className="bg-gradient-to-br from-zinc-950 via-blue-900 to-violet-800 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-relaxed text-zinc-600 md:max-w-4xl md:text-lg">
                {data.description || "DirectoryGraph is a comprehensive directory for discovering tools, frameworks, and SaaS platforms tailored to graph visualization and network mapping."}
              </p>

              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Button
                  asChild
                  className="h-11 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white shadow-lg shadow-zinc-900/15 transition-all hover:bg-zinc-800 sm:h-12 sm:px-8 sm:text-base"
                >
                  <Link href="/auth/register" className="inline-flex items-center justify-center gap-2">
                    List your site on <span className="capitalize">{domain}</span>
                    <FaArrowRight className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-zinc-200 bg-white/80 px-6 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-white sm:h-12 sm:px-8 sm:text-base"
                >
                  <Link href="#search">Browse directory</Link>
                </Button>
              </div>

              <div className="mx-auto mt-14 w-full rounded-2xl border border-zinc-200/60 bg-white/60 p-6 shadow-sm shadow-zinc-900/5 backdrop-blur-md sm:p-8">
                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 sm:divide-x sm:divide-zinc-200/80">
                  <div className="text-center sm:px-4">
                    <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Listed</dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-tight text-blue-600 md:text-3xl">500+</dd>
                    <dd className="text-sm text-zinc-500">tools</dd>
                  </div>
                  <div className="text-center sm:px-4">
                    <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Topics</dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-tight text-violet-600 md:text-3xl">50+</dd>
                    <dd className="text-sm text-zinc-500">categories</dd>
                  </div>
                  <div className="text-center sm:px-4">
                    <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">Community</dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-tight text-emerald-600 md:text-3xl">10K+</dd>
                    <dd className="text-sm text-zinc-500">visitors</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Featured picks — matches hero zinc / refined UI */}
        <section className="w-full border-t border-zinc-100 bg-white py-16 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-5xl text-center xl:mb-14 xl:max-w-6xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Hand-picked
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
                Featured tools
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-zinc-600 md:text-lg">
                Popular listings from the directory—updated as we add standout products.
              </p>
            </div>
            <FeaturedSlider featured={featured} />
          </div>
        </section>

        <div className="w-full border-t border-zinc-100 bg-zinc-50/90 py-16 md:py-24">
          <Search categories={categories} defaultrecents={recents} />
        </div>

        <footer className="w-full border-t border-zinc-800 bg-zinc-950 text-zinc-100">
          <div className="container py-14 md:py-16">
            <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-900 shadow-sm">
                    <FaChartLine className="text-lg text-zinc-200" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-50">
                      {domain && capitalizeFirstLetter(domain)}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Directory
                    </p>
                  </div>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
                  Discover and list tools in one place—search, filter, and explore the collection.
                </p>
              </div>

              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Quick links
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a href="/about" className="text-zinc-400 transition hover:text-zinc-100">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-zinc-400 transition hover:text-zinc-100">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-zinc-400 transition hover:text-zinc-100">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="text-zinc-400 transition hover:text-zinc-100">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Categories
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {categories.length ? (
                    categories.slice(0, 6).map((cat, idx) => (
                      <li key={`${cat.categoryId}-${idx}`}>
                        <a href="#search" className="text-zinc-400 transition hover:text-zinc-100">
                          {cat.category?.category_name ?? "Category"}
                        </a>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>
                        <a href="#search" className="text-zinc-400 transition hover:text-zinc-100">
                          Browse directory
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Get started
                </h4>
                <p className="mb-4 text-sm text-zinc-400">
                  List your product or jump into search.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="#search"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
                    aria-label="Open search"
                  >
                    <FaSearch className="text-sm" aria-hidden />
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
                    aria-label="Create an account"
                  >
                    <FaUserPlus className="text-sm" aria-hidden />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
                    aria-label="Log in"
                  >
                    <FaSignInAlt className="text-sm" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800/80 pt-8 text-center">
              <p className="text-sm text-zinc-500">
                &copy; {currentYear}{" "}
                {domain && capitalizeFirstLetter(domain)}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Homepage;
