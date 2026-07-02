import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NotificationProvider } from '@/context/NotificationContext';
import { Toaster } from '@/components/ui/sonner';

/**
 * RootLayout — top-level layout that wraps the entire app.
 * Provides all global context providers and renders child routes via <Outlet />.
 */
export function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system">
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
          <Toaster position="top-right" />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
