import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";
import ListCategories from "./components/ListCategories";
import LinkType from "@/types/link.type";
import CategoryType from "@/types/category.type";

type Props = {
  recents: LinkType[];
  categories: CategoryType[];
  data: any | null | undefined;
  domain: string | null | undefined;
};
import FeaturedSlider from "./components/FeaturedSlider";
import "../../public.scss";

const Homepage = ({ categories, recents, data, domain }: Props) => {
  return (
    <>
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
                <div>{domain}</div>
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
        {/* Start:: Hero Section */}
        <div className="container text-center py-14">
          <h1 className="capitalize text-6xl mb-4 font-bold text-gray-800">
            {domain} Resources <br /> In One Directory
          </h1>
          <p className="text-base text-gray-400">{data.description}</p>
        </div>
        <div className="container mb-14">
          <FeaturedSlider />
        </div>
        {/* End:: Hero Section */}

        {/* Start:: Search Section */}
        <div className="container mb-4 flex flex-col">
          <div className="mb-4 flex">
            {/* <div className="flex border rounded-xl border-[#ddd] text-base w-full lg:w-[50%] lg:mx-auto"> */}
            <div className="flex border rounded-xl border-[#ddd] text-base w-full lg:w-[50%]">
              <input
                type="search"
                className="bg-transparent h-[50px] lg:mx-auto w-full px-4 py-1 focus:outline-none focus:ring-0 focus:border-none"
                placeholder="Search"
              />
              <span className="flex items-center justify-center px-4 text-[#777]">
                <FaSearch />
              </span>
            </div>
          </div>
          <ul className="flex w-full flex-wrap mb-4">
            <li className="bg-[#e9ecef] text-[#444] rounded-sm text-sm inline-flex flex-col mr-1 mb-1">
              <a href="#" className="capitalize block font-light px-3 py-2">
                all
              </a>
            </li>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <li
                  key={index}
                  className="bg-[#e9ecef] text-[#444] rounded-sm text-sm inline-flex flex-col mr-1 mb-1"
                >
                  <a href="#" className="capitalize block font-light px-3 py-2">
                    category {index + 1}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        {/* End:: Search Section */}

        {/* Start:: Categories Section */}
        <ListCategories recents={recents} />
        {/* End:: Categories Section */}

        <footer className="py-8 w-full border-t border-[#ddd]">
          <div className="container flex justify-between text-sm text-[#777]">
            <div>&copy; 2024 Domaindirectory.com. All rights reserved.</div>
            <div className="flex lg:justify-end">
              <ul className="flex space-x-2">
                <li>
                  <a href="#" className="inline-flex">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="inline-flex">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Homepage;
