"use client";
import React, { useState, useMemo } from "react";
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
import { debounce } from "lodash";
import Link from "next/link";
import LinkType from "@/types/link.type";

// Table props
type Props = {
  recents: LinkType[];
};

const DatatableListing = ({ recents }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Define the columns for the table (without categoryId)
  const columns = useMemo<ColumnDef<LinkType>[]>(
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
        accessorKey: "id",
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
        cell: ({ row }) => <div>{row.getValue("id") as string}</div>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const linkId = row.getValue("id");
          const categoryId = row.original.categoryId; // You can still access categoryId here if needed

          return (
            <Button size="sm" className="bg-primary text-white" asChild>
              <Link
                href={
                  categoryId && linkId
                    ? `/?categoryId=${categoryId}&linkId=${linkId}`
                    : `/?categoryId=${categoryId}`
                }
              >
                View
              </Link>
            </Button>
          );
        },
      },
    ],
    []
  );

  // Filter the data based on the global search input
  const filteredData = useMemo(() => {
    if (!globalFilter) {
      return recents; // Use the recents prop data
    }
    return recents.filter(
      (link) =>
        link.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        link.id.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [recents, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    onPaginationChange: setPagination,
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
        {!recents.length ? (
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
