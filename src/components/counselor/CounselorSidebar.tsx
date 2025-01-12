"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  Clock,
  Users,
  History,
  MessageSquare,
  ChevronFirst,
  ChevronLast,
  Settings,
  Menu,
  X,
  User
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const navigation: NavItem[] = [
  { title: 'Dashboard Home', icon: <Home className="w-5 h-5" />, href: '/counselor' },
  { title: 'Meeting Requests', icon: <Calendar className="w-5 h-5" />, href: '/counselor/requests' },
  { title: 'Upcoming Sessions', icon: <Clock className="w-5 h-5" />, href: '/counselor/upcoming' },
  { title: 'Session History', icon: <History className="w-5 h-5" />, href: '/counselor/history' },
  { title: 'Profile', icon: <User className="w-5 h-5" />, href: '/counselor/profile' }, 
  { title: 'Client Feedback', icon: <MessageSquare className="w-5 h-5" />, href: '/counselor/feedback' },
];

// Mobile Navigation Component
export const MobileNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden h-10 w-10 rounded-full"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6">
          <SheetTitle>
            <Link href="/counselor" onClick={() => setIsOpen(false)}>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Counselor Portal
              </h3>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                  "group relative overflow-hidden"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity",
                  pathname === item.href && "opacity-100"
                )} />
                <div className="relative z-10 flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// Desktop Sidebar Component
export const CounselorSidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <>
      <MobileNav />
      <TooltipProvider>
        <aside className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300",
          isCollapsed ? "w-20" : "w-72",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50",
          "hidden lg:block"
        )}>
          <div className="flex flex-col h-full">
            <div className={cn(
              "flex items-center gap-2 p-6",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && (
                <Link href="/counselor" className="flex-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Counselor Portal
                  </h3>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronLast className="h-4 w-4" />
                ) : (
                  <ChevronFirst className="h-4 w-4" />
                )}
              </Button>
            </div>

            <ScrollArea className="flex-1 px-4">
              <div className="space-y-2 py-4">
                {navigation.map((item) => (
                  <Tooltip key={item.title} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
                          pathname === item.href
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20" 
                            : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                          isCollapsed && "justify-center",
                          "group relative overflow-hidden"
                        )}
                      >
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity",
                          pathname === item.href && "opacity-100"
                        )} />
                        <div className="relative z-10 flex items-center gap-3">
                          {item.icon}
                          {!isCollapsed && <span className="font-medium">{item.title}</span>}
                        </div>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>
      </TooltipProvider>
    </>
  );
};