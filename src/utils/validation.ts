import { CSVFile, FileType } from '../types';
import { processCSVData } from './csv/process';
import { validateCSVData } from './validation/validate';
import { findDuplicates } from './validation/duplicates';

export { validateCSVData, findDuplicates };

/**
 * Creates a new CSV file with processed data
 */
export function createCSVFile(
  fileName: string,
  headers: string[],
  data: string[][],
  fileType: FileType
): CSVFile {
  // Validate data structure and required columns
  validateCSVData(headers, data, fileType);

  // Process data for credit notes if it's an invoice file
  const processedData = processCSVData(fileType, headers, data);

  return {
    id: Date.now().toString(),
    name: fileName,
    headers,
    data: processedData,
    uploadDate: new Date().toISOString(),
  };
}

/**
 * Merges data from multiple CSV files
 */
export function mergeCSVData(files: CSVFile[]): { headers: string[]; data: string[][] } {
  if (!files.length) {
    return { headers: [], data: [] };
  }

  // Use headers from the first file
  const headers = files[0].headers;

  // Merge data from all files
  const data = files.reduce<string[][]>((acc, file) => {
    // Ensure file headers match
    if (file.headers.length !== headers.length) {
      throw new Error('Struttura file non corrispondente');
    }

    return [...acc, ...file.data];
  }, []);

  return { headers, data };
}