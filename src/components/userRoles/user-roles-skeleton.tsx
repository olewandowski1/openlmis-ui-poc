import { Skeleton } from '@/components/ui/skeleton';
import { ALL_RIGHT_TYPES } from '@/lib/constants';

export const UserRolesPageSkeleton = () => {
  return (
    <>
      {/* Header */}
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <Skeleton className='size-8 rounded-md' />
        <Skeleton className='h-7 w-48' />
      </div>
      <Skeleton className='h-px w-full' />

      {/* Breadcrumbs */}
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <Skeleton className='size-4 rounded-sm' />
        <Skeleton className='h-4 w-2' />
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-4 w-2' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-2' />
        <Skeleton className='h-4 w-12' />
      </div>
      <Skeleton className='h-px w-full' />

      {/* Main Content Area */}
      <div className='flex flex-col gap-2 p-2 md:p-4'>
        {/* Tabs */}
        <div className='flex gap-1 overflow-x-auto p-1'>
          {ALL_RIGHT_TYPES.map((type) => (
            <Skeleton key={type} className='h-7 w-24 rounded-full' />
          ))}
        </div>
        <Skeleton className='h-px w-full' />

        {/* Add Role Form */}
        <div className='p-4 border rounded-md bg-muted/40 space-y-2.5 mt-2'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-48' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5'>
            {/* Role Input */}
            <div className='space-y-1'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-9 w-full' />
            </div>
            {/* Conditional Input 1 (e.g., Program) */}
            <div className='space-y-1'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-9 w-full' />
            </div>
            {/* Conditional Input 2 (e.g., Node) */}
            <div className='space-y-1'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-9 w-full' />
            </div>
          </div>
          {/* Add Button */}
          <Skeleton className='h-8 w-full' />
        </div>

        <Skeleton className='h-px w-full' />

        {/* Data Table Section */}
        <div className='space-y-2'>
          {/* Filters/Actions */}
          <div className='flex flex-col md:flex-row md:justify-between w-full gap-2 py-2 md:py-0'>
            <Skeleton className='h-9 min-w-60 md:min-w-72' />
            <Skeleton className='h-9 w-full md:w-48' />
          </div>

          {/* Table */}
          <div className='bg-background overflow-hidden rounded-md border'>
            <Skeleton className='h-36 w-full' />
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-end gap-4 pt-2'>
            <Skeleton className='h-5 w-12' />
            <div className='flex gap-2'>
              <Skeleton className='size-8' />
              <Skeleton className='size-8' />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='md:col-span-2 flex flex-col gap-2 lg:flex-row-reverse mt-4'>
          <Skeleton className='h-10 flex-1' />
          <Skeleton className='h-10 flex-1' />
        </div>
      </div>
    </>
  );
};
