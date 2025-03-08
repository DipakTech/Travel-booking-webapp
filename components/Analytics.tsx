"use client";

import Script from "next/script";

export function Analytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
  const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const UMAMI_SCRIPT_URL =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
    "https://analytics.umami.is/script.js";

  return (
    <>
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Umami Analytics */}
      {UMAMI_WEBSITE_ID && (
        <Script
          async
          defer
          data-website-id={UMAMI_WEBSITE_ID}
          src={UMAMI_SCRIPT_URL}
          data-domains={process.env.NEXT_PUBLIC_APP_URL?.replace(
            /^https?:\/\//,
            "",
          )}
          strategy="lazyOnload"
        />
      )}
    </>
  );
}
