export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  
  if ('data' in error) {
    return error.data?.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}; 