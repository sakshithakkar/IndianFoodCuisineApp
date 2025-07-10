export const formatDishValue = (value, suffix = '') => {
  if (value == '-1' || value === null || value === '') {
    return 'N/A';
  }
  return suffix ? `${value} ${suffix}` : value;
};
