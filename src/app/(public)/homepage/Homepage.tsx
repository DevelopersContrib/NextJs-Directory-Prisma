import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";

const Homepage = () => {
  return (
    <>
      <header className="flex w-full ">
        <div className="container items-center justify-between flex py-4">
          <div>
            <Link href="/">
              <Image
                src="https://cdn.vnoc.com/logos/logo-StartupChallenge-1.png"
                width={0}
                height={0}
                alt="domain name"
                className="w-[200px] h-[34px] object-contain"
                sizes="100vw"
              />
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
          <h1 className="text-6xl mb-4 font-bold text-gray-800">
            Curated Resources <br /> In One Directory
          </h1>
          <p className="text-base text-gray-400">
            Resources that will boost your workflow and save you time and money.
          </p>
        </div>
        {/* End:: Hero Section */}

        {/* Start:: Discover Section */}
        <div className="container mb-8 flex flex-col">
          <div className="mb-4 flex">
            <div className="flex border rounded-xl border-[#ddd] text-base w-full lg:w-[50%] lg:mx-auto">
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
        </div>
        {/* End:: Discover Section */}
      </main>
    </>
  );
};

export default Homepage;
