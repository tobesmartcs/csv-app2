import React from 'react';
import { isCurrencyColumn } from '../../utils/table/columns';
import { formatCell } from '../../utils/table/format';

interface TableRowProps {
  row: string[];
  headers: string[];
  rowIndex: number;
}

export function TableRow({ row, headers, rowIndex }: TableRowProps) {
  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      {row.map((cell, cellIndex) => {
        const header = headers[cellIndex] || '';
        return (
          <td 
            key={cellIndex} 
            className={`px-6 py-4 ${isCurrencyColumn(header) ? 'text-right' : 'text-left'}`}
          >
            {formatCell(header, cell)}
          </td>
        );
      })}
    </tr>
  );
}