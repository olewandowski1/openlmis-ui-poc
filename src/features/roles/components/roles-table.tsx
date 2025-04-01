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
import { useCreateColumns } from '@/features/roles/components/roles-table-columns';
import { useRoles } from '@/features/roles/hooks/use-roles';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ColumnFiltersState,
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  Loader2,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const RolesTable = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { roles, isLoading } = useRoles();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const isMobile = useIsMobile();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    description: !isMobile,
    count: !isMobile,
    type: !isMobile,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'name',
      desc: false,
    },
  ]);
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Roles',
  });

  const columns = useCreateColumns();

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const showTableResults = !isLoading && table.getRowModel().rows.length > 0;
  const showNoResults = !isLoading && table.getRowModel().rows.length === 0;

  useEffect(() => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      description: !isMobile,
      count: !isMobile,
      type: !isMobile,
    }));
  }, [isMobile]);

  return (
    <>
      <div className='space-y-4'>
        <div className='flex flex-col md:flex-row md:justify-between w-full gap-3 py-2 md:py-0'>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <Input
                id={`search-input`}
                ref={inputRef}
                className={cn(
                  'peer min-w-72 ps-8 h-9 bg-gradient-to-br from-accent/60 to-accent w-full',
                  Boolean(table.getColumn('name')?.getFilterValue()) && 'pe-8'
                )}
                value={
                  (table.getColumn('name')?.getFilterValue() ?? '') as string
                }
                onChange={(e) =>
                  table.getColumn('name')?.setFilterValue(e.target.value)
                }
                placeholder={t('searchByRoleName')}
                type='text'
                aria-label={t('searchByRoleName')}
              />
              <div className='absolute inset-y-0 flex items-center justify-center pointer-events-none start-0 ps-2 text-muted-foreground/60 peer-disabled:opacity-50'>
                <ShieldCheck size={16} aria-hidden='true' />{' '}
              </div>
              {Boolean(table.getColumn('name')?.getFilterValue()) && (
                <button
                  className='absolute inset-y-0 flex items-center justify-center h-full transition-colors end-0 w-9 rounded-e-sm text-muted-foreground/60 outline-offset-2 hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  aria-label={t('clearFilter')}
                  onClick={() => {
                    table.getColumn('name')?.setFilterValue('');
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <X size={16} aria-hidden='true' />
                </button>
              )}
            </div>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='flex-1 w-full'>
                  <Eye
                    className='-ms-1 opacity-60'
                    size={16}
                    aria-hidden='true'
                  />
                  <Typography.P className='text-sm'>
                    {t('columns')}
                  </Typography.P>
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

            <Button asChild className='flex-1 w-full'>
              <Link to='/'>
                <Plus
                  className='-ms-1 opacity-60'
                  size={16}
                  aria-hidden='true'
                />
                <Typography.P className='text-sm'>{t('addRole')}</Typography.P>
              </Link>
            </Button>
          </div>
        </div>
        <Table className='table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b'>
          <tbody aria-hidden='true' className='table-row h-1'></tbody>

          {/* Table Columns */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className='relative select-none h-10 bg-sidebar border-y border-border first:border-l first:rounded-l-sm last:border-r last:rounded-r-sm'
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          'flex h-full cursor-pointer select-none items-center gap-3'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (
                            (e.key === 'Enter' || e.key === ' ') &&
                            header.column.getCanSort()
                          ) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                        aria-label={t('sortBy', { column: header.column.id })}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <ChevronUp
                              className='shrink-0 opacity-60'
                              size={16}
                              aria-hidden='true'
                            />
                          ),
                          desc: (
                            <ChevronDown
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
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Rows */}
          <TableBody>
            {showTableResults &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='border-0 [&:first-child>td:first-child]:rounded-tl-sm [&:first-child>td:last-child]:rounded-tr-sm [&:last-child>td:first-child]:rounded-bl-sm [&:last-child>td:last-child]:rounded-br-sm h-px hover:bg-accent/50'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='last:py-0 h-[inherit]'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Loading / No Results State */}
        {(isLoading || showNoResults) && (
          <div className='flex flex-col items-center gap-1'>
            {isLoading ? (
              <>
                <Loader2 className='size-6 animate-spin' />
                <span className='sr-only'>{t('loading')}</span>
              </>
            ) : (
              <Typography.Small>{t('noResults')}</Typography.Small>
            )}
          </div>
        )}

        {/* Pagination */}
        {table.getRowModel().rows.length > 0 && (
          <div className='flex items-center justify-between gap-3'>
            <Typography.P
              className='flex-1 text-sm whitespace-nowrap text-muted-foreground'
              aria-live='polite'
            >
              {t('pagination', {
                current: table.getState().pagination.pageIndex + 1,
                total: table.getPageCount(),
              })}
            </Typography.P>

            <Pagination className='w-auto'>
              <PaginationContent className='gap-2'>
                <PaginationItem>
                  <Button
                    variant='outline'
                    className='aria-disabled:pointer-events-none aria-disabled:opacity-50 group'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label={t('previousPage')}
                  >
                    <ChevronLeft
                      className='-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5'
                      size={16}
                      aria-hidden='true'
                    />
                    <Typography.P className='hidden text-sm md:block'>
                      {t('previous')}
                    </Typography.P>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant='outline'
                    className='aria-disabled:pointer-events-none aria-disabled:opacity-50 group'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label={t('nextPage')}
                  >
                    <Typography.P className='hidden text-sm md:block'>
                      {t('next')}
                    </Typography.P>
                    <ChevronRight
                      className='-me-1 opacity-60 transition-transform group-hover:translate-x-0.5'
                      size={16}
                      aria-hidden='true'
                    />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
};
