import React, { forwardRef, useRef } from 'react';

import { Input } from '@/components/ui/input';
import Search from '@/assets/Search.svg?react';
import { useTranslation } from 'react-i18next';

const SearchInput = forwardRef(
  (
    {
      className = '',
      type = 'text',
      placeholder = 'search',
      search = '',
      wrapperClassName = '',
      setSearch = () => {},
    },
    providedRef
  ) => {
    const { t } = useTranslation();
    const defaultRef = useRef(null);
    const ref = providedRef || defaultRef;

    const handleChange = e => {
      setSearch(e.target.value);
    };
    return (
      <div
        className={`stroke-secondary relative ml-auto flex-1 md:grow-0 ${wrapperClassName}`}
      >
        <Input
          type={type}
          ref={ref}
          onChange={handleChange}
          placeholder={t(placeholder)}
          className={`w-full rounded-lg bg-background pl-[30px] ${className}`}
        />
        <Search className="absolute left-2.5 top-3 h-4 w-4 " />
      </div>
    );
  }
);

export default SearchInput;
