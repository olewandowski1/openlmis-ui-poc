import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { UsersTable } from '@/features/users/components/users-table';
import { createFileRoute } from '@tanstack/react-router';
import { UsersRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(app)/_app/users/')({
  component: UsersPage,
});

/**
 * @name UsersPage
 * @description
 * Users page for the app. It is the page that the user sees after clicking on the Users link.
 */
function UsersPage() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Users',
  });

  return (
    <>
      <div className='p-2 md:py-2 md:p-4 flex flex-row items-center justify-start gap-2'>
        <div className='size-7 flex justify-center items-center rounded-md bg-gradient-to-br from-accent/60 to-accent'>
          <UsersRound size={16} />
        </div>
        <Typography.H1 className='text-xl font-bold'>
          {t('users')}
        </Typography.H1>
      </div>
      <Separator />
      <div className='flex flex-col gap-4 p-2 md:p-4'>
        <UsersTable />
      </div>
    </>
  );
}
