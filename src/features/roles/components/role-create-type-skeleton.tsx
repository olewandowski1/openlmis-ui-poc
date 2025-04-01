import { Skeleton } from '@/components/ui/skeleton';

export const RoleCreateTypeSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className='h-24' />
      ))}
    </div>
  );
};
