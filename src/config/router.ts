import { queryClient } from '@/config/query-client';
import { routeTree } from '@/routeTree.gen';
import { createRouter } from '@tanstack/react-router';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});
