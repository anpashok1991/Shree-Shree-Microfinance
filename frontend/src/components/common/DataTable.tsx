import { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => ReactNode;
}

interface Props {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
}

export default function DataTable({ columns, data, loading, onRowClick }: Props) {
  if (loading) return <div className="loading"><div className="spinner" /></div>;

  if (!data.length) return (
    <div className="empty-state">
      <div style={{ fontSize: '14px' }}>No data found</div>
    </div>
  );

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : undefined }}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
