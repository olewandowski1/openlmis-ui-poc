import {
  ComboboxItem,
  PaginatedCombobox,
} from '@/components/paginated-combobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Typography } from '@/components/ui/typography';
import {
  MinimalFacility,
  Program,
  RightType,
  Role,
  RoleAssignment,
  SupervisoryNode,
} from '@/lib/types';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type UserRolesTypeAddFormProps = {
  currentType: RightType;
  availableRoles: Role[];
  onAddRole: (roleAssignment: RoleAssignment) => Promise<void>;
  programs: Program[];
  supervisoryNodes: SupervisoryNode[];
  supplyingFacilities: MinimalFacility[];
};

const adaptToComboboxItem = <T extends { id: string; name: string }>(
  items: T[]
): ComboboxItem[] => {
  return items.map((item) => ({ id: item.id, name: item.name }));
};

export const UserRolesTypeAddForm: React.FC<UserRolesTypeAddFormProps> = ({
  availableRoles,
  onAddRole,
  currentType,
  programs,
  supervisoryNodes,
  supplyingFacilities,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.UserRoles',
  });

  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [selectedSupervisoryNodeId, setSelectedSupervisoryNodeId] =
    useState<string>('');
  const [selectedSupplyingFacilityId, setSelectedSupplyingFacilityId] =
    useState<string>('');

  useEffect(() => {
    setSelectedProgramId('');
    setSelectedSupervisoryNodeId('');
    setSelectedSupplyingFacilityId('');
    setSelectedRoleId('');
  }, [currentType]);

  const roleItems = useMemo(
    () => adaptToComboboxItem(availableRoles),
    [availableRoles]
  );
  const programItems = useMemo(() => adaptToComboboxItem(programs), [programs]);
  const nodeItems = useMemo(
    () => adaptToComboboxItem(supervisoryNodes),
    [supervisoryNodes]
  );
  const facilityItems = useMemo(
    () => adaptToComboboxItem(supplyingFacilities),
    [supplyingFacilities]
  );

  const isSubmitDisabled = (): boolean => {
    if (!selectedRoleId) return true;

    switch (currentType) {
      case 'SUPERVISION':
        return !selectedProgramId;
      case 'ORDER_FULFILLMENT':
        return !selectedSupplyingFacilityId;
      case 'REPORTS':
        return false;
      case 'GENERAL_ADMIN':
        return false;
      default:
        return true;
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (isSubmitDisabled()) {
      console.error(
        'Form validation failed: Missing required fields. Trigger external error notification.'
      );
      return;
    }

    const newRoleAssignment: RoleAssignment = {
      roleId: selectedRoleId,
    };

    switch (currentType) {
      case 'SUPERVISION':
        newRoleAssignment.programId = selectedProgramId;
        newRoleAssignment.supervisoryNodeId = selectedSupervisoryNodeId;
        break;
      case 'ORDER_FULFILLMENT':
        newRoleAssignment.warehouseId = selectedSupplyingFacilityId;
        break;
    }

    try {
      await onAddRole(newRoleAssignment as RoleAssignment);

      setSelectedRoleId('');
      setSelectedProgramId('');
      setSelectedSupervisoryNodeId('');
      setSelectedSupplyingFacilityId('');
    } catch (error) {
      console.error('Failed to add role assignment:', error);
    }
  };

  return (
    <div className='p-4 border rounded-md bg-muted/40'>
      <Typography.H3 className='text-lg font-semibold'>
        {t('addRoleTitle')}
      </Typography.H3>
      <Typography.Muted className='mb-2'>
        {' '}
        {t('addRoleDescription')}{' '}
      </Typography.Muted>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5'>
          {/* Role */}
          <div className='space-y-1.5'>
            <Label htmlFor='role-select'>
              {t('roleLabel')}
              <span className='ml-1 text-destructive'>*</span>
            </Label>
            <PaginatedCombobox
              id='role-select'
              items={roleItems}
              value={selectedRoleId}
              onChange={setSelectedRoleId}
              selectText={t('selectRolePlaceholder')}
              searchText={t('searchRolePlaceholder')}
              notFoundText={t('noRolesFound')}
            />
          </div>

          {/* Program (Conditional) */}
          {currentType === 'SUPERVISION' && (
            <div className='space-y-1.5'>
              <Label htmlFor='program-select'>
                {t('programLabel')}{' '}
                <span className='ml-1 text-destructive'>*</span>
              </Label>
              <PaginatedCombobox
                id='program-select'
                items={programItems}
                value={selectedProgramId}
                onChange={setSelectedProgramId}
                selectText={t('selectProgramPlaceholder')}
                searchText={t('searchProgramPlaceholder')}
                notFoundText={t('noProgramsFound')}
              />
            </div>
          )}

          {/* Supervisory Node (Conditional) */}
          {currentType === 'SUPERVISION' && (
            <div className='space-y-1.5'>
              <Label htmlFor='node-select'>{t('nodeLabel')}</Label>
              <PaginatedCombobox
                id='node-select'
                items={nodeItems}
                value={selectedSupervisoryNodeId}
                onChange={setSelectedSupervisoryNodeId}
                selectText={t('selectNodePlaceholder')}
                searchText={t('searchNodePlaceholder')}
                notFoundText={t('noNodesFound')}
              />
            </div>
          )}

          {/* Supplying Facility (Conditional) */}
          {currentType === 'ORDER_FULFILLMENT' && (
            <div className='space-y-1.5'>
              <Label htmlFor='facility-select'>
                {t('facilityLabel')}{' '}
                <span className='ml-1 text-destructive'>*</span>
              </Label>
              <PaginatedCombobox
                id='facility-select'
                items={facilityItems}
                value={selectedSupplyingFacilityId}
                onChange={setSelectedSupplyingFacilityId}
                selectText={t('selectFacilityPlaceholder')}
                searchText={t('searchFacilityPlaceholder')}
                notFoundText={t('noFacilitiesFound')}
              />
            </div>
          )}
        </div>
        {/* Submit Button */}
        <div>
          <Button
            type='submit'
            className='w-full mt-2'
            disabled={isSubmitDisabled()}
          >
            {t('addRoleButton')}
          </Button>
        </div>
      </form>
    </div>
  );
};
