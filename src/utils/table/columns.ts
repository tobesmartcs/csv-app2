/**
 * Checks if a column contains currency values
 */
export const isCurrencyColumn = (header: string): boolean => {
  const lowerHeader = header.toLowerCase();
  return lowerHeader.includes('imponibile/importo') ||
         lowerHeader.includes('imposta') ||
         lowerHeader.includes('ammontare delle vendite') ||
         lowerHeader.includes('imponibile vendite');
};

/**
 * Checks if a column contains date values
 */
export const isDateColumn = (header: string): boolean => {
  const lowerHeader = header.toLowerCase();
  return lowerHeader.includes('data');
};