import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import ChevronDown from "../../../assets/ChevUpDown.svg?react";
import NoRecords from '../../../components/ui/norecords';

import PaginationWrapper from "./PaginationWrapper";
import UICheckbox from "../Checkbox";

const columnHelper = createColumnHelper();

const generateColumns = (
  isPagination,
  columnDefinitions,
  pageIndex,
  pageSize,
  hideIndex
) => {
  const indexColumn = columnHelper.accessor(
    (row, rowIndex) =>
      isPagination ? pageIndex * pageSize + rowIndex + 1 : rowIndex + 1,
    {
      id: "index",
      header: () => <span>#</span>,
      cell: (info) => info.getValue(),
      enableSorting: false,
    }
  );

  const columns = columnDefinitions.map((def) => {
    return columnHelper.accessor(def.accessor, {
      id: def.id || def.accessor,
      cell: def.cell,
      header: def.header,
      footer: def.footer,
      meta: def.meta,
      enableSorting: def.enableSorting,
      headerClass: def.headerClass,
      cellClass: def.cellClass,
    });
  });
  if (hideIndex) {
    return columns;
  } else {
    return [indexColumn, ...columns];
  }
};

const UITable = ({
  data,
  columnArr,
  striped = false,
  totalRows,
  pagination,
  onPageChange,
  isPagination = true,
  isManualPagination = false,
  isSelected = false,
  onSelectionChange,
  defaultSelected = [],
  hideIndex = false,
  onSortChange,
  sorting = {},
}) => {
  const [selectedRows, setSelectedRows] = React.useState({});
  useEffect(() => {
    if (isSelected) {
      const arr = {};
      defaultSelected.map((item) => {
        arr[item] = true;
      });
      setSelectedRows(arr);
    }
  }, []);

  useEffect(() => {
    if (onSelectionChange && isSelected) {
      onSelectionChange(
        Object.keys(selectedRows).filter((key) => selectedRows[key])
      );
    }
  }, [selectedRows, onSelectionChange]);

  const handleRowSelectionChange = (row, checked) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [row.original.id]: checked,
    }));
  };

  const handleSelectAll = (checked) => {
    const newSelectedRows = {};
    if (checked) {
      data.forEach((row) => {
        newSelectedRows[row.id] = true;
      });
    }
    setSelectedRows(newSelectedRows);
  };

  const isAllRowsSelected =
    data.length > 0 && data.every((row) => selectedRows[row.id]);
  const paginatedData = React.useMemo(() => {
    if (isManualPagination) {
      const startIndex = pagination.pageIndex * pagination.pageSize;
      return data.slice(startIndex, startIndex + pagination.pageSize);
    }
    return data;
  }, [data, pagination.pageIndex, pagination.pageSize, isPagination]);

  const columns = React.useMemo(() => {
    if (isSelected) {
      const checkboxColumn = columnHelper.accessor("select", {
        id: "select",
        header: () => (
          <UICheckbox
            label=""
            value="select_all"
            checked={isAllRowsSelected}
            onChange={handleSelectAll}
          />
        ),
        cell: ({ row }) => (
          <UICheckbox
            label=""
            checked={!!selectedRows[row.original.id]}
            onChange={(checked) => handleRowSelectionChange(row, checked)}
          />
        ),
        enableSorting: false,
      });
      return [
        checkboxColumn,
        ...generateColumns(
          isPagination,
          columnArr,
          pagination.pageIndex,
          pagination.pageSize,
          hideIndex
        ),
      ];
    }
    return generateColumns(
      isPagination,
      columnArr,
      pagination.pageIndex,
      pagination.pageSize,
      hideIndex
    );
  }, [
    isSelected,
    isPagination,
    columnArr,
    pagination.pageIndex,
    pagination.pageSize,
    hideIndex,
    isAllRowsSelected,
    handleSelectAll,
    selectedRows,
  ]);
  const table = useReactTable({
    data: paginatedData || [],
    columns,
    state: {
      pagination,
    },
    onSortingChange: (newSorting) => {
      onSortChange(newSorting);
    }, //setSorting,
    onRowSelectionChange: isSelected ? setSelectedRows : {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: isPagination ? Math.ceil(totalRows / pagination.pageSize) : 0,
  });

  useEffect(() => {
    if (isPagination) {
      table.setPageSize(pagination.pageSize);
      table.setPageIndex(pagination.pageIndex);
    }
  }, [pagination?.pageIndex, pagination?.pageSize, table, isPagination]);

  return (
    <div className="h-full w-full">
      <div className="responsive-table">
        <Table className="h-full text-center">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-40px">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={`text-xs leading-4 font-medium text-black text-center
                  ${header.column.columnDef.meta?.textAlign || "text-center"} ${
                    header.column.columnDef.headerClass || ""
                  }`}
                      key={header.id}
                      onClick={() => {
                        if (header.column.columnDef.enableSorting) {
                          const columnAccessor = header.column.id;
                          const isSameColumn = sorting.id === columnAccessor;
                          const newSorting = {
                            id: columnAccessor,
                            desc: isSameColumn ? !sorting.desc : false,
                          };
                          onSortChange(newSorting);
                        }
                      }}
                    >
                      <div className="flex items-center justify-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.columnDef.enableSorting && (
                          <ChevronDown
                            className={`cursor-pointer w-4 h-4 ml-2 ${
                              header.column.getIsSorted()
                                ? "text-black"
                                : "text-gray-300"
                            } ${
                              header.column.getIsSorted() === "desc"
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  className={`h-[52px] text-sm text-gray-600 max-h-[80px] position-relative ${
                    striped && index % 2 === 1 ? "bg-gray-50" : ""
                  } ${selectedRows[row.id] ? "bg-blue-100" : ""}`}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${cell.column.columnDef.cellClass || ""}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <tr>
              <td colSpan={table.getAllColumns().length} className="py-4">
                <NoRecords />
              </td>
            </tr>
            )}
          </TableBody>
        </Table>
        {isPagination && (
          <PaginationWrapper
            pagination={pagination}
            table={table}
            onPageChange={onPageChange}
            totalRows={totalRows}
          />
        )}
      </div>
    </div>
  );
};

export default UITable;
