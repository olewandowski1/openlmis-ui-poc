import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.NotFoundPage',
  });

  return (
    <>
      <title> OpenLMIS - 404 </title>

      <div className='w-full h-screen flex flex-col gap-4 justify-center items-center'>
        <Typography.Large> 404 </Typography.Large>

        <Typography.H1> {t('title')} </Typography.H1>

        <Typography.Muted> {t('description')} </Typography.Muted>

        <Button asChild>
          <Link to='/'>
            <ChevronLeft
              className='-ms-1 opacity-60'
              size={16}
              aria-hidden='true'
            />
            <Typography.P className='text-sm'> {t('back')} </Typography.P>
          </Link>
        </Button>
      </div>
    </>
  );
};
