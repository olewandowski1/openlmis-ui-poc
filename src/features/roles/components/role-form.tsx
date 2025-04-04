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
import { Typography } from '@/components/ui/typography';
import { RoleRightsPicker } from '@/features/roles/components/role-rights-picker';
import { BaseRoleFormData } from '@/features/roles/lib/schemas';
import { RoleData } from '@/features/roles/lib/types';
import { ALL_RIGHT_TYPES } from '@/lib/constants';
import { RightType } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { TFunction } from 'i18next';
import { Loader2 } from 'lucide-react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const rightObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(ALL_RIGHT_TYPES),
  attachments: z.array(z.unknown()),
});

// Ensure this schema's structure matches `baseRoleFormData`
// It has to be split into two functions to allow for translations
const getRoleSchema = (t: TFunction<'translation', 'app.Roles'>) => {
  return z.object({
    name: z
      .string()
      .min(1, { message: t('nameRequired') })
      .max(255, { message: t('maxLengthExceeded', { max: 255 }) }),
    description: z
      .string()
      .max(255, { message: t('maxLengthExceeded', { max: 255 }) })
      .or(z.literal('')),
    rights: z.array(rightObjectSchema).default([]),
  });
};

type RoleFormProps = {
  initialData?: Partial<RoleData>;
  onSubmit: (data: BaseRoleFormData) => Promise<void> | void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
  rightType: RightType;
};

export const RoleForm: React.FC<RoleFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode,
  rightType,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'app.Roles' });
  const roleSchema = getRoleSchema(t);
  type InternalRoleFormData = z.infer<typeof roleSchema>;

  const form: UseFormReturn<InternalRoleFormData> =
    useForm<InternalRoleFormData>({
      resolver: zodResolver(roleSchema),
      defaultValues: {
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        rights: initialData?.rights ?? [],
      },
    });

  const handleFormSubmit = (data: InternalRoleFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 w-full'
      >
        {/* Left Column Group */}
        <div className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between h-5'>
                  <Typography.P>
                    {t('nameLabel')}
                    <span className='ml-1 text-destructive'>*</span>
                  </Typography.P>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('namePlaceholder')}
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
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between h-5'>
                  <Typography.P>
                    {t('descriptionLabel')}
                    <span className='ml-1 text-destructive'>*</span>
                  </Typography.P>
                </FormLabel>
                <FormControl>
                  {/* Consider using Textarea if descriptions are long */}
                  <Input
                    placeholder={t('descriptionPlaceholder')}
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

        {/* Rights Field - Spanning both columns on medium screens */}
        <div className='md:col-span-2'>
          <FormField
            control={form.control}
            name='rights'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='flex items-center justify-between h-5'>
                  <Typography.P>
                    {t('rightsLabel')}
                    <span className='ml-1 text-destructive'>*</span>
                  </Typography.P>
                </FormLabel>
                <FormDescription>
                  <Typography.Small>{t('rightsDescription')}</Typography.Small>
                </FormDescription>
                <FormControl>
                  <RoleRightsPicker
                    value={field.value}
                    onChange={field.onChange}
                    rightType={rightType}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit and Cancel Buttons */}
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
            <Link to='/roles'>{t('cancelButton')}</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
