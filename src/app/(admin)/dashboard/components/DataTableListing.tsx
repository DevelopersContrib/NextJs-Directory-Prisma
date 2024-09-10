"use client";
import React, { useEffect, useState, useMemo } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CgSpinner } from "react-icons/cg";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoSearchSharp } from "react-icons/io5";
import Link from "next/link";
import { debounce } from "lodash";

// Placeholder type for data
type TLinkData = {
  title: string;
  linkId: string;
};

// Sample data
const SAMPLE_LINKS: TLinkData[] = [
  { title: "Google", linkId: "1" },
  { title: "Facebook", linkId: "2" },
  { title: "Twitter", linkId: "3" },
];

const useLinks = () => {
  const [links, setLinks] = useState<TLinkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch
    setTimeout(() => {
      setLinks(SAMPLE_LINKS);
      setLoading(false);
    }, 1000);
  }, []);

  return { links, loading };
};

const DatatableListing = () => {
  const { links, loading } = useLinks();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<TLinkData>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-slate-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("title") as string}</div>,
      },
      {
        accessorKey: "linkId",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-slate-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Link ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("linkId") as string}</div>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button size="sm" className="bg-primary text-white">
            <Link href={`/view/${row.getValue("linkId")}`}>View</Link>
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: links,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    globalFilterFn: (row, columnId, filterValue) =>
      String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
  });

  const handleFilterChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGlobalFilter(event.target.value);
    },
    300
  );

  return (
    <div className="w-full">
      {/* Entries per page and Search */}
      <div className="flex items-center flex-col lg:flex-row py-4 gap-y-4 lg:gap-0">
        <div className="flex items-center space-x-2">
          <span>Entries per page:</span>
          <select
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination({ ...pagination, pageSize: Number(e.target.value) })
            }
            className="border rounded px-2 py-1"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="inline-flex space-x-2 lg:ml-auto">
          <Input
            placeholder="Search..."
            defaultValue={globalFilter}
            onChange={handleFilterChange}
            className="w-full lg:w-[350px]"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="rounded-md border">
        {loading ? (
          <div className="flex items-center justify-center h-48 w-full">
            <CgSpinner className="fa-spin text-4xl" />
          </div>
        ) : (
          <div className="table-no-scroller-x">
            <Table className="table-responsive-custom">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination and showing results */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getCoreRowModel().rows.length} results.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatatableListing;
