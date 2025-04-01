import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { RolesTable } from '@/features/roles/components/roles-table';
import { createFileRoute } from '@tanstack/react-router';
import { KeyIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(app)/_app/roles/')({
  component: RolesPage,
});

/**
 * @name RolesPage
 * @description
 * Roles page for the app. It is the page that the user sees after clicking on the Roles link.
 */
function RolesPage() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
  });

  return (
    <>
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <div className='size-8 flex justify-center items-center rounded-md bg-gradient-to-br from-accent/60 to-accent'>
          <KeyIcon size={18} />
        </div>
        <Typography.H1>{t('rolesSection')}</Typography.H1>
      </div>
      <Separator />
      <div className='flex flex-col gap-4 p-2 md:p-4'>
        <RolesTable />
      </div>
    </>
  );
}
