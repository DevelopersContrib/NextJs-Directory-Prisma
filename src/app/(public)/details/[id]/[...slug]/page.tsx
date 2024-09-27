import React from "react";
import Details from "../../components/Details";
import { LinkType } from "@/types/link.type";
import { getLink,getFeatured } from "@/actions/link.action";

const page = async({ params }: { params: { id: string} }) => {
  
  const linkType = await getLink({id: params.id,});
  const link = linkType as LinkType;
  
  const featuredLink = await getFeatured();
  const featured = featuredLink as LinkType[];

  return (
    <main>
      <Details link={link} featured={featured} />
    </main>
  );
};

export default page;
