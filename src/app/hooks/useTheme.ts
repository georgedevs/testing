import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  
  return {
    isDarkMode: theme === 'dark',
    toggleDarkMode: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    setIsDarkMode: (value: boolean) => setTheme(value ? 'dark' : 'light')
  };
};