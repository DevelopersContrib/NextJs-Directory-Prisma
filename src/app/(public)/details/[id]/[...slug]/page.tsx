import React from "react";
import Details from "../../components/Details";
import { LinkType } from "@/types/link.type";
import { getLink,getFeatured,getDislikeCount,getLikeCount } from "@/actions/link.action";
import { getDomain, getData } from "@/lib/data";
import { clickAction, countClicksAction } from "@/actions/click.action";

const page = async({ params }: { params: { id: string} }) => {

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
};

export default page;
