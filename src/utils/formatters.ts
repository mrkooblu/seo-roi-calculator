export const formatNumber = (value: number): string => {
  return Math.round(value).toLocaleString();
};

export const formatDecimal = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

export const formatCurrency = (value: number, decimals: number = 2): string => {
  return '$' + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals) + '%';
};

export const formatBreakEvenPoint = (value: number): string => {
  return isFinite(value) ? value.toFixed(1) + ' months' : 'N/A';
}; 