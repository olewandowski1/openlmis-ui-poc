import {
  ComboboxItem,
  PaginatedCombobox,
} from '@/components/paginated-combobox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Typography } from '@/components/ui/typography';
import { useUser } from '@/features/users/hooks/use-user';
import { useUsers } from '@/features/users/hooks/use-users';
import { updateUser } from '@/features/users/lib/api';
import { BaseUserFormData } from '@/features/users/lib/schemas';
import { ALL_RIGHT_TYPES } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { RoleAssignment, User } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { CloudDownload, InfoIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const areAssignmentsDuplicate = (
  existingAssignment: RoleAssignment,
  incomingAssignment: RoleAssignment
): boolean => {
  // Always check roleId first
  if (existingAssignment.roleId !== incomingAssignment.roleId) {
    return false;
  }

  // Determine comparison logic based on properties of the incoming assignment
  const isSupervisionLike =
    !!incomingAssignment.programId || !!incomingAssignment.supervisoryNodeId;
  const isOrderFulfillmentLike = !!incomingAssignment.warehouseId;

  if (isSupervisionLike) {
    // Compare roleId, programId, and supervisoryNodeId
    // Treat null/undefined consistently (e.g., as empty strings)
    return (
      (existingAssignment.programId || '') ===
        (incomingAssignment.programId || '') &&
      (existingAssignment.supervisoryNodeId || '') ===
        (incomingAssignment.supervisoryNodeId || '')
    );
  } else if (isOrderFulfillmentLike) {
    // Compare roleId and warehouseId
    return (
      (existingAssignment.warehouseId || '') ===
      (incomingAssignment.warehouseId || '')
    );
  } else {
    // Neither SUPERVISION nor ORDER_FULFILLMENT properties found.
    // Since roleId already matched, consider it a duplicate (GENERAL_ADMIN/REPORTS like).
    return true;
  }
};

export const UserRolesImportModal = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.UserRoles',
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userId } = useParams({
    from: '/(app)/_app/users/$userId/roles',
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch the user data for the selected user
  const { user: editedUser, isLoading: isEditedUserLoading } = useUser(userId);

  // Fetch all users
  const { users, isLoading: areUsersLoading } = useUsers();

  // Fetch the user data for the user with the desired roles
  // NOTE: It has to be like that since `/api/users/` do not return role assignments
  const {
    user: userWithDesiredRoles,
    isLoading: isUserWithDesiredRolesLoading,
  } = useUser(selectedUserId);

  // Map the users to the format required by the Combobox
  const mappedUsers = users.map((user: User) => ({
    id: user.id,
    name: user.username,
  })) as ComboboxItem[];

  const mutation = useMutation({
    mutationFn: (updatedData: BaseUserFormData) =>
      updateUser(userId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.user, userId] });

      toast.success(t('importRolesSuccess'));
      setIsOpen(false);
      setSelectedUserId(null);
      navigate({
        to: '/users/$userId/roles',
        params: { userId },
        search: { type: ALL_RIGHT_TYPES[0] },
      });
    },
    onError: () => {
      toast.error(t('importRolesError'));
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedUserId) {
      toast.error(t('noUserSelectedError'));
      return;
    }

    if (!userWithDesiredRoles || !editedUser) {
      toast.error(t('noUserSelectedError'));
      return;
    }

    const existingRoleAssignments = editedUser.roleAssignments || [];
    const desiredRoleAssignments = userWithDesiredRoles.roleAssignments || [];

    // Exclude duplicates
    const desiredRoleAssignmentsWithoutDuplicates =
      desiredRoleAssignments.filter((incomingAssignment) => {
        return !existingRoleAssignments.some((existingAssignment) =>
          areAssignmentsDuplicate(existingAssignment, incomingAssignment)
        );
      });

    const mergedRoleAssignments = [
      ...existingRoleAssignments,
      ...desiredRoleAssignmentsWithoutDuplicates,
    ];

    const updatedData = {
      ...editedUser,
      roleAssignments: mergedRoleAssignments,
    } as BaseUserFormData;

    await mutation.mutateAsync(updatedData);
  };

  const isLoading =
    isEditedUserLoading || areUsersLoading || isUserWithDesiredRolesLoading;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='flex-1 w-full'>
          <Typography.P className='text-sm'>{t('importRoles')}</Typography.P>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className='flex flex-col items-center gap-2'>
          <div
            className='flex size-9 shrink-0 items-center justify-center rounded-full border'
            aria-hidden='true'
          >
            <CloudDownload className='opacity-80' size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className='sm:text-center'>
              {t('importRoles')}
            </DialogTitle>
            <DialogDescription className='sm:text-center'>
              {t('importRolesDescription')}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='rounded-md border px-4 py-3'>
          <div className='flex gap-3'>
            <InfoIcon
              className='mt-0.5 shrink-0 opacity-60 text-blue-500'
              size={16}
              aria-hidden='true'
            />
            <div className='grow space-y-1'>
              <p className='text-sm font-medium'>{t('modalWorkInfo')}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='users-select'>
              {t('usersSelect')}
              <span className='ml-1 text-destructive'>*</span>
            </Label>
            <PaginatedCombobox
              id='users-select'
              items={mappedUsers}
              isLoading={isLoading}
              value={selectedUserId}
              onChange={setSelectedUserId}
              selectText={t('selectUserPlaceholder')}
              searchText={t('searchUserPlaceholder')}
              notFoundText={t('noUsersFound')}
            />
          </div>

          <DialogFooter className='pt-4 sm:justify-between gap-2'>
            <DialogClose asChild>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                disabled={mutation.isPending}
              >
                {t('cancel')}
              </Button>
            </DialogClose>
            <Button
              type='submit'
              className='flex-1'
              disabled={mutation.isPending || isLoading || !selectedUserId}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {t('saving')}
                </>
              ) : (
                t('importRoles')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
