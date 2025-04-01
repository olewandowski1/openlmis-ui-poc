import { Skeleton } from '@/components/ui/skeleton';
import { RoleRightsPickerSkeleton } from '@/features/roles/components/role-rights-picker-skeleton';

export const RoleDetailsSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <Skeleton className='size-8 rounded-md' />
        <Skeleton className='h-7 w-48' />
      </div>
      <Skeleton className='h-px w-full' />

      {/* Breadcrumbs Skeleton */}
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <Skeleton className='size-4 rounded-sm' />
        <Skeleton className='h-5 w-2' />
        <Skeleton className='h-5 w-16' />
        <Skeleton className='h-5 w-2' />
        <Skeleton className='h-5 w-24' />
      </div>
      <Skeleton className='h-px w-full' />

      <div className='flex justify-start'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 w-full p-2 md:p-4'>
          {/* Left Column Group */}
          <div className='flex flex-col gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>

          {/* Right Column Group */}
          <div className='flex flex-col gap-4'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-28' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>

          {/* Rights Field - Spanning both columns */}
          <div className='md:col-span-2 space-y-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-4 w-48' />

            <RoleRightsPickerSkeleton />
          </div>

          {/* Buttons */}
          <div className='md:col-span-2 flex flex-col gap-2 lg:flex-row-reverse mt-4'>
            <Skeleton className='h-10 w-full lg:w-auto lg:flex-1' />
            <Skeleton className='h-10 w-full lg:w-auto lg:flex-1' />
          </div>
        </div>
      </div>
    </>
  );
};
