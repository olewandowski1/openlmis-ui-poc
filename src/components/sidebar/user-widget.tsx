import { LanguagePicker } from '@/components/language-picker';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuthActions } from '@/features/auth/hooks/use-auth-actions';
import { useLoggedUser } from '@/features/users/hooks/use-user';
import { ALL_RIGHT_TYPES } from '@/lib/constants';
import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronsUpDown, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * @name UserWidget
 * @description
 * User widget for the sidebar. It displays the user's avatar, name, and email. It also
 * provides a dropdown menu for user actions.
 */
export const UserWidget = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'app.UserWidget' });

  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const { user, isLoading } = useLoggedUser();

  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {isLoading ? (
            <SidebarMenuSkeleton showIcon />
          ) : (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center justify-center cursor-pointer'
              >
                <Avatar className='rounded-lg size-9'>
                  <AvatarImage alt={`${user?.firstName} ${user?.lastName}`} />
                  <AvatarFallback className='rounded-lg'>
                    <UserRound size={20} strokeWidth={2} aria-hidden='true' />
                  </AvatarFallback>
                </Avatar>
                {isExpanded && (
                  <>
                    <div className='grid flex-1 text-sm leading-tight text-left'>
                      <span className='font-semibold truncate'>
                        {user?.firstName}
                      </span>
                      <span className='text-xs truncate'>
                        {user?.emailDetails?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className='ml-auto size-4' />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='flex items-start gap-2'>
              <Avatar className='rounded-lg size-9'>
                <AvatarImage alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback className='rounded-lg'>
                  <UserRound size={20} strokeWidth={2} aria-hidden='true' />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col min-w-0'>
                <span className='text-sm font-medium truncate text-foreground'>
                  {user?.firstName}
                </span>
                <span className='text-xs font-normal truncate text-muted-foreground'>
                  {user?.emailDetails?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  to='/users/$userId/roles'
                  params={{ userId: user?.id }}
                  // Default to the SUPERVISION tab
                  search={{ type: ALL_RIGHT_TYPES[0] }}
                >
                  <ShieldCheck size={16} strokeWidth={2} aria-hidden='true' />
                  <span>{t('roles')}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              <span>{t('preferences')}</span>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <div className='px-2 py-1.5 text-sm flex justify-between'>
                <span>{t('theme')}</span>
                <ModeToggle className='size-8' />
              </div>
              <div className='px-2 py-1.5 text-sm flex justify-between'>
                <span>{t('language')}</span>
                <LanguagePicker className='h-7' />
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={16} strokeWidth={2} aria-hidden='true' />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
