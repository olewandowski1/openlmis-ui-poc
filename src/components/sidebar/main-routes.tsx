import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SAMPLE_ROUTES = [
  {
    key: 'home',
    href: '/home',
    icon: Home,
    isActive: true,
  },
];

/**
 * @name MainRoutes
 * @description
 * Main routes for the application. It displays the main routes in the sidebar. Non-collapsible.
 */
export const MainRoutes = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'app.MainRoutes' });
  const { pathname } = useLocation();

  return (
    <SidebarMenu>
      {SAMPLE_ROUTES.map((route) => (
        <SidebarMenuItem key={route.key}>
          <SidebarMenuButton
            asChild
            className={cn('', {
              'bg-sidebar-accent': pathname === route.href,
            })}
          >
            <Link to={route.href}>
              <route.icon />
              <span>{t(route.key)}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
