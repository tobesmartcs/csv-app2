import { parseDate } from '../date/parse';
import { parseItalianNumber } from '../number/parse';
import { FileType } from '../../types';

interface MonthlyTotal {
  month: string;
  amount: number;
  tax: number;
  count: number;
}

/**
 * Gets the appropriate column indices based on file type
 */
function getColumnIndices(headers: string[], fileType: FileType) {
  const lowerHeaders = headers.map(h => h.toLowerCase());
  
  if (fileType === 'corrispettivi') {
    return {
      date: lowerHeaders.findIndex(h => h.includes('data')),
      amount: lowerHeaders.findIndex(h => 
        h.includes('ammontare delle vendite') || 
        h.includes('imponibile vendite')
      ),
      tax: lowerHeaders.findIndex(h => h.includes('imposta vendite'))
    };
  }

  return {
    date: lowerHeaders.findIndex(h => h.includes('data emissione')),
    amount: lowerHeaders.findIndex(h => h.includes('imponibile/importo')),
    tax: lowerHeaders.findIndex(h => h.includes('imposta'))
  };
}

/**
 * Calculates totals grouped by month
 */
export function calculateMonthlyTotals(
  headers: string[],
  data: string[][],
  fileType: FileType
): MonthlyTotal[] {
  const { date: dateIndex, amount: amountIndex, tax: taxIndex } = 
    getColumnIndices(headers, fileType);

  if (dateIndex === -1 || (amountIndex === -1 && taxIndex === -1)) {
    return [];
  }

  // Group data by month
  const monthlyTotals = new Map<string, MonthlyTotal>();

  data.forEach(row => {
    const date = parseDate(row[dateIndex]);
    if (!date) return;

    // Format month key as "MM/YYYY"
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const monthKey = `${month}/${year}`;

    // Get or initialize monthly total
    let monthTotal = monthlyTotals.get(monthKey);
    if (!monthTotal) {
      monthTotal = {
        month: monthKey,
        amount: 0,
        tax: 0,
        count: 0
      };
      monthlyTotals.set(monthKey, monthTotal);
    }

    // Add values
    if (amountIndex !== -1) {
      monthTotal.amount += parseItalianNumber(row[amountIndex]);
    }
    if (taxIndex !== -1) {
      monthTotal.tax += parseItalianNumber(row[taxIndex]);
    }
    monthTotal.count++;
  });

  // Convert to array and sort by date
  return Array.from(monthlyTotals.values())
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split('/');
      const [bMonth, bYear] = b.month.split('/');
      const yearDiff = parseInt(aYear) - parseInt(bYear);
      if (yearDiff !== 0) return yearDiff;
      return parseInt(aMonth) - parseInt(bMonth);
    });
}