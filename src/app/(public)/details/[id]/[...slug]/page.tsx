import React from "react";
import Details from "../../components/Details";
import { LinkType } from "@/types/link.type";
import { getLink,getFeatured,getDislikeCount,getLikeCount } from "@/actions/link.action";
import { getDomain, getData } from "@/lib/data";
import { clickAction, countClicksAction } from "@/actions/click.action";

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const domain = getDomain();
    const c = await getData();

    const linkType = await getLink({ id: params.id });
    const link = linkType as LinkType;

    return {
      title: `${link.title} - ${link.title}.com`,
      description: link.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Details - Page Not Found',
      description: 'The requested page could not be found.',
    };
  }
}

const page = async({ params }: { params: { id: string} }) => {
  try {
    const res = await clickAction({
      LinkId: params.id,
      path: "/",
    });
    
    const linkType = await getLink({id: params.id,});
    const link = linkType as LinkType;

    const c = await getData();
    const domain = getDomain();
    
    const featuredLink = await getFeatured();
    const featured = featuredLink as LinkType[];

    const countLikes = await getLikeCount(params.id);
    const countDislikes = await getDislikeCount(params.id);

    return (
      <main>
        <Details data={c.data} domain={domain} link={link} featured={featured} countLikes={countLikes} countDislikes={countDislikes} />
      </main>
    );
  } catch (error) {
    console.error('Error loading details page:', error);
    return (
      <main>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600">Unable to load the requested page. Please try again later.</p>
        </div>
      </main>
    );
  }
};

export default page;
