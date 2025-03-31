import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { EditUserBreadcrumbs } from '@/features/users/components/edit-user-breadcrumbs';
import { UserDetailsSkeleton } from '@/features/users/components/user-details-skeleton';
import { UserForm } from '@/features/users/components/user-form';
import { useUser } from '@/features/users/hooks/use-user';
import { updateUser } from '@/features/users/lib/api';
import { BaseUserFormData } from '@/features/users/lib/schemas';
import { queryKeys } from '@/lib/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const Route = createFileRoute('/(app)/_app/users/$userId/edit')({
  component: EditUserPage,
});

function EditUserPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userId } = useParams({ from: '/(app)/_app/users/$userId/edit' });
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Users',
  });
  const { user, isLoading } = useUser(userId);

  const mutation = useMutation({
    mutationFn: (updatedData: BaseUserFormData) =>
      updateUser(userId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.user, userId] });

      toast.success(t('updateUserSuccess'));
      navigate({ to: '/users' });
    },
    onError: () => {
      toast.error(t('updateUserError'));
    },
  });

  const handleSubmit = async (data: BaseUserFormData) => {
    await mutation.mutateAsync(data);
  };

  if (isLoading) {
    return <UserDetailsSkeleton />;
  }

  return (
    <>
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <div className='size-8 flex justify-center items-center rounded-md bg-gradient-to-br from-accent/60 to-accent'>
          <User size={18} />
        </div>
        <Typography.H1>{t('editUserPageTitle')}</Typography.H1>
      </div>
      <Separator />
      <EditUserBreadcrumbs />
      <Separator />
      <div className='flex flex-col gap-4 p-2 md:p-4'>
        <UserForm
          mode='edit'
          initialData={user}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
        />
      </div>
    </>
  );
}
