import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const DataTable = (name, ingredeints, instructions) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "ingredients",
        header: "Ingredients",
      },
      {
        accessorKey: "instructions",
        header: "Instructions",
      },
      // {
      //   accessorKey: "email",
      //   header: "Email",
      // },

      {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="bg-success px-3 py-1"
              onClick={() => handleApprove(row.original._id)}
            >
              {/* <SquarePen size={18} /> */}
              Approve
            </button>
            <button
              className="bg-danger px-3 py-1"
              onClick={() => handleReject(row.original._id)}
            >
              Reject
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: recipes,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId) || "";
      return cellValue.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <>
      <div className="">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded w-full"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value || "")}
        />
      </div>
      <div className="overflow-x-auto table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 px-4 py-2"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DataTable;
