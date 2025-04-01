import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { CreateRoleBreadcrumbs } from '@/features/roles/components/create-role-breadcrumbs';
import { RoleForm } from '@/features/roles/components/role-form';
import { createRole } from '@/features/roles/lib/api';
import { BaseRoleFormData } from '@/features/roles/lib/schemas';
import { ALL_RIGHT_TYPES } from '@/lib/constants';
import { queryKeys } from '@/lib/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

const searchParamSchema = z.object({
  type: z.enum(ALL_RIGHT_TYPES),
});

export const Route = createFileRoute('/(app)/_app/roles/create')({
  component: CreateRolePage,
  validateSearch: searchParamSchema,
});

function CreateRolePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { type } = Route.useSearch();
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
  });

  const mutation = useMutation({
    mutationFn: (data: BaseRoleFormData) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.roles] });

      toast.success(t('createRoleSuccess'));
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
        toast.error(t('createUserError'));
      }
    },
  });

  const handleSubmit = async (data: BaseRoleFormData) => {
    await mutation.mutateAsync(data);
  };

  if (!type) {
    console.error('[CREATE_ROLE_PAGE]: Missing search param "type"');
    return null;
  }

  return (
    <>
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <div className='size-8 flex justify-center items-center rounded-md bg-gradient-to-br from-accent/60 to-accent'>
          <ShieldCheck size={18} />
        </div>
        <Typography.H1>{t('createRolePageTitle')}</Typography.H1>{' '}
      </div>
      <Separator />
      <CreateRoleBreadcrumbs />
      <Separator />
      <div className='flex flex-col gap-4 p-2 md:p-4'>
        <RoleForm
          mode='create'
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          rightType={type}
        />
      </div>
    </>
  );
}
