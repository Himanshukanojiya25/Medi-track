// src/layouts/public/components/SeoShell/SeoDefaults.ts

import { SeoMeta } from "./SeoTypes";

export const DEFAULT_SEO: Required<Pick<SeoMeta, "title" | "description">> = {
  title: "MediTrack – Find Doctors, Hospitals & AI Health Support",
  description:
    "MediTrack helps you discover trusted doctors, hospitals, and AI-powered health guidance – fast, reliable, and secure.",
};
