import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { User } from '@/lib/types';
import { Link } from '@tanstack/react-router';
import { ColumnDef, FilterFn } from '@tanstack/react-table';
import {
  Check,
  EllipsisVertical,
  LockKeyholeOpen,
  Pencil,
  Shield,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const statusFilterFn: FilterFn<User> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export const useCreateColumns = (): ColumnDef<User>[] => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Users',
  });

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={t('selectAll')}
          />
          <span className='sr-only'> {t('select')} </span>
        </>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('selectRow', { name: row.original.username })}
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'username',
      header: t('username'),
      cell: ({ row }) => (
        <span className='font-medium'>{row.getValue('username')}</span>
      ),
      size: 120,
      enableHiding: false,
    },
    {
      accessorKey: 'firstName',
      header: t('firstName'),
      cell: ({ row }) => (
        <span className='text-muted-foreground'>
          {row.getValue('firstName')}
        </span>
      ),
      size: 110,
    },
    {
      accessorKey: 'lastName',
      header: t('lastName'),
      cell: ({ row }) => (
        <span className='text-muted-foreground'>
          {row.getValue('lastName')}
        </span>
      ),
      size: 110,
    },
    {
      accessorKey: 'email',
      header: t('email'),
      size: 110,
    },
    {
      accessorKey: 'active',
      header: t('status'),
      cell: ({ row }) => {
        return (
          <>
            <span className='sr-only'>
              {row.original.active ? t('active') : t('inactive')}
            </span>
            {row.original.active ? (
              <Check size={18} className='text-emerald-600' />
            ) : (
              <X size={18} className='text-red-600' />
            )}
          </>
        );
      },
      size: 90,
      filterFn: statusFilterFn,
    },
    {
      id: 'actions',
      header: () => <span className='sr-only'>{t('actions')}</span>,
      cell: ({ row }) => <RowActions item={row.original} />,
      size: 140,
      enableHiding: false,
    },
  ];
};

const RowActions: React.FC<{ item: User }> = ({ item }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Users',
  });

  if (isMobile) {
    return (
      <div className='flex justify-end gap-2 py-3'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='icon'
              variant='outline'
              aria-label={t('userActions')}
              asChild
            >
              <Link to='/users/$userId/edit' params={{ userId: item.id }}>
                <EllipsisVertical size={16} aria-hidden='true' />
              </Link>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to='/users/$userId/edit' params={{ userId: item.id }}>
                <Pencil size={16} aria-hidden='true' />
                <span>{t('editUser')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield size={16} aria-hidden='true' />
              <span>{t('managePermissions')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LockKeyholeOpen size={16} aria-hidden='true' />
              <span>{t('resetPassword')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className='flex justify-end gap-2 py-3'>
      {/* Edit Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='default'
            aria-label={t('editUser')}
            asChild
          >
            <Link to='/users/$userId/edit' params={{ userId: item.id }}>
              <Pencil size={16} aria-hidden='true' />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent className='px-2 py-1 text-sm'>
          {t('editUser')}
        </TooltipContent>
      </Tooltip>

      {/* Manage Permissions Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='outline'
            aria-label={t('managePermissions')}
          >
            <Shield
              className='text-muted-foreground/80'
              size={16}
              aria-hidden='true'
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent className='px-2 py-1 text-sm'>
          {t('managePermissions')}
        </TooltipContent>
      </Tooltip>

      {/* Reset Password Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size='icon' variant='outline' aria-label={t('resetPassword')}>
            <LockKeyholeOpen
              className='text-muted-foreground/80'
              size={16}
              aria-hidden='true'
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent className='px-2 py-1 text-sm'>
          {t('resetPassword')}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
