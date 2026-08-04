import React, { useEffect, useState } from 'react';

import SearchInput from '../Elements/Input/search';

const TableSearch = ({ data, setData, searchKey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [originalData, setOriginalData] = useState([...data]);
  const [isSelected, setISSelected] = useState(false);
  useEffect(() => {
    if (data.length > 0 && !isSelected) {
      setOriginalData([...data]);
      setISSelected(true);
    }
  }, [data]);
  const handleSearchChange = value => {
    setSearchQuery(value);

    if (value === '') {
      setData(originalData);
    } else {
      const filteredData = originalData.filter(item =>
        item[searchKey]?.toLowerCase().includes(value.toLowerCase())
      );
      setData(filteredData);
    }
  };
  return (
    <div className="mb-4 w-[302px]">
      <SearchInput
        setSearch={handleSearchChange}
        search={searchQuery}
        wrapperClassName="min-w-[302px] ml-0"
        className="w-full  border rounded"
      />
    </div>
  );
};

export default TableSearch;
