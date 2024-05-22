'use client';

import { useContext, useState } from 'react';

import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from './ui/skeleton';
import { TableContext } from '@/context/TableContext';
import { Books, TableContextType } from '@/lib/definitions';
import { ArrowDownToLine, File } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  size: number;
  loading?: boolean;
  jsonData: Books[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  size,
  loading,
  jsonData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { records, setRecords, page, setPage } = useContext(
    TableContext
  ) as TableContextType;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageIndex: page - 1, //custom initial page index
        pageSize: records, //custom default page size
      },
    },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecords(Number(e.target.value));
  };

  const downloadCSV = () => {
    const csvHeader =
      'Title,Publish Year,Subject,Author Name,Author Birth Date,Author Top Work,Ratings Average\n';

    const csvRows = jsonData
      .map(
        (book) =>
          `"${book.title}","${book.first_publish_year}","${book.subject}","${book.author_name}","${book.author_birth_date}","${book.author_top_work}",${book.ratings_average}`
      )
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + csvHeader + csvRows;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'books_list.csv');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // console.log(page, records);
  // console.log(table.getRowModel().rows);

  return (
    <>
      {/* Filters */}

      <div className="flex items-center justify-between">
        <div className="flex w-max gap-x-10 items-center">
          {/* Search by Author */}
          <div className="flex items-center py-4">
            <Input
              placeholder="Search by title..."
              value={
                (table.getColumn('title')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('title')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-x-4 items-center">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={downloadCSV}
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Download
            </span>
          </Button>
          <div className="flex w-fit items-center space-x-2 text-sm">
            <div className="flex">Books per page :</div>
            <Input
              type="number"
              placeholder="10"
              className="w-16"
              min={10}
              max={100}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              onClick={(e) => {
                table.setPageSize(records);
                setPage(1);
                table.setPageIndex(0);
              }}
            >
              Update
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[70vh] text-center"
                >
                  <Skeleton className="h-full w-full" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
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
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Display Pages  */}
      <div className="text-xs text-muted-foreground mt-10">
        Showing{' '}
        <strong>
          {(page - 1) * records + 1}-{page * records}
        </strong>{' '}
        of <strong>{size}</strong> books
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPage(page - 1);
            table.previousPage();
          }}
          disabled={page - 1 == 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPage(page + 1);
            table.nextPage();
          }}
          disabled={page > size / records}
        >
          Next
        </Button>
      </div>
    </>
  );
}
