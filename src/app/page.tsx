import React from "react";
import Homepage from "./(public)/homepage/Homepage";
import prismadb from "@/lib/prismaDb";
import { authOptions } from "@/lib/utils/auth-options";
import FolderType from "@/types/folder.type";
import PostType from "@/types/post.type";
import { LinkType } from "@/types/link.type";
import SessionType from "@/types/session.type";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getDomain, getData } from "@/lib/data";
import CategoryType from "@/types/category.type";

type SearchParams = {
  keyword?: string;
  categoryId?: string;
};

export default async function page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  try {
    const session: SessionType = await getServerSession(authOptions);
    if (session) redirect("/dashboard");

    const c = await getData();
    const domain = getDomain();

    const categories: LinkType[] = await prismadb.link.findMany({
      distinct: ["categoryId"],
      include: {
        category: true,
      },
      orderBy: {
        title: "asc",
      },
    });
    const recents: LinkType[] = await prismadb.link.findMany({
      where: {
        approved: true,
      },
      include: {
        category: {
          select: {
            category_name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const featured: LinkType[] = await prismadb.link.findMany({
      where: {
        approved: true,
        featured: true,
      },
      include: {
        category: {
          select: {
            category_name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return (
      <>
        <Homepage
          categories={categories}
          recents={recents}
          featured={featured}
          data={c.data}
          domain={domain}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-600">Unable to load the homepage. Please try again later.</p>
      </div>
    );
  }
}
