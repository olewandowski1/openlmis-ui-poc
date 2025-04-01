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
import { Role } from '@/lib/types';
import { Link } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const useCreateColumns = (): ColumnDef<Role>[] => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
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
          aria-label={t('selectRow', { name: row.original.name })}
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: t('roleName'),
      cell: ({ row }) => (
        <span className='font-medium'>{row.getValue('name')}</span>
      ),
      size: 150,
      enableHiding: false,
    },
    {
      accessorKey: 'type',
      header: t('roleType'),
      cell: ({ row }) => (
        <span className='text-muted-foreground'>
          {t(`rightType.${row.original.rights[0].type}`)}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'description',
      header: t('description'),
      cell: ({ row }) => (
        <span className='text-muted-foreground'>
          {row.getValue('description')}
        </span>
      ),
      size: 240,
    },
    {
      accessorKey: 'count',
      header: t('numberOfUsers'),
      cell: ({ row }) => (
        <span className='text-muted-foreground'>{row.getValue('count')}</span>
      ),
      size: 60,
    },
    {
      id: 'actions',
      header: () => <span className='sr-only'>{t('actions')}</span>,
      cell: ({ row }) => <RowActions item={row.original} />,
      size: 100,
      enableHiding: false,
    },
  ];
};

const RowActions: React.FC<{ item: Role }> = ({ item }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
  });

  if (isMobile) {
    return (
      <div className='flex justify-end gap-2 py-3'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='outline' aria-label={t('roleActions')}>
              <EllipsisVertical size={16} aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to='/roles/$roleId/edit' params={{ roleId: item.id }}>
                <Pencil size={16} aria-hidden='true' />
                <span>{t('editRole')}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className='flex justify-end gap-2 py-3'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='default'
            aria-label={t('editRole')}
            asChild
          >
            <Link to='/roles/$roleId/edit' params={{ roleId: item.id }}>
              <Pencil size={16} aria-hidden='true' />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent className='px-2 py-1 text-sm'>
          {t('editRole')}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
