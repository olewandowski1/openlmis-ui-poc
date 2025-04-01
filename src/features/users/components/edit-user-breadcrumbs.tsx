import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@tanstack/react-router';
import { HomeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const EditUserBreadcrumbs = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Users',
  });

  return (
    <Breadcrumb>
      <BreadcrumbList className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/'>
              <HomeIcon size={16} aria-hidden='true' />
              <span className='sr-only'>{t('home')}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator> · </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/users'>{t('usersSection')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator> · </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>
            <span>{t('editUserPageTitle')}</span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
