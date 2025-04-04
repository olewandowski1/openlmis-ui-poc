import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { CreateRoleBreadcrumbs } from '@/features/roles/components/create-role-breadcrumbs';
import { RoleCreateTypeOptions } from '@/features/roles/components/role-create-type-options';
import { createFileRoute } from '@tanstack/react-router';
import { InfoIcon, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/(app)/_app/roles/type/create')({
  component: SelectRoleCreateTypePage,
});

function SelectRoleCreateTypePage() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
  });

  return (
    <>
      <title> OpenLMIS - Create Role </title>

      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <div className='size-8 flex justify-center items-center rounded-md bg-gradient-to-br from-accent/60 to-accent'>
          <ShieldCheck size={18} />
        </div>
        <Typography.H1>{t('createRolePageTitle')}</Typography.H1>
      </div>
      <Separator />
      <CreateRoleBreadcrumbs selectType />
      <Separator />
      <div className='flex flex-col gap-4 p-2 md:p-4'>
        <div className='rounded-md border px-4 py-3'>
          <div className='text-sm flex flex-row items-center'>
            <InfoIcon
              className='me-3 -mt-0.5 inline-flex text-blue-500'
              size={16}
              aria-hidden='true'
            />
            <Typography.H2 className='border-0 text-sm font-normal p-0'>
              {t('createRoleTypePageSubtitle')}
            </Typography.H2>
          </div>
        </div>

        <RoleCreateTypeOptions />
      </div>
    </>
  );
}
