import { ThemeProvider } from '@/components/providers/theme';
import { Toaster } from '@/components/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

type AppProvidersProps = {
  children: React.ReactNode;
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
};
