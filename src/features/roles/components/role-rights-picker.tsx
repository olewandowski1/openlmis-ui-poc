import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RoleRightsPickerSkeleton } from '@/features/roles/components/role-rights-picker-skeleton';
import { useRoleRights } from '@/features/roles/hooks/use-role-rights';
import { Right, RightType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

type RoleRightsPickerProps = {
  rightType: RightType;
  value: Right[];
  onChange: (value: Right[]) => void;
  disabled?: boolean;
};

export const RoleRightsPicker: React.FC<RoleRightsPickerProps> = ({
  rightType,
  value = [],
  onChange,
  disabled,
}) => {
  const {
    rights: availableRights,
    isLoading,
    isError,
  } = useRoleRights(rightType);
  const { t } = useTranslation('translation', { keyPrefix: 'app.Roles' });
  const baseId = useId();

  const handleCheckedChange = (
    checked: boolean | 'indeterminate',
    right: Right
  ) => {
    if (typeof checked !== 'boolean') {
      return;
    }

    let newValue: Right[];
    if (checked) {
      newValue = [...value, right];
    } else {
      newValue = value.filter((selectedRight) => selectedRight.id !== right.id);
    }
    onChange(newValue);
  };

  if (isLoading) {
    return <RoleRightsPickerSkeleton />;
  }

  if (isError) {
    return (
      <div className='rounded-md border px-4 py-3' role='alert'>
        <p className='text-sm'>
          <CircleAlert
            className='me-3 -mt-0.5 inline-flex text-red-500'
            size={16}
            aria-hidden='true'
          />
          {t('errorLoadingRights')}
        </p>
      </div>
    );
  }

  if (!availableRights || availableRights.length === 0) {
    return (
      <div className='rounded-md border px-4 py-3' role='status'>
        <p className='text-sm'>
          <CircleAlert
            className='me-3 -mt-0.5 inline-flex text-muted-foreground'
            size={16}
            aria-hidden='true'
          />
          {t('noRightsAvailable')}
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
      {availableRights.map((right) => {
        const checkboxId = `${baseId}-${right.id}`;
        const descriptionId = `${checkboxId}-description`;
        const isChecked = value.some(
          (selectedRight) => selectedRight.id === right.id
        );
        const translatedName = t(`roleRights.${right.name}`);

        return (
          <div
            key={right.id}
            className={cn(
              'border has-data-[state=checked]:border-primary relative flex w-full items-start gap-2 rounded-md p-3 shadow-xs outline-none transition-colors',
              disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
              isChecked ? 'border-primary bg-primary/5' : 'border-input'
            )}
            data-state={isChecked ? 'checked' : 'unchecked'}
          >
            <Checkbox
              id={checkboxId}
              checked={isChecked}
              onCheckedChange={(checked) => handleCheckedChange(checked, right)}
              disabled={disabled}
              className='order-1 mt-0.5 after:absolute after:inset-0'
              aria-describedby={descriptionId}
            />
            <div className='grid grow gap-0.5'>
              <Label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium truncate',
                  disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                )}
              >
                {translatedName}
              </Label>
              <p id={descriptionId} className='text-muted-foreground text-xs'>
                {right.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
