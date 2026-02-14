// src/layouts/public/components/SeoShell/SeoShell.tsx

import { Helmet } from "react-helmet-async";
import { DEFAULT_SEO, SITE_URL } from "./SeoDefaults";
import { SeoShellProps } from "./SeoTypes";
import { useLocation } from "react-router-dom";

export function SeoShell(props: SeoShellProps) {
  const {
    title = DEFAULT_SEO.title,
    description = DEFAULT_SEO.description,
    keywords,
    canonical,
    image,
    noIndex,
    children,
  } = props;

  const location = useLocation();
  const currentUrl = `${SITE_URL}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  return (
    <>
      <Helmet>
        {/* Primary */}
        <title>{title}</title>
        <meta name="description" content={description} />

        {keywords && (
          <meta name="keywords" content={keywords} />
        )}

        <link rel="canonical" href={canonicalUrl} />

        {noIndex && (
          <meta name="robots" content="noindex,nofollow" />
        )}

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={description}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        {image && (
          <meta property="og:image" content={image} />
        )}

        {/* Twitter */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content={description}
        />
        {image && (
          <meta name="twitter:image" content={image} />
        )}
      </Helmet>

      {children}
    </>
  );
}
