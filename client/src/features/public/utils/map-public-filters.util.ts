// src/features/public/utils/map-public-filters.util.ts

export interface PublicFilterInput {
  speciality?: string;
  location?: string;
  availability?: "today" | "any";
}

export interface NormalizedPublicFilters {
  speciality?: string;
  location?: string;
  availabilityToday?: boolean;
}

export function mapPublicFilters(
  input: PublicFilterInput
): NormalizedPublicFilters {
  return {
    speciality: input.speciality?.trim().toLowerCase(),
    location: input.location?.trim().toLowerCase(),
    availabilityToday: input.availability === "today" ? true : undefined,
  };
}
