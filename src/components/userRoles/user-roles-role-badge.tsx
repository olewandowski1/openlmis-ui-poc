import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Right } from '@/lib/types';
import { useTranslation } from 'react-i18next';
import { Typography } from '../ui/typography';

type UserRolesRoleBadgeProps = {
  roleName: string | undefined;
  rights: Right[] | undefined;
};

export const UserRolesRoleBadge: React.FC<UserRolesRoleBadgeProps> = ({
  roleName,
  rights,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
  });

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge> {roleName} </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <Typography.P className='text-sm font-semibold'>
          {t('rightsLabel')}
        </Typography.P>
        {rights?.map((right) => (
          <div key={right.id} className='flex items-center gap-1'>
            <Typography.Small className='font-light text-xs text-primary-foreground'>
              {t(`roleRights.${right.name}`)}
            </Typography.Small>
          </div>
        ))}
      </TooltipContent>
    </Tooltip>
  );
};
