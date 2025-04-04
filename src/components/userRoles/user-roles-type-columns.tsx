import { ActionCell } from '@/components/delete-action-cell';
import { RightType, RoleAssignment } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { UserRolesRoleBadge } from './user-roles-role-badge';

export const useCreateColumns = (
  currentType: RightType,
  onRemoveRole: (roleAssignmentToRemove: RoleAssignment) => void,
  isMutationSubmitting: boolean
): ColumnDef<RoleAssignment>[] => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.UserRoles',
  });

  const actionColumn: ColumnDef<RoleAssignment> = {
    id: 'actions',
    header: () => <span className='sr-only'>{t('actions')}</span>,
    cell: ({ row }) => (
      <ActionCell
        row={row}
        onRemove={onRemoveRole}
        t={t}
        ariaLabelKey='deleteRoleAssignment'
        tooltipKey='deleteRoleAssignment'
        isMutationSubmitting={isMutationSubmitting}
      />
    ),
    size: 140,
    enableHiding: false,
  };

  const roleColumn: ColumnDef<RoleAssignment> = {
    header: t('roleName'),
    accessorKey: 'roleName',
    cell: ({ row }) => (
      <UserRolesRoleBadge
        roleName={row.original.roleName}
        rights={row.original.rights}
      />
    ),
    size: 120,
    enableHiding: false,
  };

  switch (currentType) {
    case 'SUPERVISION':
      return [
        {
          header: t('programLabel'),
          accessorKey: 'programName',
          cell: ({ row }) => (
            <div className='font-medium'>{row.getValue('programName')}</div>
          ),
          size: 150,
          enableHiding: true,
        },
        {
          header: t('nodeLabel'),
          accessorKey: 'supervisoryNodeName',
          cell: ({ row }) => (
            <div className='truncate'>
              {row.getValue('supervisoryNodeName') ?? '-'}
            </div>
          ),
          size: 180,
          enableHiding: true,
        },
        roleColumn,
        actionColumn,
      ];
    case 'REPORTS':
      return [roleColumn, actionColumn];
    case 'GENERAL_ADMIN':
      return [roleColumn, actionColumn];
    case 'ORDER_FULFILLMENT':
      return [
        {
          header: t('supplyingFacility'),
          accessorKey: 'warehouseName',
          cell: ({ row }) => <div>{row.getValue('warehouseName')}</div>,
          size: 180,
          enableHiding: true,
        },
        roleColumn,
        actionColumn,
      ];
    default:
      return [];
  }
};
