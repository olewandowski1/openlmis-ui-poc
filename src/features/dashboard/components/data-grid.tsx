import { Typography } from '@/components/ui/typography';
import { LucideIcon } from 'lucide-react';

type DataCardProps = {
  title: string;
  subtitle: string;
  value: number;
  icon: LucideIcon;
};

const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  value,
  icon: Icon,
}) => {
  return (
    <div className='p-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar'>
      <div className='flex flex-row items-center justify-between'>
        <div>
          <Typography.P className='font-semibold text-md'>{title}</Typography.P>
          <Typography.P className='text-xs leading-tight text-muted-foreground'>
            {subtitle}
          </Typography.P>
        </div>
        <div className='flex items-center justify-center border rounded-full size-8 shrink-0 bg-primary/25 border-primary/50 text-primary'>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>

      <Typography.P className='mt-2 text-3xl font-extrabold'>
        {value}
      </Typography.P>
    </div>
  );
};

type DataGridProps = {
  data: DataCardProps[];
};

export const DataGrid: React.FC<DataGridProps> = ({ data }) => {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {data.map((card) => (
        <DataCard key={card.title} {...card} />
      ))}
    </div>
  );
};
