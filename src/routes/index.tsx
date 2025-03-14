import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

/**
 * @name IndexPage
 *
 * @description
 * This is the index page component. It is displayed when the user navigates to the root URL.
 * For now, we're redirecting users to the dashboard. In the future, we can display a landing page here.
 */
function IndexPage() {
  return <Navigate to='/home' />;
}
