'use client';

import { ApiSchema } from '@/lib/api-context';
import { Button } from '@/components/ui/button';

export interface DynamicTableProps {
  schema: ApiSchema;
  data: Record<string, any>[];
  onEdit: (record: Record<string, any>) => void;
  onDelete: (id: string | number) => void;
  onNew: () => void;
  isLoading?: boolean;
  currentPage: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function DynamicTable({
  schema,
  data,
  onEdit,
  onDelete,
  onNew,
  isLoading = false,
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onSearch,
  searchQuery,
}: DynamicTableProps) {
  const columns = Object.keys(schema);
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const hasId = data.length > 0 && 'id' in data[0];

  if (columns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please configure the API schema to view data
        </p>
      </div>
    );
  }

  if (data.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No records found</p>
        <Button onClick={onNew}>Create New Record</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search records..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={onNew} disabled={isLoading}>
          New Record
        </Button>
      </div>

      <div className="overflow-x-auto border border-input rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-input bg-muted">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left font-semibold text-foreground"
                >
                  {col}
                </th>
              ))}
              <th className="px-4 py-2 text-left font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                  <span className="text-muted-foreground">Loading...</span>
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr key={index} className="border-b border-input hover:bg-muted/50">
                  {columns.map((col) => (
                    <td
                      key={`${index}-${col}`}
                      className="px-4 py-3 text-foreground"
                    >
                      {typeof record[col] === 'boolean'
                        ? record[col]
                          ? 'Yes'
                          : 'No'
                        : String(record[col] ?? '-')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(record)}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                      {hasId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(record.id)}
                          disabled={isLoading}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({totalRecords} total records)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
