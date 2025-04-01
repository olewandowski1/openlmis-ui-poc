import { Skeleton } from '@/components/ui/skeleton';

export const RoleRightsPickerSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2'>
      {Array.from({ length: 18 }).map((_, index) => (
        <Skeleton key={index} className='w-full h-14' />
      ))}
    </div>
  );
};
