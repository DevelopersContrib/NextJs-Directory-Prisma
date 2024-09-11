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
import PaymentType from "@/types/payment.type";
import CategoryType from "@/types/category.type";
import StripeWrapper from "@/components/checkout/StripeWrapper";

type SearchParams = {
  linkId?: string;
  categoryId?: string;
};

interface Checkout {
  params: { id: string };
}
const App: React.FC<Checkout> = async ({ params }) => {
  const session: SessionType = await getServerSession(authOptions);

  if (!session) redirect("/");

  const c = await getData();
  const domain = getDomain();

  const paymentAlreadyExists = await prismadb.payment.findFirst({
    where: {
      userId: session.user.userId,
    },
  });

  if (paymentAlreadyExists) redirect("/dashboard");

  const categories: CategoryType[] = await prismadb.category.findMany({
    orderBy: {
      category_name: "asc",
    },
  });
  const recents: LinkType[] = await prismadb.link.findMany({
    where: {
      userId: session.user.userId,
      archivedAt: null,
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

  const pack = {
    id: 1,
    name: "Lifetime Membership",
    start_limit: 1,
    end_limit: 10,
    price: "900",
    userPlanId: 1,
  };

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
        <div className="p-[50px] flex flex-col gap-y-8 w-full">
          <StripeWrapper
            id={params.id}
            pack={pack}
            userId={session.user.userId}
          />
        </div>
      </main>
    </>
  );
};

export default App;
