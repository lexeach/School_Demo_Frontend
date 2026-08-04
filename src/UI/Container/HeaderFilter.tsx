import { useEffect, useState } from 'react';
import Button from '@/UI/Elements/Button';
import SearchInput from '../Elements/Input/search';
import UIFilter from '../Elements/Popover/Filter';

export default function HeaderFilter({
  filtersConfig,
  onFiltersChange,
  filterState,
  setSearch,
  search,
}) {
  const [filters, setFilters] = useState({});
  const [reset, setReset] = useState(false);

  useEffect(() => {
    const initialFilters = {};
    filtersConfig.forEach(filter => {
      initialFilters[filter.filterName] = '';
    });
    setFilters(initialFilters);
  }, [filtersConfig]);

  const handleFilterChange = (filterName, selectedOptions) => {
    const newFilters = {
      ...filters,
      [filterName]: Array.isArray(selectedOptions)
        ? selectedOptions.join(',') || ''
        : selectedOptions,
    };
    console.log(newFilters);
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const hasNonEmptyValues = Object.values(filterState).some(
    value => value !== ''
  );

  const handleClearAll = () => {
    const clearedFilters = {};
    for (const key in filters) {
      clearedFilters[key] = '';
    }
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setReset(true);
    setTimeout(() => setReset(false), 100);
  };

  const renderFilters = filterArray => {
    return filterArray.map((config, index) => (
      <div key={`filter-${index}`} className="mx-2">
        <UIFilter
          options={config.options}
          name={config.name}
          className="w-full md:w-auto"
          onChange={selectedOptions =>
            handleFilterChange(config.filterName, selectedOptions)
          }
          reset={reset}
        />
      </div>
    ));
  };

  return (
    <div className="flex  justify-between  m-4">
      <div className="ml-2">
        <SearchInput
          setSearch={setSearch}
          search={search}
          wrapperClassName="min-w-[302px] ml-0"
          placeholder={'search'}
        />
      </div>
      <div className="items-center  md:w-auto sm:flex hidden">
        {filtersConfig.length !== 0 && (
          <>
            <div className="flex items-center ml-[11px]">
              {!reset && renderFilters(filtersConfig)}
            </div>
          </>
        )}
        {hasNonEmptyValues && (
          <div className="w-full md:w-auto mx-2 ">
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              {'clear_all'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
