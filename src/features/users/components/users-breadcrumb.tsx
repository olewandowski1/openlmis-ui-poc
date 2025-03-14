import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const UsersBreadcrumb = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Users',
  });

  return (
    <Breadcrumb className='pt-2'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Home size={16} strokeWidth={2} aria-hidden='true' />
            <span className='sr-only'>{t('home')}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{t('administration')}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{t('users')}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
