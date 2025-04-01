import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { RoleCreateTypeSkeleton } from '@/features/roles/components/role-create-type-skeleton';
import { useRoleRights } from '@/features/roles/hooks/use-role-rights';
import { Link } from '@tanstack/react-router';
import { ChevronRightIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const RoleCreateTypeOptions = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
  });

  const { rights, isLoading } = useRoleRights();

  const uniqueRightTypeData = useMemo(() => {
    if (isLoading || !rights || rights.length === 0) {
      return [];
    }

    const allTypes = rights.map((right) => right.type).filter(Boolean);

    const uniqueTypes = [...new Set(allTypes)];

    return uniqueTypes;
  }, [rights, isLoading]);

  if (isLoading) {
    return <RoleCreateTypeSkeleton />;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {uniqueRightTypeData.map((type) => {
        return (
          <Button
            key={type}
            className='group flex h-auto w-full items-start justify-between gap-4 py-3 text-left'
            variant='outline'
            asChild
          >
            <Link to='/roles/create' search={{ type }}>
              <div className='flex flex-1 flex-col items-start space-y-1'>
                <Typography.H3 className='text-lg'>
                  {t(`rightType.${type}`)}
                </Typography.H3>
                <Typography.P className='whitespace-break-spaces font-normal text-muted-foreground'>
                  {t(`rightType.${type + '_DESCRIPTION'}`)}
                </Typography.P>
              </div>
              <ChevronRightIcon
                className='mt-1 flex-shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5'
                size={16}
                aria-hidden='true'
              />
            </Link>
          </Button>
        );
      })}
    </div>
  );
};
