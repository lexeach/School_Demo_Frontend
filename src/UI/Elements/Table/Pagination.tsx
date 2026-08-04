// src/components/UIPagination.tsx
import * as React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ChevronLeft from '@/assets/ChevLeft.svg?react';
import ChevronRight from '@/assets/ChevRight.svg?react';

interface UIPaginationProps {
  pageIndex: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  gotoPage: (pageIndex: number) => void;
}

const UIPagination: React.FC<UIPaginationProps> = ({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  gotoPage,
}) => {
  const getPaginationItems = () => {
    const pages: Array<{ name: number | string }> = [];
    const maxPages = 10;

    if (pageCount <= maxPages) {
      for (let i = 0; i < pageCount; i++) {
        pages.push({ name: i + 1 });
      }
    } else {
      if (pageIndex < maxPages - 2) {
        for (let i = 0; i < maxPages - 1; i++) {
          pages.push({ name: i + 1 });
        }
        pages.push({ name: 'ellipsis' });
        pages.push({ name: pageCount });
      } else if (pageIndex >= pageCount - (maxPages - 2)) {
        pages.push({ name: 1 });
        pages.push({ name: 'ellipsis' });
        for (let i = pageCount - (maxPages - 1); i < pageCount; i++) {
          pages.push({ name: i + 1 });
        }
      } else {
        pages.push({ name: 1 });
        pages.push({ name: 'ellipsis' });
        for (let i = pageIndex - 1; i <= pageIndex + 1; i++) {
          pages.push({ name: i + 1 });
        }
        pages.push({ name: 'ellipsis' });
        pages.push({ name: pageCount });
      }
    }
    return pages;
  };

  const paginationItems = getPaginationItems();

  return (
    <Tabs
      value={`${pageIndex}`}
      onValueChange={value => gotoPage(Number(value))}
      className="pr-[24px]"
    >
      <TabsList className="flex items-center border-[1px] border-gray-300 bg-white text-black">
        <TabsTrigger
          value={`${pageIndex - 1}`}
          disabled={!canPreviousPage}
          onClick={() => canPreviousPage && gotoPage(pageIndex - 1)}
          className="w-[44px] h-[38px] border-none"
        >
          <ChevronLeft
            className={`w-full h-full flex justify-center items-center ${!canPreviousPage ? 'text-gray-300' : ''}`}
          />
        </TabsTrigger>
        {paginationItems.map((item, index) =>
          item.name === 'ellipsis' ? (
            <TabsTrigger
              key={index}
              value={`${index}`}
              disabled
              className="w-[44px] h-[38px] p-0 bg-blue-50 border-[1px] border-blue-600"
            >
              <div className="w-full h-full flex justify-center items-center">
                ...
              </div>
            </TabsTrigger>
          ) : (
            <TabsTrigger
              key={index}
              value={`${(item.name as number) - 1}`}
              className={`w-[42px] h-[36px] rounded-none p-0 ${pageIndex === item.name - 1 ? 'bg-blue-300 border-[1px] border-blue-600 text-blue-600' : `border-r-[1px] border-gray-300`}`}
            >
              <div
                className={`w-full h-full flex justify-center items-center ${pageIndex === item.name - 1 ? 'bg-blue-50 text-blue-600 pb-[1px]' : 'hover:text-blue-600 hover:bg-gray-200'}`}
              >
                {item.name}
              </div>
            </TabsTrigger>
          )
        )}
        <TabsTrigger
          value={`${pageIndex + 1}`}
          disabled={!canNextPage}
          onClick={() => canNextPage && gotoPage(pageIndex + 1)}
          className="w-[44px] h-[38px] border-none"
        >
          <ChevronRight
            className={`w-full h-full flex justify-center items-center ${!canNextPage ? 'text-gray-300' : ''}`}
          />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default UIPagination;
