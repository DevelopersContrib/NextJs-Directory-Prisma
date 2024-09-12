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
import Image from "next/image";
import LinkType from "@/types/link.type";
import { likeAction, countLikesAction } from "@/actions/like.action";
import Likes from "./Likes";
import UnLikes from "./Unlikes";
import Clicks from "./Clicks";
import Category from "./Category";

type Props = {
  recents: LinkType[];
};

// Example data for the table
/*
const exampleData = [
  {
    image: "https://cdn.vnoc.com/background/contrib/bg-new2.png",
    title: "Home Repair Services",
    categoryName: "Home Repair",
    likes: 120,
    dislikes: 10,
    clicks: 300,
  },
  {
    image: "https://cdn.vnoc.com/background/contrib/bg-new2.png",
    title: "Professional Cleaning",
    categoryName: "Cleaning",
    likes: 80,
    dislikes: 5,
    clicks: 150,
  },
  {
    image: "https://cdn.vnoc.com/background/contrib/bg-new2.png",
    title: "Gardening and Landscaping",
    categoryName: "Gardening",
    likes: 95,
    dislikes: 3,
    clicks: 200,
  },
];*/

const DatatableListing = ({recents}: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  

  // Define columns for the table
  const columns = useMemo<ColumnDef<(typeof recents)[0]>[]>(
    () => [
      {
        accessorKey: "screenshot",
        header: "Image",
        cell: ({ row }) => (
          <Image
            src={row.getValue("screenshot")}
            alt="Placeholder"
            width={50}
            height={50}
            className="rounded border shadow"
            priority
          />
        ),
      },
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
        cell: ({ row }) => <div>{row.getValue("title")}</div>,
      },
      {
        accessorKey: "categoryId",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-slate-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <Category id={row.getValue("categoryId")} />,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-slate-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Likes
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <Likes id={row.getValue("id")} />,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-slate-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Dislikes
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <UnLikes id={row.getValue("id")} />,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="hover:bg-slate-200"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Clicks
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <Clicks id={row.getValue("id")} />
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Button size="sm">Edit</Button>
            <Button size="sm" variant="destructive" color="white">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // Filter the data based on global search input (search across all columns)
  const filteredData = useMemo(() => {
    if (!globalFilter) return recents;
    return recents.filter((item) =>
      Object.values(item).some((value) =>
        (value?value.toString().toLowerCase().includes(globalFilter.toLowerCase()):"")
      )
    );
  }, [globalFilter]);

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
        {!filteredData.length ? (
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
