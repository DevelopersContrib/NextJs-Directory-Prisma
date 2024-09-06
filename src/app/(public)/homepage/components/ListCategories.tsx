"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BiDislike, BiLike } from "react-icons/bi";

const ListCategories = () => {
  return (
    <>
      <div className="container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 mb-14">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex flex-col w-full">
              <a href="#" className="mb-8">
                <Image
                  src={"https://cdn.vnoc.com/background/contrib/task.jpg"}
                  width={0}
                  height={0}
                  alt=""
                  className="w-full h-full object-contain shadow-[rgb(23_43_99/24%)_0_3px_8px]"
                  sizes="100vw"
                />
              </a>
              <div>
                <h3 className="font-bold text-[#333] text-xl mb-0">
                  <a href="#" className="inline-flex">
                    Domain Name {index + 1}
                  </a>
                </h3>
              </div>
              <div>
                <hr className="border-gray-200/95 mt-4 mb-6" />
              </div>
              <div className="mb-4">
                <div className="inline-flex py-2 px-3 rounded bg-[#50e66754] text-black text-sm">
                  Category {index + 1}
                </div>
              </div>
              <div className="mb-4 font-light text-gray-600/80 text-[14px]">
                Beehiiv is a rapidly growing newsletter platform with powerful
                AI features like AI writing assistants and image tools,
                translator tools, and advanced newsletter personalization.
                Create content automation workflows and optimize for different
                audiences.
              </div>
              <div className="w-full flex justify-center space-x-2 pb-4">
                <Button variant={"secondary"}>
                  <BiLike />
                </Button>
                <Button variant={"secondary"}>
                  <BiDislike />
                </Button>
              </div>
              <div>
                <Button size={"lg"} className="w-full">
                  Details
                </Button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default ListCategories;
