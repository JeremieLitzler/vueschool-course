import { LocationQueryRaw } from 'vue-router';

/**
 * Get a value from a query parameter in the query string object.
 *
 * @param queryObj The Query object from a route of vue-router
 * @param key The query parameter to find
 * @returns The value if found, otherwise null
 */
export const getQueryStringValue = (
  queryObj: LocationQueryRaw,
  key: string
): string | null => {
  const match = queryObj[key] as string;
  if (match === undefined) return null;

  return match;
};
