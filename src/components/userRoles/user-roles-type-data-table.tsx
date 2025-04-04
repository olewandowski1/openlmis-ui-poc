import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { UserRolesImportModal } from '@/components/userRoles/user-roles-import-modal';
import { useCreateColumns } from '@/components/userRoles/user-roles-type-columns';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  MinimalFacility,
  Program,
  RightType,
  Role,
  RoleAssignment,
  SupervisoryNode,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Eye,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type UserRolesTypeDataTableProps = {
  currentType: RightType;
  currentRoleAssignments: RoleAssignment[];
  onRemoveRole: (roleAssignmentToRemove: RoleAssignment) => void;
  availableRoles: Role[];
  programs: Program[];
  supervisoryNodes: SupervisoryNode[];
  supplyingFacilities: MinimalFacility[];
  isMutationSubmitting: boolean;
};

export const UserRolesTypeDataTable: React.FC<UserRolesTypeDataTableProps> = ({
  currentType,
  currentRoleAssignments,
  onRemoveRole,
  availableRoles,
  programs,
  supervisoryNodes,
  supplyingFacilities,
  isMutationSubmitting,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.UserRoles',
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'roleName',
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    programName: !isMobile,
    supervisoryNodeName: !isMobile,
    warehouseName: !isMobile,
  });

  const columns = useCreateColumns(
    currentType,
    onRemoveRole,
    isMutationSubmitting
  );

  const filteredCurrentRoleAssignments = useMemo(
    () =>
      currentRoleAssignments.filter((roleAssignment) =>
        availableRoles.some((role) => role.id === roleAssignment.roleId)
      ),
    [currentRoleAssignments, availableRoles]
  );

  const roleAssignmentsToDisplay = useMemo(() => {
    const roleMap = new Map(availableRoles.map((role) => [role.id, role]));
    const programMap = new Map(
      programs.map((program) => [program.id, program])
    );
    const nodeMap = new Map(supervisoryNodes.map((node) => [node.id, node]));
    const facilityMap = new Map(
      supplyingFacilities.map((facility) => [facility.id, facility])
    );

    return filteredCurrentRoleAssignments.map((roleAssignment) => {
      const role = roleMap.get(roleAssignment.roleId || '');
      const program = programMap.get(roleAssignment.programId || '');
      const supervisoryNode = nodeMap.get(
        roleAssignment.supervisoryNodeId || ''
      );
      const supplyingFacility = facilityMap.get(
        roleAssignment.warehouseId || ''
      );

      return {
        roleId: roleAssignment.roleId,
        roleName: role?.name,
        warehouseId: roleAssignment.warehouseId,
        warehouseName: supplyingFacility?.name,
        supervisoryNodeId: roleAssignment.supervisoryNodeId,
        supervisoryNodeName: supervisoryNode?.name,
        programId: roleAssignment.programId,
        programName: program?.name,
        rights: role?.rights,
      } as RoleAssignment;
    });
  }, [
    filteredCurrentRoleAssignments,
    availableRoles,
    programs,
    supervisoryNodes,
    supplyingFacilities,
  ]);

  const table = useReactTable({
    data: roleAssignmentsToDisplay as RoleAssignment[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  useEffect(() => {
    setColumnVisibility((currentVisibility) => ({
      ...currentVisibility,
      programName: !isMobile,
      supervisoryNodeName: !isMobile,
      warehouseName: !isMobile,
    }));
  }, [isMobile]);

  const filterColumnId = 'roleName';
  const filterColumn = table.getColumn(filterColumnId);

  return (
    <div className='space-y-2'>
      <div className='flex flex-col md:flex-row md:justify-between w-full gap-2 py-2 md:py-0'>
        {/* Search Input */}
        <div className='relative flex-1 md:grow-0'>
          <Input
            id={`search-${filterColumnId}-input`}
            ref={inputRef}
            className={cn(
              'peer min-w-60 md:min-w-72 ps-8 h-9',
              Boolean(filterColumn?.getFilterValue()) && 'pe-8'
            )}
            value={(filterColumn?.getFilterValue() ?? '') as string}
            onChange={(e) => filterColumn?.setFilterValue(e.target.value)}
            placeholder={t('searchBy', {
              field: t(filterColumnId),
            })}
            type='text'
            aria-label={t('searchBy', { field: t(filterColumnId) })}
            disabled={!filterColumn || isMutationSubmitting}
          />
          <div className='absolute inset-y-0 flex items-center justify-center pointer-events-none start-0 ps-2 text-muted-foreground/60 peer-disabled:opacity-50'>
            <Search size={16} aria-hidden='true' />
          </div>
          {Boolean(filterColumn?.getFilterValue()) && (
            <button
              className='absolute inset-y-0 flex items-center justify-center h-full transition-colors end-0 w-9 rounded-e-sm text-muted-foreground/60 outline-offset-2 hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
              aria-label={t('clearFilter')}
              onClick={() => {
                filterColumn?.setFilterValue('');
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            >
              <X size={16} aria-hidden='true' />
            </button>
          )}
        </div>

        {/* Column Visibility Dropdown */}
        <div className='flex items-center flex-col md:flex-row gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='flex-1 w-full md:w-auto'>
                <Eye
                  className='-ms-1 me-1.5 opacity-60'
                  size={16}
                  aria-hidden='true'
                />
                <Typography.P className='text-sm'>{t('columns')}</Typography.P>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              sideOffset={4}
              className='w-(--radix-dropdown-menu-trigger-width)'
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {t(column.id)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <UserRolesImportModal />
        </div>
      </div>

      <div className='bg-background overflow-hidden rounded-md border'>
        <Table className='table-fixed'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.isPlaceholder
                          ? undefined
                          : `${header.getSize()}px`,
                      }}
                      className='h-11'
                    >
                      {/* Header rendering logic remains the same */}
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                          role='button'
                          aria-label={
                            header.column.getIsSorted() === 'asc'
                              ? t('sortByDescending')
                              : header.column.getIsSorted() === 'desc'
                                ? t('clearSort')
                                : t('sortByAscending')
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className='shrink-0 opacity-60'
                                size={16}
                                aria-hidden='true'
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className='shrink-0 opacity-60'
                                size={16}
                                aria-hidden='true'
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {filterColumn?.getFilterValue()
                    ? t('noResults')
                    : t('noRolesAssigned')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination (Keep existing logic, margin adjusted by parent div) --- */}
      {table.getRowModel().rows.length > 0 && (
        <div className='flex items-center justify-between gap-8'>
          {/* Page number information */}
          <div className='text-muted-foreground flex grow justify-end text-sm whitespace-nowrap'>
            <p
              className='text-muted-foreground text-sm whitespace-nowrap'
              aria-live='polite'
            >
              <span className='text-foreground'>
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  Math.max(
                    table.getState().pagination.pageIndex *
                      table.getState().pagination.pageSize +
                      table.getState().pagination.pageSize,
                    0
                  ),
                  table.getRowCount()
                )}
              </span>{' '}
              of{' '}
              <span className='text-foreground'>
                {table.getRowCount().toString()}
              </span>
            </p>
          </div>
          {/* Pagination controls */}
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size='icon'
                    variant='outline'
                    className='disabled:pointer-events-none disabled:opacity-50'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label={t('goToPreviousPage')}
                  >
                    <ChevronLeftIcon size={16} aria-hidden='true' />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size='icon'
                    variant='outline'
                    className='disabled:pointer-events-none disabled:opacity-50'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label={t('goToNextPage')}
                  >
                    <ChevronRightIcon size={16} aria-hidden='true' />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};
