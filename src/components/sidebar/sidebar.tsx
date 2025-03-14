import { AppWidget } from '@/components/sidebar/app-widget';
import { MainRoutes } from '@/components/sidebar/main-routes';
import { MenuRoutes } from '@/components/sidebar/menu-routes';
import { UserWidget } from '@/components/sidebar/user-widget';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';

/**
 * @name AppSidebar
 * @description
 * Sidebar for the application.
 */
export const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'app.AppSidebar' });

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <AppWidget />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <MainRoutes />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t('menu')}</SidebarGroupLabel>
          <MenuRoutes />
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <UserWidget />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
