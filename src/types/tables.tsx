// @ts-nocheck
// Define the row data type
interface RowData {
  name: string;
  connectionType: string;
  host: string;
  status: string;
  lastSync: string;
  date: string;
}

// Define the column definition type
interface ColumnDefinition<T> {
  header: string;
  accessor: keyof T;
  class?: string;
  cell: (info: { getValue: () => any }) => React.ReactNode;
  enableSorting?: boolean;
  meta?: {};
  headerClass?: string;
  cellClass?: string;
}
