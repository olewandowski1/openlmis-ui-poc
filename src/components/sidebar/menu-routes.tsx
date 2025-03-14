import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight, Ellipsis, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SAMPLE_ROUTES = [
  {
    key: 'administration',
    icon: Terminal,
    items: [
      {
        key: 'users',
        href: '/users',
        isActive: true,
      },
    ],
  },
];

/**
 * @name MenuRoutes
 * @description
 * Sidebar menu routes. It displays the menu items. Collapsible.
 */
export const MenuRoutes = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'app.MenuRoutes' });
  const { pathname } = useLocation();

  return (
    <SidebarMenu>
      {SAMPLE_ROUTES.map((route) => {
        return (
          <Collapsible
            key={route.key}
            defaultOpen={route.items.some((item) =>
              pathname.includes(item.key)
            )}
            className='group/collapsible'
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={t(route.key)}
                  className='cursor-pointer'
                  disabled={route.items.length === 0}
                >
                  {route.icon ? <route.icon /> : <Ellipsis />}
                  <span>{t(route.key)}</span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {route.items.map((item) => (
                    <SidebarMenuSubItem key={item.key}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname.includes(item.href)}
                      >
                        <Link to={`${item.href}`}>{t(item.key)}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
};
