import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Loader2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

/**
 * Defines the minimum shape required for items passed to the PaginatedCombobox.
 * Items must have at least an 'id' (string) and a 'name' (string).
 */
export type ComboboxItem = {
  id: string; // Unique identifier, used as the value
  name: string; // Text displayed and used for searching
  code?: string; // Optional additional identifier
};

/**
 * Props for the PaginatedCombobox component.
 * @template TItem The type of items in the list, must extend ComboboxItem.
 */
export type PaginatedComboboxProps<TItem extends ComboboxItem> = {
  /** The full list of items to paginate and filter. */
  items: TItem[];
  /** The currently selected item's ID (or '', null, undefined for no selection). */
  value: string | undefined | null;
  /** Function called with the selected item's ID (or '') when the selection changes. */
  onChange: (value: string) => void;
  /** Optional: Indicates if the items data is currently loading. */
  isLoading?: boolean;
  /** Optional: Indicates if there was an error loading the items data. */
  isError?: boolean;
  /** Optional: Number of items to display per page. Defaults to 20. */
  itemsPerPage?: number;
  /** Optional: Placeholder text for the trigger button when nothing is selected. */
  selectText?: string;
  /** Optional: Placeholder text for the search input inside the popover. */
  searchText?: string;
  /** Optional: Text displayed while items are loading. */
  loadingText?: string;
  /** Optional: Text displayed if there's an error loading items. */
  errorText?: string;
  /** Optional: Text displayed when the search yields no results. */
  notFoundText?: string;
  /** Optional: Aria-label for the previous page button. */
  previousPageLabel?: string;
  /** Optional: Aria-label for the next page button. */
  nextPageLabel?: string;
  /** Optional: Format string for pagination info (e.g., "Page {currentPage} of {totalPages}"). */
  paginationInfoFormat?: string;
  /** Optional: ID attribute for the trigger button, useful for label association. */
  id?: string;
  /** Optional: Additional class names for the trigger button. */
  className?: string;
  /** Optional: Additional class names for the PopoverContent. */
  popoverContentClassName?: string;
  /** Optional: Disables the combobox trigger button. */
  disabled?: boolean;
};

const DEFAULT_ITEMS_PER_PAGE = 40;

/**
 * A reusable combobox component with client-side search and pagination,
 * designed to work well with large lists of items.
 */
export function PaginatedCombobox<TItem extends ComboboxItem>({
  items = [],
  value,
  onChange,
  isLoading = false,
  isError = false,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  selectText: selectTextProp,
  searchText: searchTextProp,
  loadingText: loadingTextProp,
  errorText: errorTextProp,
  notFoundText: notFoundTextProp,
  previousPageLabel: previousPageLabelProp,
  nextPageLabel: nextPageLabelProp,
  paginationInfoFormat: paginationInfoFormatProp,
  id,
  className,
  popoverContentClassName,
  disabled = false,
}: PaginatedComboboxProps<TItem>) {
  const selectText = selectTextProp ?? 'Select item...';
  const searchText = searchTextProp ?? 'Search items...';
  const loadingText = loadingTextProp ?? 'Loading...';
  const errorText = errorTextProp ?? 'Error loading data.';
  const notFoundText = notFoundTextProp ?? 'No results found.';
  const previousPageLabel = previousPageLabelProp ?? 'Previous page';
  const nextPageLabel = nextPageLabelProp ?? 'Next page';
  const paginationInfoFormat =
    paginationInfoFormatProp ?? 'Page {currentPage} of {totalPages}';

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const validCurrentPage = Math.max(
      1,
      Math.min(currentPage, totalPages || 1)
    );
    if (currentPage !== validCurrentPage) {
      setCurrentPage(validCurrentPage);
    }
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage, totalPages]);

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(newPage);
  };

  const selectedItem = items.find((item) => item.id === value);
  const effectiveValue = value ?? '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            !selectedItem && 'text-muted-foreground',
            className
          )}
          disabled={disabled || isLoading || isError}
        >
          <span className='truncate'>
            {isLoading
              ? loadingText
              : isError
                ? errorText
                : selectedItem
                  ? selectedItem.name
                  : selectText}
          </span>
          {isLoading ? (
            <Loader2 className='ml-2 h-4 w-4 shrink-0 animate-spin opacity-50' />
          ) : (
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0 overflow-hidden', popoverContentClassName)}
        align='start'
        side='top'
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <div className='flex flex-col max-h-[--radix-popover-content-available-height]'>
          {/* Search Input */}
          <div className='flex-shrink-0 p-2 border-b border-border'>
            <Input
              placeholder={searchText}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className='h-7 w-full border-0 bg-transparent px-1 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
              disabled={isLoading || isError}
              aria-label={searchText}
            />
          </div>
          <div className='flex-grow overflow-y-auto max-h-60'>
            {isLoading ? (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                {loadingText}
              </div>
            ) : isError ? (
              <div className='py-6 text-center text-sm text-destructive'>
                {errorText}
              </div>
            ) : currentItems.length === 0 ? (
              searchTerm ? (
                <div className='py-6 text-center text-sm text-muted-foreground'>
                  {notFoundText}
                </div>
              ) : (
                <div className='py-6 text-center text-sm text-muted-foreground'>
                  {searchText}
                </div>
              )
            ) : (
              <div className='py-1'>
                {/* Map over CURRENT page's items */}
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                      item.id === effectiveValue &&
                        'bg-accent text-accent-foreground'
                    )}
                    onClick={() => {
                      const newValue =
                        item.id === effectiveValue ? '' : item.id;
                      onChange(newValue);
                      setSearchTerm('');
                      setOpen(false);
                    }}
                  >
                    <span className='flex-grow truncate mr-2'>
                      {`${item.code ? item.code + ' - ' : ''}${item.name}`}
                    </span>
                    {item.id === effectiveValue && (
                      <Check className='ml-auto h-4 w-4' />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls - Keep at bottom */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className='flex-shrink-0 flex items-center justify-between p-2 border-t'>
              <div className='text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap mr-2 min-w-0'>
                {paginationInfoFormat
                  .replace('{currentPage}', currentPage.toString())
                  .replace('{totalPages}', totalPages.toString())}
              </div>
              <div className='flex gap-1 flex-shrink-0'>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-7 w-7'
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label={previousPageLabel}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-7 w-7'
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label={nextPageLabel}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
