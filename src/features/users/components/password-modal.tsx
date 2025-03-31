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
import { Typography } from '@/components/ui/typography';
import { resetUserPassword } from '@/features/users/lib/api';
import { usePasswordModal } from '@/features/users/store/password-modal';
import { queryKeys } from '@/lib/query-keys';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TFunction } from 'i18next';
import { CircleAlertIcon, KeyRoundIcon, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

const passwordSchema = (t: TFunction<'translation', 'app.Users'>) =>
  z.object({
    newPassword: z
      .string()
      .min(8, { message: t('passwordMinLength') })
      .refine(
        (value) => {
          const hasNumber = /\d/.test(value);
          return hasNumber;
        },
        {
          message: t('passwordNumberRequired'),
        }
      ),
  });

type PasswordFormData = z.infer<ReturnType<typeof passwordSchema>>;

export const PasswordResetModal = () => {
  const queryClient = useQueryClient();
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
            <DialogTitle className='text-center'>
              {t('setNewPassword')}
            </DialogTitle>
            <DialogDescription className='text-center'>
              {t('setNewPasswordDescription', { username })}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='rounded-md border px-4 py-3'>
          <div className='flex gap-3'>
            <CircleAlertIcon
              className='mt-0.5 shrink-0 text-destructive opacity-60'
              size={16}
              aria-hidden='true'
            />
            <div className='grow space-y-1'>
              <p className='text-sm font-medium'>
                {t('passwordRequirementsTitle')}
              </p>
              <ul className='text-muted-foreground list-inside list-disc text-sm'>
                <li>{t('passwordRequirementsLength')}</li>
                <li>{t('passwordRequirementsCharacters')}</li>
              </ul>
            </div>
          </div>
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
                <FormItem>
                  <FormLabel className='flex items-center justify-between h-5'>
                    <Typography.P>
                      {t('newPasswordLabel')}
                      <span className='ml-1 text-destructive'>*</span>
                    </Typography.P>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={t('passwordPlaceholder')}
                      disabled={mutation.isPending}
                      aria-required='true'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={!form.formState.isValid || mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {t('saving')}
                  </>
                ) : (
                  t('saveNewPassword')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
