import { FileType } from '../../types';
import { parseItalianNumber } from '../number/parse';
import { formatItalianNumber } from '../number/format';
import { isCurrencyColumn } from '../table/columns';

/**
 * Processes CSV data, handling credit notes and number formatting
 */
export function processCSVData(
  fileType: FileType,
  headers: string[],
  data: string[][]
): string[][] {
  // Only process credit notes for invoice types
  if (fileType !== 'fatture-emesse' && fileType !== 'fatture-ricevute') {
    return data;
  }

  // Find column indices
  const documentTypeIndex = headers.findIndex(h => 
    h.toLowerCase().includes('tipo documento')
  );
  
  const amountIndices = headers.map((h, i) => 
    isCurrencyColumn(h) ? i : -1
  ).filter(i => i !== -1);

  if (documentTypeIndex === -1 || amountIndices.length === 0) {
    return data;
  }

  // Process each row
  return data.map(row => {
    const documentType = (row[documentTypeIndex] || '').toLowerCase();
    const isCreditNote = documentType === 'nota di credito';

    return row.map((cell, index) => {
      if (amountIndices.includes(index)) {
        // Parse the number from Italian format
        const value = parseItalianNumber(cell);
        // Apply credit note logic
        const finalValue = isCreditNote ? -Math.abs(value) : value;
        // Format back to Italian format
        return formatItalianNumber(finalValue);
      }
      return cell;
    });
  });
}