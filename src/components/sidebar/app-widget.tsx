import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

/**
 * @name AppWidget
 * @description
 * Widget for the application. It displays the OpenLMIS logo. It is used in the sidebar header.
 */
export const AppWidget = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'app.AppWidget' });
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link to='/home'>
          <SidebarMenuButton
            size='lg'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-center cursor-pointer'
          >
            <div className='flex items-center justify-center rounded-lg aspect-square size-9 bg-muted text-sidebar-primary-foreground'>
              <img
                src='/olmis.png'
                alt='OpenLMIS Logo'
                className='text-white shrink-0 size-5'
              />
            </div>
            {isExpanded && (
              <>
                <div className='grid flex-1 text-sm leading-tight text-left'>
                  <span className='font-semibold truncate'> OpenLMIS </span>
                  <span className='text-xs truncate'> {t('poc')} </span>
                </div>
              </>
            )}
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
