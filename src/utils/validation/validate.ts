import { FileType } from '../../types';

/**
 * Validates CSV data structure and required columns
 */
export function validateCSVData(headers: string[], data: string[][], fileType: FileType): void {
  if (!headers || headers.length === 0) {
    throw new Error('Il file CSV non contiene intestazioni valide');
  }

  const expectedColumns = headers.length;

  // Check each row for correct number of columns
  data.forEach((row, index) => {
    if (row.length !== expectedColumns) {
      throw new Error(
        `La riga ${index + 1} contiene ${row.length} colonne invece di ${expectedColumns}`
      );
    }
  });

  // Validate required columns based on file type
  const lowerHeaders = headers.map(h => h.toLowerCase());
  
  if (fileType === 'corrispettivi') {
    // For corrispettivi, check for "id invio" column
    if (!lowerHeaders.some(h => h.includes('id invio'))) {
      throw new Error('Il file CSV dei corrispettivi deve contenere una colonna "Id invio"');
    }
  } else {
    // For fatture, check for SDI or File column
    if (!lowerHeaders.some(h => h.includes('sdi') || h.includes('file'))) {
      throw new Error('Il file CSV delle fatture deve contenere una colonna SDI o File');
    }
  }
}