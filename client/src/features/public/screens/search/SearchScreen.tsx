// src/features/public/screens/search/SearchScreen.tsx

import { SeoShell } from "../../../../layouts/public/components/SeoShell";
import { SearchFilters } from "./SearchFilters";
import { SearchResults } from "./SearchResults";

export function SearchScreen() {
  return (
    <>
      <SeoShell
        title="Search Doctors & Hospitals"
        description="Search doctors and hospitals by location, speciality, ratings and availability."
      />

      <main className="public-search-page">
        <h1>Search</h1>

        <SearchFilters />
        <SearchResults />
      </main>
    </>
  );
}
