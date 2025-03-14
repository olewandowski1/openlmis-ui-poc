import { Skeleton } from '@/components/ui/skeleton';

export const HomePageSkeleton = () => (
  <div className='flex flex-col gap-4 p-4'>
    <Skeleton className='w-48 h-6' />
    <Skeleton className='w-64 h-4' />
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className='h-36' />
      ))}
    </div>
  </div>
);
