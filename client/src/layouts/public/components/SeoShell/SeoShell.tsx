// src/layouts/public/components/SeoShell/SeoShell.tsx

import { Helmet } from "react-helmet-async";
import { DEFAULT_SEO } from "./SeoDefaults";
import { SeoShellProps } from "./SeoTypes";

export function SeoShell(props: SeoShellProps) {
  const {
    title = DEFAULT_SEO.title,
    description = DEFAULT_SEO.description,
    keywords,
    canonical,
    noIndex,
    children,
  } = props;

  return (
    <>
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />

        {keywords && <meta name="keywords" content={keywords} />}
        {canonical && <link rel="canonical" href={canonical} />}

        {noIndex && <meta name="robots" content="noindex,nofollow" />}

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      {children}
    </>
  );
}
