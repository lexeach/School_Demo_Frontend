import { useEffect, useState } from "react";
import { format } from "date-fns";

import Button from "@/UI/Elements/Button";
import SearchInput from "../Elements/Input/search";
import UIFilter from "../Elements/Popover/Filter";

export default function TableFilters({
  filtersConfig,
  onFiltersChange,
  buttons,
  additionalClasses,
  filterState,
  setSearch,
  search,
}) {
  const [filters, setFilters] = useState({});
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const initialFilters = {};
    filtersConfig.forEach((filter) => {
      initialFilters[filter.filterName] = "";
    });
    setFilters(initialFilters);
  }, [filtersConfig]);

  const handleFilterChange = (filterName, selectedOptions) => {
    const isDateFilter = filterName === "from" || filterName === "to";
    const formattedValue = Array.isArray(selectedOptions)
      ? selectedOptions.join(",")
      : isDateFilter
        ? format(new Date(selectedOptions), "yyyy-MM-dd")
        : selectedOptions;

    const newFilters = {
      ...filters,
      [filterName]: formattedValue,
    };

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const hasNonEmptyValues = Object.values(filterState).some(
    (value) => value !== ""
  );

  const handleClearAll = () => {
    const clearedFilters = {};
    for (const key in filters) {
      clearedFilters[key] = "";
    }
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setReset(true);
    setTimeout(() => setReset(false), 100);
  };

  const renderFilters = (filterArray) => {
    return filterArray.map((config, index) => {
      if (config.type === "date") {
        const today = new Date().toISOString().split("T")[0];
        const minDate = config.disablePastDates ? today : undefined;
        const maxDate = config.disableFutureDates ? today : undefined;

        return (
          <div
            key={`filter-${index}`}
            className="flex items-center space-x-2 mx-2 border border-blue-200 bg-white shadow-sm hover:bg-blue-100 hover:text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-800 dark:hover:text-blue-50 rounded-[6px]"
          >
            <label
              htmlFor={`date-filter-${config.filterName}`}
              className="block text-sm mx-2 font-medium leading-5"
            >
              {config.name}
            </label>
            <input
              type="date"
              id={`date-filter-${config.filterName}`}
              className="inline-flex items-center justify-center text-sm font-medium leading-5 text-left py-[7px] px-2 w-full md:w-auto focus:border-transparent hover:border-transparent focus:outline-none hover:outline-none"
              onChange={(e) =>
                handleFilterChange(config.filterName, e.target.value)
              }
              value={filters[config.filterName] || ""}
              min={minDate}
              max={maxDate}
            />
          </div>
        );
      }

      return (
        <div key={`filter-${index}`} className="mx-2">
          {
            <UIFilter
              options={config.options}
              name={config.name}
              className="w-full md:w-auto"
              onChange={(selectedOptions) =>
                handleFilterChange(config.filterName, selectedOptions)
              }
              reset={reset}
            />
          }
        </div>
      );
    });
  };

  const renderButtons = (buttonArray) => {
    return buttonArray.map((button, index) => (
      <div
        key={`button-${index}`}
        className="w-full md:w-auto mx-2 sm:block md:mt-0 mt-2"
      >
        <Button
          iconClassName="mr-2"
          onClick={button.onClick}
          icon={button.icon}
          className="w-full mt-1 md:w-auto px-[24px]"
        >
          {button.label}
        </Button>
      </div>
    ));
  };

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center px-[24px] py-3 w-full border-b-[1px] border-gray-300 justify-center md:justify-between ${additionalClasses}`}
    >
      <div className="flex flex-wrap items-center mt-2 w-full md:w-auto">
        <SearchInput
          setSearch={setSearch}
          search={search}
          wrapperClassName="min-w-[302px] ml-0 w-full md:w-auto"
          placeholder={("Search")}
        />

        <div className="items-center w-full md:w-auto sm:flex hidden mt-2 md:mt-0">
          {filtersConfig.length !== 0 && (
            <>
              <div className="flex items-center ml-[11px] flex-wrap">
                {!reset && renderFilters(filtersConfig)}
              </div>
            </>
          )}
          {hasNonEmptyValues && (
            <div className="w-full md:w-auto mx-2 mt-2 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                {("Clear All")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center w-full md:w-auto rtl:ml-0">
        {renderButtons(buttons)}
      </div>
    </div>
  );
}
