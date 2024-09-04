"use client";

import Image from "next/image";
import React from "react";

import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { FaRegFileAlt, FaRegStar } from "react-icons/fa";
import { FiTrash, FiArchive } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import Subtitle from '../sidebar/subtitle';

import List from "./list";
import { signOut } from "next-auth/react";
import FolderType from "@/types/folder.type";
import CategoryType from "@/types/category.type";
import LinkType from "@/types/link.type";
import Folders from "./folders";
import PostType from "@/types/post.type";
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  userId: string;
  categories: CategoryType[];
  recents: LinkType[];
  domain?: string;
  logo: string;
};

const Sidebar = ({ categories, recents, userId, domain, logo }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const linkId = searchParams.get("linkId");
  const category = searchParams.get("category");

  const logoutHandler = () => {
    signOut();
  };

  const createNewListing = () => {
    router.push(`/dashboard?modal=open`);
  };

  return (
    <nav className="min-w-300 max-w-300 bg-[#1b1b1b] h-screen py-30 flex flex-col gap-y-30 overflow-y-auto">
      {/* Logo & Search Buttonn */}
      <div className="px-20 flex items-center justify-between">
        {logo ? (
          <Image
            src={logo}
            alt={domain ?? ""}
            width={101}
            height={38}
            className="w-101 h-38"
          />
        ) : (
          <span>{domain}</span>
        )}
        <FiSearch className="w-20 h-20 text-white opacity-40 cursor-pointer" />
      </div>
      {/* New Note Button */}
      <div className="px-20">
        <button
          className="rounded-3 bg-white/5 text-white w-full h-40 p-20 flex items-center justify-center gap-x-8 font-sans font-semibold text-16"
          onClick={createNewListing}
        >
          <FaPlus className="w-20 h-20" />
          New Listing
        </button>
      </div>
      {/* Recents */}
      

      
      {/* Settings */}
      <div>
        <div className="px-20 mb-10">
          <Subtitle title="Settings" />
        </div>
        <div className="flex flex-col gap-y-5">
          <div
            onClick={logoutHandler}
            className="py-10 px-20 h-40 w-full flex items-center gap-x-15 cursor-pointer opacity-60 hover:opacity-100 hover:bg-white/5 transition"
          >
            <IoIosLogOut className="w-20 h-20 text-white" />
            <h3 className="font-sans text-16 font-semibold text-white">
              Logout
            </h3>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
