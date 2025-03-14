import { DataGrid } from '@/features/dashboard/components/data-grid';
import { useFacilityData } from '@/features/dashboard/hooks/use-facility-data';

export const HomePageDashboard = () => {
  const { facilityData } = useFacilityData();

  return (
    <div className='mt-4'>
      <DataGrid data={facilityData} />
    </div>
  );
};
