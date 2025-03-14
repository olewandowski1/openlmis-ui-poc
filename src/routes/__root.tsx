import { NotFoundPage } from '@/components/not-found-page';
import { RootLayout } from '@/components/root-layout';
import { useLoginData } from '@/features/auth/store/login-data';
import { SHOW_DEVTOOLS } from '@/lib/mock-data';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const PUBLIC_PAGES = ['/login'];

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async ({ location }) => {
    const { isAuthenticated } = useLoginData.getState();

    if (!PUBLIC_PAGES.includes(location.pathname) && !isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

/**
 * @name RootComponent
 *
 * @description
 * This is the root component of the application. It is the parent of all other components.
 */
function RootComponent() {
  return (
    <RootLayout>
      <Outlet />
      {SHOW_DEVTOOLS && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-right' />
          <TanStackRouterDevtools position='bottom-left' />
        </>
      )}
    </RootLayout>
  );
}
