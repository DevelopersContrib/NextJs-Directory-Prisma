import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";

const Homepage = () => {
  return (
    <main className="flex w-full flex-wrap">
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
    </main>
  );
};

export default Homepage;
