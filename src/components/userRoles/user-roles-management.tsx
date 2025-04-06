import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRolesTypeAddForm } from '@/components/userRoles/user-roles-type-add-form';
import { UserRolesTypeDataTable } from '@/components/userRoles/user-roles-type-data-table';
import { BaseUserFormData } from '@/features/users/lib/schemas';
import { UserData } from '@/features/users/lib/types';
import { ALL_RIGHT_TYPES } from '@/lib/constants';
import {
  MinimalFacility,
  Program,
  RightType,
  Role,
  RoleAssignment,
  SupervisoryNode,
} from '@/lib/types';
import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type UserRolesManagementProps = {
  initialData: UserData;
  onSubmit: (data: BaseUserFormData) => Promise<void> | void;
  isSubmitting: boolean;
  availableRoles: Role[];
  programs?: Program[];
  supervisoryNodes?: SupervisoryNode[];
  supplyingFacilities?: MinimalFacility[];
  currentType: RightType;
};

export const UserRolesManagement: React.FC<UserRolesManagementProps> = ({
  initialData,
  currentType,
  availableRoles,
  onSubmit,
  isSubmitting,
  programs,
  supervisoryNodes,
  supplyingFacilities,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.UserRoles',
  });

  const [localRoleAssignments, setLocalRoleAssignments] = useState<
    RoleAssignment[]
  >(initialData.roleAssignments ?? []);

  const handleSubmit = () => {
    const updatedData = {
      ...initialData,
      roleAssignments: localRoleAssignments,
    } as BaseUserFormData;

    onSubmit(updatedData);
  };

  const addRoleAssignment = async (
    newRoleAssignment: RoleAssignment
  ): Promise<void> => {
    // Check if the role is already assigned
    const isDuplicate = localRoleAssignments.some((localRoleAssignment) => {
      // Check if the roleId matches
      if (localRoleAssignment.roleId !== newRoleAssignment.roleId) {
        return false;
      }

      // If roleId matches, check type-specific fields
      switch (currentType) {
        case 'SUPERVISION':
          return (
            (localRoleAssignment.programId || '') ===
              (newRoleAssignment.programId || '') &&
            (localRoleAssignment.supervisoryNodeId || '') ===
              (newRoleAssignment.supervisoryNodeId || '')
          );

        case 'ORDER_FULFILLMENT':
          return (
            (localRoleAssignment.warehouseId || '') ===
            (newRoleAssignment.warehouseId || '')
          );
        case 'REPORTS':
          // For these types, matching roleId is enough to be a duplicate
          return true;
        case 'GENERAL_ADMIN':
          // For these types, matching roleId is enough to be a duplicate
          return true;
        default:
          // Fallback for unknown types: consider roleId match a duplicate
          console.warn(
            `Duplicate check fallback for unknown RightType: ${currentType}`
          );
          return true;
      }
    });

    if (isDuplicate) {
      const errorMsg = t('roleAlreadyAssigned');
      console.error(
        'Attempted to add a duplicate role assignment:',
        newRoleAssignment
      );
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (!newRoleAssignment || !newRoleAssignment.roleId) {
      const errorMsg = t('cannotAddEmptyRole');
      console.error(
        'Attempted to add an invalid role assignment:',
        newRoleAssignment
      );
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    setLocalRoleAssignments((prevState) => [...prevState, newRoleAssignment]);
    toast.success(t('roleAdded'));
  };

  const removeRoleAssignment = (roleAssignmentToRemove: RoleAssignment) => {
    // Get the current state to compare lengths later
    const currentState = localRoleAssignments;

    // Calculate the potential next state by filtering
    const nextState = currentState.filter((localRoleAssignment) => {
      // Check if the roleId matches.
      // If it doesn't match, keep the role assignment.
      // If it does match, we need to check the type of role assignment.
      if (localRoleAssignment.roleId !== roleAssignmentToRemove.roleId) {
        return true;
      }

      // If roleId matches, proceed with type-specific checks
      switch (currentType) {
        case 'SUPERVISION':
          // Keep if it's NOT the specific combination to remove
          return !(
            localRoleAssignment.programId ===
              roleAssignmentToRemove.programId &&
            localRoleAssignment.supervisoryNodeId ===
              roleAssignmentToRemove.supervisoryNodeId
          );

        case 'ORDER_FULFILLMENT':
          // Keep if it's NOT the specific combination to remove
          return !(
            localRoleAssignment.warehouseId ===
            roleAssignmentToRemove.warehouseId
          );

        case 'REPORTS':
          // If roleId matches for these types, it's the one to remove
          return false;
        case 'GENERAL_ADMIN':
          // If roleId matches for these types, it's the one to remove
          return false;

        default:
          // If the type is not recognized, keep the role assignment for safety
          console.error(
            `Unknown RightType '${currentType}' encountered during role removal. Keeping item.`
          );
          return true;
      }
    });

    // Check if the filter actually removed an item
    if (nextState.length < currentState.length) {
      setLocalRoleAssignments(nextState);
      toast.success(t('roleRemovedSuccess'));
    } else {
      toast.info(t('roleNotFoundToRemove'));
    }
  };

  useEffect(() => {
    // This effect runs when the component mounts AND whenever
    // initialData.roleAssignments changes reference/value.
    // This is necessary to ensure that the local state is in sync with the initial data after import.
    setLocalRoleAssignments(initialData.roleAssignments ?? []);
  }, [initialData.roleAssignments]);

  return (
    <>
      <Tabs defaultValue={currentType}>
        <ScrollArea>
          <TabsList className='gap-1 bg-transparent'>
            {/* Tab Triggers */}
            {ALL_RIGHT_TYPES.map((typeValue) => (
              <TabsTrigger
                key={typeValue}
                value={typeValue}
                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none'
                asChild
              >
                <Link
                  to='/users/$userId/roles'
                  params={{ userId: initialData.id }}
                  search={{ type: typeValue }}
                >
                  {t(`rightType.${typeValue}`)}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
        <Separator />
        {ALL_RIGHT_TYPES.map((typeValue) => {
          return (
            <TabsContent key={typeValue} value={typeValue}>
              <UserRolesTypeAddForm
                currentType={typeValue}
                availableRoles={availableRoles}
                programs={programs}
                supervisoryNodes={supervisoryNodes}
                supplyingFacilities={supplyingFacilities}
                onAddRole={addRoleAssignment}
              />

              <Separator className='my-2' />

              <UserRolesTypeDataTable
                currentType={typeValue}
                currentRoleAssignments={localRoleAssignments}
                availableRoles={availableRoles}
                programs={programs}
                supervisoryNodes={supervisoryNodes}
                supplyingFacilities={supplyingFacilities}
                onRemoveRole={removeRoleAssignment}
                isMutationSubmitting={isSubmitting}
              />
            </TabsContent>
          );
        })}
      </Tabs>
      {/* Action Buttons */}
      <div className='flex flex-col gap-2 mt-4 md:col-span-2 lg:flex-row-reverse'>
        <Button
          className='w-full'
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className='animate-spin' />
              {t('savingButtonLoading')}
            </>
          ) : (
            t('saveButton')
          )}
        </Button>
        <Button
          variant='secondary'
          className='w-full'
          disabled={isSubmitting}
          asChild
        >
          <Link to='/users'>{t('cancelButton')}</Link>
        </Button>
      </div>
    </>
  );
};
