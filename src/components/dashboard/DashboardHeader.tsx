import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';
import { MobileNav } from './Sidebar';
import { useLogoutMutation } from '@/redux/feautures/auth/authApi';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';
import Link from 'next/link';
import { ClientNotifications } from './ClientNotifications';

export const DashboardHeader = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out successfully');
      router.push('/signin');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 right-0 z-50 w-full h-16 px-4 lg:px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="flex items-center justify-between h-full gap-2 lg:gap-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/dashboard" className="hidden lg:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300">
              MiCounselor
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div data-tutorial="notifications">
            <ClientNotifications />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-10 w-10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <div data-tutorial="profile-menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                    <AvatarImage src={user?.avatar?.imageUrl} alt={`${user?.fullName || 'User'}'s avatar`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="font-medium">{user?.username || "User"}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" data-tutorial="profile-settings">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;