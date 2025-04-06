export const ALL_RIGHT_TYPES = [
  'SUPERVISION',
  'REPORTS',
  'GENERAL_ADMIN',
  'ORDER_FULFILLMENT',
] as const;

export const DEFAULT_REACT_QUERY_OPTIONS = {
  // Do not retry (sending the same request multiple times) on error
  retry: false,
  // Stale time defaults to 10 minutes
  staleTime: 1000 * 60 * 10,
};
