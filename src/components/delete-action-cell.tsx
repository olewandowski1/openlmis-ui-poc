import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RoleAssignment } from '@/lib/types';
import { Row } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { Trash } from 'lucide-react';

type ActionCellProps<TData> = {
  row: Row<TData>;
  onRemove: (itemToRemove: TData) => void;
  t: TFunction;
  ariaLabelKey: string;
  tooltipKey: string;
  isMutationSubmitting?: boolean;
};

export const ActionCell = <TData extends RoleAssignment>({
  row,
  onRemove,
  t,
  ariaLabelKey,
  tooltipKey,
  isMutationSubmitting,
}: ActionCellProps<TData>) => {
  return (
    <div className='flex justify-end gap-2'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            variant='default'
            aria-label={t(ariaLabelKey)}
            onClick={() => onRemove(row.original)}
            disabled={isMutationSubmitting}
            aria-disabled={isMutationSubmitting}
          >
            <Trash size={16} aria-hidden='true' />
          </Button>
        </TooltipTrigger>
        <TooltipContent className='px-2 py-1 text-sm'>
          {t(tooltipKey)}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
