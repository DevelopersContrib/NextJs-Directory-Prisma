import ListPosts from "@/components/list-posts/list-posts";
import Main from "@/components/main/main";
import CreateNewNoteModal from "@/components/sidebar/create-new-note-modal";
import CreateNewListingModal from "@/components/sidebar/create-new-listing-modal";
import Sidebar from "@/components/sidebar/sidebar";
import { ICategoryWithLinks } from "@/interfaces/category.interface";
import { ILinkWithCategory } from "@/interfaces/link.interface";
import prismadb from "@/lib/prismaDb";
import { authOptions } from "@/lib/utils/auth-options";
import FolderType from "@/types/folder.type";
import PostType from "@/types/post.type";
import LinkType from "@/types/link.type";
import SessionType from "@/types/session.type";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getDomain, getData } from "@/lib/data";
import CategoryType from "@/types/category.type";

type SearchParams = {
  
  linkId?: string;
  categoryId?: string;
};

export default async function Dashboard({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session: SessionType = await getServerSession(authOptions);
  if (!session) redirect("/");

  const c = await getData();
  const domain = getDomain();

  const categories: CategoryType[] = await prismadb.category.findMany({
    orderBy: {
      category_name: "asc",
    },
  });
  const recents: LinkType[] = await prismadb.link.findMany({
    where: {
      userId: session.user.userId,
      archivedAt: null
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const {  linkId, categoryId } = searchParams;

  
  return (
    <>
      <main className="flex">
        <Sidebar
          recents={recents}
          categories={categories}
          userId={session.user.userId}
          domain={domain}
          logo={c.data.logo}
        />
        
       <Main recents={recents}  />

        {/* components/sidebar/create-new-note-modal.tsx */}
        <CreateNewListingModal categories={categories} userId={session.user.userId} />
      </main>
    </>
  );
}
