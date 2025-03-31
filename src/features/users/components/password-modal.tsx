import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetUserPassword } from '@/features/users/lib/api';
import { usePasswordModal } from '@/features/users/store/password-modal';
import { queryKeys } from '@/lib/query-keys';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { TFunction } from 'i18next';
import { KeyRoundIcon, Loader2 } from 'lucide-react';
import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

const passwordSchema = (t: TFunction<'translation', 'app.Users'>) =>
  z.object({
    newPassword: z.string().min(1, { message: t('passwordRequired') }),
  });

type PasswordFormData = z.infer<ReturnType<typeof passwordSchema>>;

export const PasswordResetModal = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isOpen, close: closeModal, username } = usePasswordModal();
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Users',
  });

  const formSchema = passwordSchema(t);
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  const newPasswordId = useId();

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const mutation = useMutation({
    mutationFn: (data: PasswordFormData) => {
      if (!username) throw new Error('Username is missing for password reset.');
      return resetUserPassword(username, data.newPassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      toast.success(t('resetPasswordSuccess'));
      navigate({ to: '/users' });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    await mutation.mutateAsync(data);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openState) => !openState && closeModal()}
    >
      <DialogContent className='sm:max-w-md'>
        <div className='flex flex-col items-center gap-2 pt-4'>
          <div
            className='flex size-9 shrink-0 items-center justify-center rounded-full border border-border'
            aria-hidden='true'
          >
            <KeyRoundIcon className='opacity-80' size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className='text-center'>Set New Password</DialogTitle>
            <DialogDescription className='text-center'>
              Enter a new password for user{' '}
              <span className='font-medium text-foreground'>{username}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 pt-2'
          >
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem className='space-y-1.5'>
                  <FormLabel htmlFor={newPasswordId}>New Password</FormLabel>
                  <FormControl>
                    <Input
                      id={newPasswordId}
                      type='password'
                      placeholder='Enter new password'
                      disabled={mutation.isPending}
                      aria-required='true'
                      aria-invalid={
                        !!form.formState.errors.newPassword ||
                        !!form.formState.errors.root?.serverError
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.serverError && (
              <p className='text-sm text-destructive text-center'>
                {form.formState.errors.root.serverError.message}
              </p>
            )}

            <DialogFooter className='pt-4 sm:justify-between gap-2'>
              <DialogClose asChild>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1'
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='submit'
                className='flex-1'
                disabled={!form.formState.isValid || mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save New Password'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
