import PaginationPopover from '../Popover/pagination';
import UIPagination from './Pagination';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const pageOptions = [
  { label: '5 rows', value: '5' },
  { label: '10 rows', value: '10' },
  { label: '20 rows', value: '20' },
  { label: '30 rows', value: '30' },
  { label: '100 rows', value: '100' },
];

const PaginationWrapper = ({ pagination, table, onPageChange, totalRows }) => {
  const { sidebar } = useSelector(state => state.layout);
  const { t } = useTranslation();
  const pageCount = Math.ceil(totalRows / pagination.pageSize);

  return (
    <footer className="w-full sticky bottom-0 bg-white border-t border-gray-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 text-sm text-muted-foreground pl-4">
          <span className="mx-2">{t('showing')}</span>
          <PaginationPopover
            name="--"
            options={pageOptions}
            value={String(pagination.pageSize) || '10'}
            onChange={value => {
              const newSize = Number(value);
              table.setPageSize(newSize);
              onPageChange({ pageIndex: 0, pageSize: newSize });
            }}
            noLabel
            side="top"
          />
          <span className="mx-2">
            {t('of')} {totalRows} {t('rows')}
          </span>
        </div>
        <UIPagination
          pageIndex={pagination.pageIndex}
          pageCount={pageCount}
          canPreviousPage={pagination.pageIndex > 0}
          canNextPage={pagination.pageIndex < pageCount - 1}
          gotoPage={newPageIndex => {
            onPageChange({ ...pagination, pageIndex: newPageIndex });
          }}
        />
      </div>
    </footer>
  );
};

export default PaginationWrapper;
