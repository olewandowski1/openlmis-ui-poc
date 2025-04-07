import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { EditRoleBreadcrumbs } from '@/features/roles/components/edit-role-breadcrumbs';
import { RoleDetailsSkeleton } from '@/features/roles/components/role-details-skeleton';
import { RoleForm } from '@/features/roles/components/role-form';
import { useRole } from '@/features/roles/hooks/use-role';
import { updateRole } from '@/features/roles/lib/api';
import { BaseRoleFormData } from '@/features/roles/lib/schemas';
import { queryKeys } from '@/lib/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const Route = createFileRoute('/(app)/_app/roles/$roleId/edit')({
  component: EditRolePage,
});

function EditRolePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { roleId } = useParams({ from: '/(app)/_app/roles/$roleId/edit' });
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
  });
  const { role, isLoading } = useRole(roleId);

  const roleRightType = role?.rights[0].type;

  const mutation = useMutation({
    mutationFn: (updatedData: BaseRoleFormData) =>
      updateRole(roleId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.roles] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.role, roleId] });

      toast.success(t('updateRoleSuccess'));
      navigate({ to: '/roles' });
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
        toast.error(t('updateRoleError'));
      }
    },
  });

  const handleSubmit = async (data: BaseRoleFormData) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading) {
    return <RoleDetailsSkeleton />;
  }

  if (!roleRightType) {
    console.error('[EDIT_ROLE_PAGE]: Role rights type is missing');
    return null;
  }

  return (
    <>
      <title> OpenLMIS - Edit Role </title>

      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <div className='size-8 flex justify-center items-center rounded-md bg-gradient-to-br from-accent/60 to-accent'>
          <ShieldCheck size={18} />
        </div>
        <Typography.H1>{t('editRolePageTitle')}</Typography.H1>
      </div>
      <Separator />
      <EditRoleBreadcrumbs />
      <Separator />
      <div className='flex flex-col gap-4 p-2 md:p-4'>
        <RoleForm
          mode='edit'
          initialData={role}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          rightType={roleRightType}
        />
      </div>
    </>
  );
}
