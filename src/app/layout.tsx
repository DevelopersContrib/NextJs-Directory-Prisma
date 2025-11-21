// app/layout.tsx

import "./globals.scss";
import "./custom.css";
import Script from "next/script";
import { getData } from "@/lib/data";
import { capitalizeFirstLetter } from "@/helpers/capitalize-first-letter";
import Providers from "@/components/providers";
import type { Metadata } from "next";
import First100FoundersModalWrapper from "@/components/First100FoundersModalWrapper";

export async function generateMetadata(): Promise<Metadata> {
  let c;
  try {
    c = await getData();
  } catch (error) {
    console.error('Error generating metadata:', error);
    c = { data: { title: 'Welcome', domainName: 'localhost', description: '', author: '', keywords: '' } };
  }

  const domainName = c.data.domainName ? c.data.domainName.replace(/\.(com|org|net|io|co|app|dev)$/i, '') : 'localhost';
  const title = c.data.title || `Welcome to ${capitalizeFirstLetter(domainName)}`;
  const description = c.data.description || '';

  return {
    title,
    description,
    keywords: c.data.keywords?.split(",") || [],
    authors: [{ name: c.data.author || 'Unknown' }],
    openGraph: {
      title,
      description,
      siteName: c.data.domainName || 'localhost',
      type: "website",
      locale: "en_US",
      url: `https://${c.data.domainName || 'localhost'}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    metadataBase: new URL(`https://${c.data.domainName || 'localhost'}`),
    alternates: {
      canonical: `https://${c.data.domainName || 'localhost'}`,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let c;
  try {
    c = await getData();
  } catch (error) {
    console.error('Error fetching data in layout:', error);
    c = { data: {} };
  }

  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        {c?.data?.adsenseClientId && (
          <Script
            id="g-ads"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${c.data.adsenseClientId}`}
            data-checked-head="true"
          />
        )}

        {/* Google Analytics */}
        {c?.data?.accountGA && (
          <>
            <Script
              id="g-manager"
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${c.data.accountGA}`}
            />
            <Script id="g-tag">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${c.data.accountGA}');
              `}
            </Script>
          </>
        )}

        {/* Matomo Analytics */}
        {c?.data?.piwikId && (
          <>
            <Script id="matomo" type="text/javascript">
              {`
                var _paq = window._paq || [];
                _paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
                _paq.push(["setCookieDomain", "*.${c.data.domainName}"]);
                _paq.push(["setDomains", ["*.${c.data.domainName}"]]);
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                  var u="//stats.numberchallenge.com/";
                  _paq.push(['setTrackerUrl', u+'matomo.php']);
                  _paq.push(['setSiteId', ${c.data.piwikId}]);
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                })();
              `}
            </Script>
            <noscript>
              <p>
                <img
                  src={`//stats.numberchallenge.com/matomo.php?idsite=${c.data.piwikId}`}
                  alt=""
                  style={{ border: 0 }}
                />
              </p>
            </noscript>
          </>
        )}
      </head>
      <body>
        <First100FoundersModalWrapper />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
