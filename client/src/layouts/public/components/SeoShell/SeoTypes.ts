// src/layouts/public/components/SeoShell/SeoTypes.ts

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
}

export interface SeoShellProps extends SeoMeta {
  children?: React.ReactNode;
}
