// src/features/public/utils/build-public-query.util.ts

export type PublicQueryInput = Record<
  string,
  string | number | boolean | undefined | null
>;

export function buildPublicQuery(input: PublicQueryInput): string {
  const params = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(typeof value === "number" && Number.isNaN(value))
    ) {
      params.append(key, String(value));
    }
  });

  return params.toString();
}
