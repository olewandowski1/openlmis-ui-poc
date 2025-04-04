import { Skeleton } from '@/components/ui/skeleton';
import { ALL_RIGHT_TYPES } from '@/lib/constants';

export const UserRolesPageSkeleton = () => {
  return (
    <>
      {/* Header */}
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <Skeleton className='size-8 rounded-md shrink-0' />
        <Skeleton className='h-7 w-32 md:w-48' />
      </div>
      <Skeleton className='h-px w-full' />

      {/* Breadcrumbs */}
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-1.5 md:gap-2 flex-wrap'>
        <Skeleton className='size-4 rounded-sm shrink-0' />
        <Skeleton className='h-4 w-1.5 md:w-2 shrink-0' />
        <Skeleton className='h-4 w-10 md:w-16' />
        <Skeleton className='h-4 w-1.5 md:w-2 shrink-0' />
        <Skeleton className='h-4 w-16 md:w-24' />
        <Skeleton className='h-4 w-1.5 md:w-2 shrink-0' />
        <Skeleton className='h-4 w-8 md:w-12' />
      </div>
      <Skeleton className='h-px w-full' />

      {/* Main Content Area */}
      <div className='flex flex-col gap-2 p-2 md:p-4'>
        {/* Tabs */}
        <div className='flex gap-1 overflow-x-auto p-1'>
          {ALL_RIGHT_TYPES.map((type) => (
            <Skeleton key={type} className='h-7 w-16 shrink-0 rounded-full' />
          ))}
        </div>
        <Skeleton className='h-px w-full' />

        {/* Add Role Form */}
        <div className='p-3 md:p-4 border rounded-md bg-muted/40 space-y-2.5 mt-2'>
          <Skeleton className='h-6 w-20 md:w-32' />
          <Skeleton className='h-4 w-32 md:w-48' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 md:gap-x-4 gap-y-4 md:gap-y-5 pt-1'>
            {/* Role Input */}
            <div className='space-y-1.5'>
              <Skeleton className='h-5 w-10 md:w-16' />
              <Skeleton className='h-10 w-full' />
            </div>
            {/* Conditional Input 1 */}
            <div className='space-y-1.5'>
              <Skeleton className='h-5 w-14 md:w-20' />
              <Skeleton className='h-10 w-full' />
            </div>
            {/* Conditional Input 2 */}
            <div className='space-y-1.5'>
              <Skeleton className='h-5 w-16 md:w-24' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>
          <Skeleton className='h-10 w-full mt-2' />
        </div>

        <Skeleton className='h-px w-full my-2' />

        {/* Data Table Section */}
        <div className='space-y-2'>
          {/* Filters/Actions Bar */}
          <div className='flex flex-col md:flex-row md:justify-between w-full gap-2 py-2 md:py-0'>
            <div className='flex-1 md:grow-0'>
              <Skeleton className='h-9 w-full md:w-64' />
            </div>
            <div className='flex items-center flex-col md:flex-row gap-2'>
              <Skeleton className='h-9 w-full md:w-24' />
              <Skeleton className='h-9 w-full md:w-20' />
            </div>
          </div>

          {/* Table Container */}
          <div className='bg-background overflow-x-auto rounded-md border'>
            <Skeleton className='h-36 w-full min-w-[240px]' />
          </div>

          {/* Pagination */}
          <div className='flex flex-col xs:flex-row items-center justify-between gap-3 xs:gap-8 pt-2'>
            <div className='flex w-full xs:w-auto xs:grow justify-center xs:justify-end'>
              <Skeleton className='h-5 w-16' />
            </div>
            <div className='flex w-full xs:w-auto justify-center xs:justify-start gap-2'>
              <Skeleton className='size-9 shrink-0' />
              <Skeleton className='size-9 shrink-0' />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col gap-2 lg:flex-row-reverse mt-4'>
          <Skeleton className='h-10 flex-1' />
          <Skeleton className='h-10 flex-1' />
        </div>
      </div>
    </>
  );
};
