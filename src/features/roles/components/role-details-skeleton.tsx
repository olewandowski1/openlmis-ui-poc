import { Skeleton } from '@/components/ui/skeleton';

export const RoleDetailsSkeleton = () => {
  return (
    <>
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <Skeleton className='size-8 rounded-md' />
        <Skeleton className='h-7 w-48' />
      </div>
      <Skeleton className='h-px w-full' />
      <div className='p-3 md:p-4 flex flex-row items-center justify-start gap-2'>
        <Skeleton className='size-4 rounded-sm' />
        <Skeleton className='h-4 w-2' />
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-4 w-2' />
        <Skeleton className='h-4 w-24' />
      </div>
      <Skeleton className='h-px w-full' />
      <div className='flex justify-start'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 w-full max-w-prose md:max-w-none p-4'>
          {/* Left Column Group */}
          <div className='flex flex-col gap-4'>
            {/* Username */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Email Verified */}
            <div className='flex flex-row items-center justify-between rounded-lg border p-2 h-[68px]'>
              <div className='space-y-2'>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-4 w-48' />
              </div>
              <Skeleton className='h-6 w-11 rounded-full' />
            </div>

            {/* First Name */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-28' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Last Name */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-28' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>

          {/* Right Column Group */}
          <div className='flex flex-col gap-4'>
            {/* Job Title */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Phone Number */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* Enabled */}
            <div className='flex flex-row items-center justify-between rounded-lg border p-2 h-[68px]'>
              <div className='space-y-2'>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='h-4 w-48' />
              </div>
              <Skeleton className='h-6 w-11 rounded-full' />
            </div>

            {/* Allow Notifications */}
            <div className='flex flex-row items-center justify-between rounded-lg border p-2 h-[68px]'>
              <div className='space-y-2'>
                <Skeleton className='h-5 w-40' />
                <Skeleton className='h-4 w-52' />
              </div>
              <Skeleton className='h-6 w-11 rounded-full' />
            </div>

            {/* Home Facility */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-28' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-10/12' />
              <Skeleton className='h-10 w-full' />
            </div>
          </div>

          {/* Buttons */}
          <div className='md:col-span-2 flex flex-col gap-2 lg:flex-row-reverse mt-4'>
            <Skeleton className='h-10 w-full lg:w-auto lg:flex-1' />{' '}
            <Skeleton className='h-10 w-full lg:w-auto lg:flex-1' />{' '}
          </div>
        </div>
      </div>
    </>
  );
};
