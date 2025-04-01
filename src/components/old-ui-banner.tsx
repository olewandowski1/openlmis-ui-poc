import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RocketIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const OldUiBanner = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.ProtectedLayout',
  });
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const oldUiUrl = 'https://uat.openlmis.org/#!/home';

  return (
    <div className='bg-muted text-foreground px-4 py-3'>
      <div className='flex gap-2 md:items-center'>
        <div className='flex grow gap-3 md:items-center'>
          <div
            className='bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5'
            aria-hidden='true'
          >
            <RocketIcon className='opacity-80' size={16} />
          </div>
          <div className='flex grow flex-col justify-between gap-3 md:flex-row md:items-center'>
            <div className='space-y-0.5'>
              <p className='text-sm font-medium'>{t('experimentalUiTitle')}</p>
              <p className='text-muted-foreground text-sm'>
                {t('experimentalUiDescription')}
              </p>
            </div>
            <div className='flex gap-2 max-md:flex-wrap'>
              <a
                href={oldUiUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(buttonVariants({ size: 'sm' }), 'text-sm')}
              >
                {t('experimentalUiCheckPrevious')}
              </a>
            </div>
          </div>
        </div>
        <Button
          variant='ghost'
          className='group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent'
          onClick={() => setIsVisible(false)}
          aria-label={t('experimentalUiClose')}
        >
          <XIcon
            size={16}
            className='opacity-60 transition-opacity group-hover:opacity-100'
            aria-hidden='true'
          />
        </Button>
      </div>
    </div>
  );
};
