/**
 * Table column definition
 * UI-library agnostic
 */
export interface TableColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly accessor: (row: T) => unknown;
}

/**
 * Table pagination state
 */
export interface TablePagination {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
}

/**
 * Generic table data container
 */
export interface TableData<T> {
  readonly rows: readonly T[];
  readonly pagination?: TablePagination;
}
