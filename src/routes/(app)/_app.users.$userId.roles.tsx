import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { UserRolesBreadcrumbs } from '@/components/userRoles/user-roles-breadcrumbs';
import { UserRolesManagement } from '@/components/userRoles/user-roles-management';
import { UserRolesPageSkeleton } from '@/components/userRoles/user-roles-skeleton';
import { usePrograms } from '@/features/programs/hooks/use-programs';
import { useRoles } from '@/features/roles/hooks/use-roles';
import { useSupervisoryNodes } from '@/features/supervisoryNodes/hooks/use-supervisory-nodes';
import { useUser } from '@/features/users/hooks/use-user';
import { updateUser } from '@/features/users/lib/api';
import { BaseUserFormData } from '@/features/users/lib/schemas';
import { useMinimalFacilities } from '@/hooks/use-minimal-facilities';
import { ALL_RIGHT_TYPES } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

const searchParamSchema = z.object({
  type: z.enum(ALL_RIGHT_TYPES),
  rolesImported: z.boolean().optional(),
});

export const Route = createFileRoute('/(app)/_app/users/$userId/roles')({
  component: UserRolesPage,
  validateSearch: searchParamSchema,
});

function UserRolesPage() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.UserRoles',
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userId } = useParams({ from: '/(app)/_app/users/$userId/roles' });
  const { type } = useSearch({
    from: '/(app)/_app/users/$userId/roles',
  });
  const { user, isLoading: isUserLoading } = useUser(userId);
  const { supervisoryNodes, isLoading: isSupervisoryNodesLoading } =
    useSupervisoryNodes();
  const { programs, isLoading: isProgramsLoading } = usePrograms();
  const {
    minimalFacilities: supplyingFacilities,
    isLoading: isSupplyingFacilitiesLoading,
  } = useMinimalFacilities();
  const { roles, isLoading: isRolesLoading } = useRoles();
  const isLoading =
    isUserLoading ||
    isRolesLoading ||
    isSupervisoryNodesLoading ||
    isProgramsLoading ||
    isSupplyingFacilitiesLoading;

  const availableRoles = useMemo(() => {
    if (!roles) {
      return [];
    }

    return roles.filter((role) =>
      role.rights.some((right) => right.type === type)
    );
  }, [roles, type]);

  const mutation = useMutation({
    mutationFn: (updatedData: BaseUserFormData) =>
      updateUser(userId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.user, userId] });

      toast.success(t('updateUserSuccess'));
      navigate({ to: '/users' });
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      const axiosResponseData = axiosError.response?.data as {
        messageKey: string;
        message: string;
      };

      if (axiosError.status === 400 && axiosResponseData?.messageKey) {
        toast.error(t(axiosResponseData.messageKey));
      } else {
        toast.error(t('updateUserError'));
      }
    },
  });

  const handleSubmit = async (data: BaseUserFormData) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading) {
    return <UserRolesPageSkeleton />;
  }

  if (!type || !user) {
    console.error('[USER_ROLES_PAGE]: Error getting user or type');
    return null;
  }

  return (
    <>
      <title> OpenLMIS - User Roles </title>

      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <div className='size-8 flex justify-center items-center rounded-md bg-gradient-to-br from-accent/60 to-accent'>
          <ShieldCheck size={18} />
        </div>
        <Typography.H1>{t('manageUserRoles')}</Typography.H1>
      </div>
      <Separator />
      <UserRolesBreadcrumbs username={user?.username ?? ''} />
      <Separator />
      <div className='flex flex-col gap-2 p-2 md:p-4'>
        <UserRolesManagement
          initialData={user}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          currentType={type}
          availableRoles={availableRoles}
          programs={programs}
          supervisoryNodes={supervisoryNodes}
          supplyingFacilities={supplyingFacilities}
        />
      </div>
    </>
  );
}
