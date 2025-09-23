import React from "react";
import Details from "../../components/Details";
import { LinkType } from "@/types/link.type";
import { getLink,getFeatured,getDislikeCount,getLikeCount } from "@/actions/link.action";
import { getDomain, getData } from "@/lib/data";
import { clickAction, countClicksAction } from "@/actions/click.action";
import { capitalizeFirstLetter } from "@/helpers/capitalize-first-letter";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const domain = getDomain();
    const c = await getData();

    const linkType = await getLink({ id: params.id });
    const link = linkType as LinkType;

    // Process domain name for better SEO
    const processedDomain = link.title ? link.title.replace(/\.(com|org|net|io|co|app|dev)$/i, '') : 'tool';
    const capitalizedDomain = capitalizeFirstLetter(processedDomain);
    
    const title = `${capitalizedDomain} - ${link.title || 'Tool'} | ${c.data.title || 'Directory'}`;
    const description = link.description || `Discover ${capitalizedDomain} - ${link.title || 'this amazing tool'} on our directory.`;
    const url = `https://${domain || 'localhost'}/details/${params.id}/${link.title || 'tool'}`;

    return {
      title,
      description,
      keywords: [
        capitalizedDomain,
        link.title || 'tool',
        link.category?.category_name || 'tool',
        'directory',
        'tools',
        'software',
        'SaaS'
      ],
      authors: [{ name: c.data.author || 'Directory Team' }],
      openGraph: {
        title,
        description,
        url,
        siteName: c.data.title || 'Directory',
        type: 'website',
        locale: 'en_US',
        images: [
          {
            url: link.screenshot || link.company_logo || '',
            width: 1200,
            height: 630,
            alt: `${capitalizedDomain} - ${link.title || 'Tool'}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [link.screenshot || link.company_logo || ''],
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Tool Details - Page Not Found',
      description: 'The requested tool page could not be found.',
      robots: {
        index: false,
        follow: false,
      },
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
