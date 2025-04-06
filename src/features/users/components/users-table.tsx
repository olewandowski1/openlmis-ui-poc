import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { useCreateColumns } from '@/features/users/components/users-table-columns';
import { useUsers } from '@/features/users/hooks/use-users';
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
  Trash,
  UserSearch,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const UsersTable = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { users, isLoading } = useUsers();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const isMobile = useIsMobile();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    active: !isMobile,
    firstName: !isMobile,
    lastName: !isMobile,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'username',
      desc: false,
    },
  ]);
  const { t } = useTranslation('translation', {
    keyPrefix: 'app.Users',
  });

  const columns = useCreateColumns();

  const usersData = useMemo(() => users ?? [], [users]);

  const table = useReactTable({
    data: usersData,
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
      active: !isMobile,
      firstName: !isMobile,
      lastName: !isMobile,
    }));
  }, [isMobile]);

  return (
    <>
      <div className='space-y-4'>
        <div className='flex flex-col w-full gap-3 py-2 md:flex-row md:justify-between md:py-0'>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <Input
                id={`search-input`}
                ref={inputRef}
                className={cn(
                  'peer min-w-72 ps-8 h-9 bg-gradient-to-br from-accent/60 to-accent w-full',
                  Boolean(table.getColumn('username')?.getFilterValue()) &&
                    'pe-8'
                )}
                value={
                  (table.getColumn('username')?.getFilterValue() ??
                    '') as string
                }
                onChange={(e) =>
                  table.getColumn('username')?.setFilterValue(e.target.value)
                }
                placeholder={t('searchByUsername')}
                type='text'
                aria-label={t('searchByUsername')}
                disabled={isLoading}
              />
              <div className='absolute inset-y-0 flex items-center justify-center pointer-events-none start-0 ps-2 text-muted-foreground/60 peer-disabled:opacity-50'>
                <UserSearch size={16} aria-hidden='true' />
              </div>
              {Boolean(table.getColumn('username')?.getFilterValue()) && (
                <button
                  className='absolute inset-y-0 flex items-center justify-center h-full transition-colors end-0 w-9 rounded-e-sm text-muted-foreground/60 outline-offset-2 hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                  aria-label={t('clearFilter')}
                  onClick={() => {
                    table.getColumn('username')?.setFilterValue('');
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
          <div className='flex flex-col items-center gap-3 md:flex-row'>
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className='flex-1 w-full ml-0 md:ml-auto'
                    variant='outline'
                  >
                    <Trash
                      className='-ms-1 me-2 opacity-60'
                      size={16}
                      aria-hidden='true'
                    />
                    {t('delete')}
                    <span className='-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70'>
                      {table.getSelectedRowModel().rows.length}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div className='flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4'>
                    <div
                      className='flex items-center justify-center border rounded-full size-9 shrink-0 border-border'
                      aria-hidden='true'
                    >
                      <Trash className='opacity-80' size={16} />
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t('deleteConfirmTitle')}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('deleteConfirmDescription', {
                          count: table.getSelectedRowModel().rows.length,
                          rows:
                            table.getSelectedRowModel().rows.length === 1
                              ? t('row')
                              : t('rows'),
                        })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {}}>
                      {t('delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

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
              <Link to='/users/create'>
                <Plus
                  className='-ms-1 opacity-60'
                  size={16}
                  aria-hidden='true'
                />
                <Typography.P className='text-sm'>{t('addUser')}</Typography.P>
              </Link>
            </Button>
          </div>
        </div>
        <Table className='table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b'>
          <tbody aria-hidden='true' className='table-row h-1'></tbody>

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className='relative h-10 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-sm last:border-r last:rounded-r-sm'
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
