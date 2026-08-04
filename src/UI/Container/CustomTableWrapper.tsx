import { useEffect, useState } from "react";
import Logo from "./Logo";
import TableFilters from "./TableFilters";
import UITable from "@/UI/Elements/Table/index.jsx";
import { useSelector } from "react-redux";

export default function CustomTableWrapper({
  fetchData,
  columns,
  columnData = [],
  filters = [],
  buttons = [],
  customComponent = false,
  isPagination = true,
  TableWrapper = ({ children }) => <div>{children}</div>,
}) {
  const refresh = useSelector((item) => item.layout.refresh);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState({
    dataSource: "",
    status: "",
    connectionType: "",
    role: "",
  });

  const [sorting, setSorting] = useState({
    id: null,
    desc: false,
  });

  const handleFiltersChange = (newFilters) => {
    setFilterState(newFilters);
  };

  const { data, error, isLoading, refetch } = fetchData(
    {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search,
      filter: filterState,
      sorting: sorting,
    },
    {
      // pollingInterval: 300000,
      // skipPollingIfUnfocused: true,
      refetchOnMountOrArgChange: true,
    }
  );
  

  useEffect(() => {
    const handler = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(handler);
  }, [refetch, refresh]);

  if (isLoading)
    return (
      <div className="w-full h-full flex">
        <Logo />
      </div>
    );

  // Handle sorting
  const handleSortChange = (newSorting) => {
    setSorting(newSorting);
  };

  if (error && error.status === 429) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90">
        <h1 className="text-2xl font-bold mb-[50px]">
          {error?.data?.message || "to_many_attempts"}
        </h1>
      </div>
    );
  }

  if (error && error.status === 404) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90">
        <h1 className="text-2xl font-bold mb-4">
          {error?.data?.message || "something_went_wrong"}
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90">
        <h1 className="text-2xl font-bold mb-4">
          {error?.data?.message || "Something went wrong"}
        </h1>
        <p className="text-md  mb-4">{"Internal server error"}</p>
      </div>
    );
  }

  return (
    <>
      {(filters.length > 0 || buttons.length > 0) && (
        <TableFilters
          filterState={filterState}
          filtersConfig={filters}
          onFiltersChange={handleFiltersChange}
          buttons={buttons}
          setSearch={setSearch}
          search={search}
          sorting={sorting}
        />
      )}

      {customComponent ? customComponent : <div></div>}

      {customComponent ? customComponent : <div></div>}

      <div className="mx-[24px] border-[1px] rounded-[4px] border-gray-300 relative">
        <TableWrapper filter={filterState} setFilterState={setFilterState}>
          <UITable
            data={data?.data || []}
            columnArr={columns}
            totalRows={data?.meta ? data?.meta.total : 0}
            pagination={pagination}
            onPageChange={(newPagination) => {
              setPagination({ ...newPagination });
            }}
            isPagination={isPagination}
            onSortChange={handleSortChange}
          />
        </TableWrapper>
      </div>

      <br />
    </>
  );
}
