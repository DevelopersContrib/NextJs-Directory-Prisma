"use client";

import React from "react";

import { FaRegFileAlt, FaRegStar } from "react-icons/fa";
import DataTableListing from "@/app/(admin)/dashboard/components/DataTableListing";
import { LinkType } from "@/types/link.type";
import CategoryType from "@/types/category.type";

type Props = {
  recents: LinkType[];
  categories: CategoryType[];
  userId: string;
};

// const Main = ({ recents }: { recents: LinkType[] }) => {
const Main = ({ recents, categories, userId }: Props) => {
  return (
    <div className="p-[50px] flex flex-col gap-y-8 w-full">
      <div>
        <div className="bg-[#cfe2ff] p-8 border border-[#9ec5fe] text-[#052c65]">
          <h1 className="text-3xl mb-4">
            Welcome to [Directory Name]! We're excited to have you onboard.
          </h1>
          <p className="mb-4">
            <strong>Here's how you can get started right away:</strong>
          </p>
          <ol className="mb-4 ">
            <li className="list-disc list-inside">
              Post a Link: Visit your dashboard to submit your first link. Share
              your services, products, or website with our community in just a
              few clicks.
            </li>
            <li className="list-disc list-inside">
              Get Featured: Want extra visibility? Choose the “Featured Listing”
              option when you post a link to get premium placement in the
              directory.
            </li>
            <li className="list-disc list-inside">
              Engage and Grow: Check out other listings, upvote, and engage with
              our community!
            </li>
          </ol>
          <h2 className="text-xl mb-1">Post Your First Link Now</h2>
          <p className="text-sm">
            Need help? Feel free to reply to this email, and we'll be happy to
            assist you.
          </p>
          <p className="text-sm mb-4">
            Welcome to the future of directories! Let's build something great
            together.
          </p>
          <p className="text-xs">
            Best regards, <br />
            The [Directory Name] Team
          </p>
        </div>
      </div>
      <div>
        <h2 className="font-sans font-semibold text-2xl text-black/60 flex items-center">
          <span className="mr-2">
            <FaRegFileAlt />
          </span>
          {`Your Listings`}
        </h2>
        <DataTableListing
          recents={recents}
          categories={categories}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default Main;
