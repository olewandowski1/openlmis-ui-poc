import { Backpack, ListOrdered, Package, Pen } from 'lucide-react';

export const useFacilityData = () => {
  const facilityData = [
    {
      title: 'Requisition Updates',
      subtitle: 'The number of requisitions that have been updated.',
      value: 14_322,
      icon: Package,
    },
    {
      title: 'Requisition Created',
      subtitle: 'The number of requisitions that have been created.',
      value: 5_322,
      icon: Pen,
    },
    {
      title: 'Inventory',
      subtitle: 'The number of inventory items in the system.',
      value: 13,
      icon: Backpack,
    },
    {
      title: 'Orders',
      subtitle: 'The number of orders that have been placed.',
      value: 3_322,
      icon: ListOrdered,
    },
  ];

  return { facilityData };
};
