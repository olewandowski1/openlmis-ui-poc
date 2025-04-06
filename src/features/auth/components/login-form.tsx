import { LanguagePicker } from '@/components/language-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { useAuthActions } from '@/features/auth/hooks/use-auth-actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { TFunction } from 'i18next';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schemaWithTranslations = (
  t: TFunction<'translation', 'auth.LoginForm'>
) => {
  return z.object({
    username: z
      .string()
      .min(1, { message: t('usernameRequired') })
      .max(255, {
        message: t('maxLengthExceeded', { max: 255 }),
      }),
    password: z.string().min(1, { message: t('passwordRequired') }),
  });
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthActions();

  const { t } = useTranslation('translation', { keyPrefix: 'auth.LoginForm' });
  const loginSchema = schemaWithTranslations(t);

  type LoginFormData = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
    navigate({ to: '/home' });
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col'>
                  <h1 className='text-2xl font-bold'>{t('title')}</h1>
                  <p className='text-sm text-balance text-muted-foreground'>
                    {t('subtitle')}
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center justify-between h-5'>
                        <Typography.P>
                          {t('usernameLabel')}
                          <span className='ml-1 text-destructive'>*</span>
                        </Typography.P>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('usernamePlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center justify-between h-5'>
                        <Typography.P>
                          {t('passwordLabel')}

                          <span className='ml-1 text-destructive'>*</span>
                        </Typography.P>
                        {/* TODO: Uncomment when forgot password implemented */}
                        {/* <a
                          href='#'
                          className='ml-auto text-sm underline-offset-2 hover:underline text-muted-foreground'
                        >
                          {t('forgotPassword')}
                        </a> */}
                      </FormLabel>
                      <FormControl className='relative'>
                        <Input
                          placeholder={t('passwordPlaceholder')}
                          type='password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full'
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2
                        size={16}
                        strokeWidth={2}
                        className='animate-spin'
                      />
                      {t('loginButtonLoading')}
                    </>
                  ) : (
                    <> {t('loginButton')} </>
                  )}
                </Button>
                <div className='relative text-sm text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                  <span className='relative z-10 px-2 bg-card text-muted-foreground'>
                    {t('preferences')}
                  </span>
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center justify-between'>
                    <Typography.P>{t('language')}</Typography.P>
                    <LanguagePicker />
                  </div>
                </div>
              </div>
            </form>
            <div className='relative hidden md:block bg-primary/5'>
              <img
                src='/olmis.png'
                alt='OpenLMIS Logo'
                className='absolute inset-0 object-cover top-[40%] translate-y-[-50%] right-0 left-0 m-auto'
              />
            </div>
          </Form>
        </CardContent>
      </Card>
      <div className='text-balance italic text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
        {t('poweredBy')}{' '}
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://openlmis.org/'
        >
          {t('appName')}
        </a>
        .
      </div>
    </div>
  );
};
