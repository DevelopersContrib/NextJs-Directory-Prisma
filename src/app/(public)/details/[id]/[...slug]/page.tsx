import React from "react";
import Details from "../../components/Details";
import { LinkType } from "@/types/link.type";
import { getLink,getFeatured,getDislikeCount,getLikeCount } from "@/actions/link.action";

const page = async({ params }: { params: { id: string} }) => {
  
  const linkType = await getLink({id: params.id,});
  const link = linkType as LinkType;
  
  const featuredLink = await getFeatured();
  const featured = featuredLink as LinkType[];


  const countLikes = await getLikeCount(params.id);
  const countDislikes = await getDislikeCount(params.id);

  return (
    <main>
      <Details link={link} featured={featured} countLikes={countLikes} countDislikes={countDislikes} />
    </main>
  );
};

export default page;
