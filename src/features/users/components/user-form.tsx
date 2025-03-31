import { PaginatedCombobox } from '@/components/paginated-combobox';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { Typography } from '@/components/ui/typography';
import { BaseUserFormData } from '@/features/users/lib/schemas';
import { UserData } from '@/features/users/lib/types';
import { useMinimalFacilities } from '@/hooks/use-minimal-facilities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { TFunction } from 'i18next';
import { Loader2 } from 'lucide-react';
import { useId } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

// Ensure this schema's structure matches `baseUserFormSchema`
const schemaWithTranslations = (
  t: TFunction<'translation', 'app.Users'>,
  mode: 'create' | 'edit'
) => {
  return z.object({
    username: z
      .string()
      .min(1, { message: t('usernameRequired') })
      .max(255, { message: t('maxLengthExceeded', { max: 255 }) }),
    email: z
      .string()
      .refine(
        (val) => val === '' || z.string().email().safeParse(val).success,
        {
          message: t('emailInvalid'),
        }
      )
      .optional()
      .or(z.literal('')),
    firstName: z
      .string()
      .min(1, { message: t('firstNameRequired') })
      .max(255, { message: t('maxLengthExceeded', { max: 255 }) }),
    lastName: z
      .string()
      .min(1, { message: t('lastNameRequired') })
      .max(255, { message: t('maxLengthExceeded', { max: 255 }) }),
    jobTitle: z
      .string()
      .max(255, { message: t('maxLengthExceeded', { max: 255 }) })
      .optional()
      .or(z.literal('')),
    phoneNumber: z
      .string()
      .max(255, { message: t('maxLengthExceeded', { max: 255 }) })
      .optional()
      .or(z.literal('')),
    enabled: z.boolean(),
    allowNotifications: z.boolean().optional(),
    emailVerified: z.boolean(),
    timezone: z.string().optional(),
    password: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => {
          // If mode is 'edit', the field is optional, so any value
          // (undefined, '', or a string) passes this specific check.
          if (mode === 'edit') {
            return true;
          }
          // If mode is 'create', the value MUST be a non-empty string.
          // The base type allows undefined or '', so we must check for that here.
          return typeof val === 'string' && val.length >= 1;
        },
        {
          // This message only applies if the refine fails (i.e., mode === 'create' and val is empty/undefined)
          message: t('passwordRequired'),
        }
      ),
    homeFacilityId: z.string().optional().or(z.literal('')),
  });
};

type UserFormProps = {
  initialData?: Partial<UserData>;
  onSubmit: (data: BaseUserFormData) => Promise<void> | void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
};

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'app.Users' });

  const userSchema = schemaWithTranslations(t, mode);

  type InternalUserFormData = z.infer<typeof userSchema>;

  const form: UseFormReturn<InternalUserFormData> =
    useForm<InternalUserFormData>({
      resolver: zodResolver(userSchema),
      defaultValues: {
        username: initialData?.username ?? '',
        email: initialData?.emailDetails?.email ?? '',
        firstName: initialData?.firstName ?? '',
        lastName: initialData?.lastName ?? '',
        jobTitle: initialData?.jobTitle ?? '',
        phoneNumber: initialData?.phoneNumber ?? '',
        enabled: initialData?.enabled ?? true,
        allowNotifications: initialData?.allowNotify ?? false,
        emailVerified: initialData?.emailDetails?.emailVerified ?? false,
        timezone: initialData?.timezone ?? '',
        password: '',
        homeFacilityId: initialData?.homeFacilityId ?? '',
      },
    });

  const handleFormSubmit = (data: InternalUserFormData) => {
    onSubmit(data);
  };

  const {
    data: minimalFacilities,
    isLoading: isMinimalFacilitiesLoading,
    isError: isMinimalFacilitiesError,
  } = useMinimalFacilities();

  const allowNotificationsId = useId();
  const allowNotificationsDescId = `${allowNotificationsId}-description`;
  const emailVerifiedId = useId();
  const emailVerifiedDescId = `${emailVerifiedId}-description`;
  const enabledId = useId();
  const enabledDescId = `${enabledId}-description`;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 w-full max-w-prose md:max-w-none'
      >
        {/* Left Column Group */}
        <div className='flex flex-col gap-4'>
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
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription />
              </FormItem>
            )}
          />

          {mode === 'create' && (
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
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder={t('passwordPlaceholder')}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between h-5'>
                  <Typography.P>{t('emailLabel')}</Typography.P>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('emailPlaceholder')}
                    disabled={isSubmitting}
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
            name='emailVerified'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-2'>
                <div className='space-y-0.5'>
                  <FormLabel htmlFor={emailVerifiedId} className='text-base'>
                    <Typography.P>{t('emailVerifiedLabel')}</Typography.P>
                  </FormLabel>
                  <FormDescription id={emailVerifiedDescId}>
                    <Typography.Small>
                      {t('emailVerifiedDescription')}
                    </Typography.Small>
                  </FormDescription>
                </div>
                <FormMessage />
                <FormControl>
                  <Switch
                    id={emailVerifiedId}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                    aria-describedby={emailVerifiedDescId}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between h-5'>
                  <Typography.P>
                    {t('firstNameLabel')}
                    <span className='ml-1 text-destructive'>*</span>
                  </Typography.P>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('firstNamePlaceholder')}
                    disabled={isSubmitting}
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
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between h-5'>
                  <Typography.P>
                    {t('lastNameLabel')}
                    <span className='ml-1 text-destructive'>*</span>
                  </Typography.P>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('lastNamePlaceholder')}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription />
              </FormItem>
            )}
          />
        </div>

        {/* Right Column Group */}
        <div className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='jobTitle'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between h-5'>
                  <Typography.P>{t('jobTitleLabel')}</Typography.P>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('jobTitlePlaceholder')}
                    disabled={isSubmitting}
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
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between h-5'>
                  <Typography.P>{t('phoneNumberLabel')}</Typography.P>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('phoneNumberPlaceholder')}
                    disabled={isSubmitting}
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
            name='enabled'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-2'>
                <div className='space-y-0.5'>
                  <FormLabel htmlFor={enabledId} className='text-base'>
                    <Typography.P>
                      {t('userEnabledLabel')}
                      <span className='ml-1 text-destructive'>*</span>
                    </Typography.P>
                  </FormLabel>
                  <FormDescription id={enabledDescId}>
                    <Typography.Small>
                      {t('userEnabledDescription')}
                    </Typography.Small>
                  </FormDescription>
                </div>
                <FormMessage />
                <FormControl>
                  <Switch
                    id={enabledId}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-describedby={enabledDescId}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {mode === 'edit' && (
            <FormField
              control={form.control}
              name='allowNotifications'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-2'>
                  <div className='space-y-0.5'>
                    <FormLabel
                      htmlFor={allowNotificationsId}
                      className='text-base'
                    >
                      <Typography.P>
                        {t('allowNotificationsLabel')}
                      </Typography.P>
                    </FormLabel>
                    <FormDescription
                      id={allowNotificationsDescId}
                      className='text-xs'
                    >
                      <Typography.Small>
                        {t('allowNotificationsDescription')}
                      </Typography.Small>
                    </FormDescription>
                  </div>
                  <FormMessage />
                  <FormControl>
                    <Switch
                      id={allowNotificationsId}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby={allowNotificationsDescId}
                      disabled={
                        isSubmitting ||
                        !form.getValues('emailVerified') ||
                        !form.getValues('email')
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name='homeFacilityId'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>
                  <Typography.P>{t('homeFacilityLabel')}</Typography.P>
                </FormLabel>
                <FormControl>
                  <PaginatedCombobox
                    items={minimalFacilities?.content ?? []}
                    value={field.value}
                    onChange={field.onChange}
                    isLoading={isMinimalFacilitiesLoading}
                    isError={isMinimalFacilitiesError}
                    disabled={isSubmitting}
                    selectText={t('selectFacility')}
                    searchText={t('homeFacilityPlaceholder')}
                    loadingText={t('loadingFacilities')}
                    errorText={t('errorLoadingFacilities')}
                    notFoundText={t('noFacilitiesFound')}
                    previousPageLabel={t('previousPage')}
                    nextPageLabel={t('nextPage')}
                    paginationInfoFormat={t('paginationPageInfo')}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  <Typography.Small>
                    ⚠️ {t('homeFacilityDescription')}
                  </Typography.Small>
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className='md:col-span-2 flex flex-col gap-2 lg:flex-row-reverse mt-4'>
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className='animate-spin' />
                {t('savingButtonLoading')}
              </>
            ) : mode === 'create' ? (
              t('createButton')
            ) : (
              t('saveButton')
            )}
          </Button>
          <Button
            variant='secondary'
            className='w-full'
            disabled={isSubmitting}
            asChild
          >
            <Link to='/users'>{t('cancelButton')}</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
