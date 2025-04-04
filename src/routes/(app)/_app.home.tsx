import { Typography } from '@/components/ui/typography';
import { HomePageDashboard } from '@/features/dashboard/components/home-page-dashboard';
import { HomePageSkeleton } from '@/features/dashboard/components/home-page-skeleton';
import { useLoggedUser } from '@/features/users/hooks/use-user';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(app)/_app/home')({
  component: HomePage,
});

/**
 * @name HomePage
 * @description
 * Home page for the app. It is the first page that the user sees after logging in.
 */
function HomePage() {
  const { isLoading } = useLoggedUser();
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.HomePage',
  });

  // TODO: For now, we are showing a skeleton loader while the user is being fetched.
  if (isLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <>
      <title> OpenLMIS - Home </title>

      <div className='p-4'>
        <Typography.H1>{t('systemName')}</Typography.H1>
        <Typography.Muted> {t('explanation')} </Typography.Muted>
        <HomePageDashboard />
      </div>
    </>
  );
}
