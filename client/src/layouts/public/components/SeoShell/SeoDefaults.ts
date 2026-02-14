// src/layouts/public/components/SeoShell/SeoDefaults.ts

import { SeoMeta } from "./SeoTypes";

export const DEFAULT_SEO: Required<
  Pick<SeoMeta, "title" | "description">
> = {
  title:
    "MediTrack – Find Trusted Doctors, Hospitals & AI Health Support",
  description:
    "Discover verified doctors, hospitals, and AI-powered health guidance with MediTrack. Secure, fast, and reliable healthcare access.",
};

export const SITE_URL =
  import.meta.env.VITE_SITE_URL || "https://meditrack.com";
