"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Calendar,
  History,
  BarChart2,
  MessageSquare,
  Video,
  ChevronFirst,
  ChevronLast,
  Menu,
  X
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
import { useGetPendingCounselorsQuery } from '@/redux/feautures/auth/authApi';
import { useGetMeetingRequestsCountQuery } from '@/redux/feautures/booking/bookingApi'; 
import { Badge } from '../ui/badge';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  showBadge?: boolean;
  badgeType?: 'counselors' | 'meetings'; //  badge type to distinguish
}

const navigation: NavItem[] = [
  { title: 'Dashboard Home', icon: <Home className="w-5 h-5" />, href: '/admin' },
  { title: 'Counselors', icon: <Users className="w-5 h-5" />, href: '/admin/counselors', showBadge: true, badgeType: 'counselors' },
  { title: 'Meeting Requests', icon: <Calendar className="w-5 h-5" />, href: '/admin/requests', showBadge: true, badgeType: 'meetings' }, // Add badge here
  { title: 'Meeting History', icon: <History className="w-5 h-5" />, href: '/admin/meetings' },
  { title: 'Session History', icon: <Video className="w-5 h-5" />, href: '/admin/sessions' },
  { title: 'Analytics', icon: <BarChart2 className="w-5 h-5" />, href: '/admin/analytics' },
  { title: 'Feedback', icon: <MessageSquare className="w-5 h-5" />, href: '/admin/feedback' },
];

// Mobile Navigation Component
export const MobileNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Get both pending counselors and meeting requests counts
  const { data: pendingData } = useGetPendingCounselorsQuery();
  const { data: meetingRequestsData } = useGetMeetingRequestsCountQuery(); 
  
  const pendingCounselorsCount = pendingData?.count || 0;
  const meetingRequestsCount = meetingRequestsData?.count || 0;

  // Helper function to get badge count based on type
  const getBadgeCount = (badgeType?: string) => {
    switch (badgeType) {
      case 'counselors':
        return pendingCounselorsCount;
      case 'meetings':
        return meetingRequestsCount;
      default:
        return 0;
    }
  };

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
            <Link href="/admin" onClick={() => setIsOpen(false)}>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Admin Portal
              </h3>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            {navigation.map((item) => {
              const badgeCount = getBadgeCount(item.badgeType);
              
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all",
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

                  {/* Show badge when there are pending items */}
                  {item.showBadge && badgeCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className={cn(
                        "text-white text-xs px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center animate-pulse",
                        item.badgeType === 'counselors' ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
                      )}
                    >
                      {badgeCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();
  
  // Get both pending counselors and meeting requests counts
  const { data: pendingData } = useGetPendingCounselorsQuery();
  const { data: meetingRequestsData } = useGetMeetingRequestsCountQuery(); // Use count query
  
  const pendingCounselorsCount = pendingData?.count || 0;
  const meetingRequestsCount = meetingRequestsData?.count || 0;

  // Helper function to get badge count based on type
  const getBadgeCount = (badgeType?: string) => {
    switch (badgeType) {
      case 'counselors':
        return pendingCounselorsCount;
      case 'meetings':
        return meetingRequestsCount;
      default:
        return 0;
    }
  };

  return (
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
              <Link href="/admin" className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Admin Portal
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
              {navigation.map((item) => {
                const badgeCount = getBadgeCount(item.badgeType);
                
                return (
                  <Tooltip key={item.title} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-xl px-4 py-3 text-sm transition-all",
                          pathname === item.href
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20" 
                            : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                          isCollapsed ? "justify-center" : "justify-between",
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

                        {/* Show badge when there are pending items */}
                        {item.showBadge && badgeCount > 0 && !isCollapsed && (
                          <Badge 
                            variant="destructive" 
                            className={cn(
                              "text-white text-xs px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center animate-pulse",
                              item.badgeType === 'counselors' ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
                            )}
                          >
                            {badgeCount}
                          </Badge>
                        )}

                        {/* Show badge as dot when collapsed */}
                        {item.showBadge && badgeCount > 0 && isCollapsed && (
                          <div className={cn(
                            "absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse",
                            item.badgeType === 'counselors' ? "bg-red-500" : "bg-orange-500"
                          )} />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.title}
                          {item.showBadge && badgeCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className={cn(
                                "text-white text-xs px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center",
                                item.badgeType === 'counselors' ? "bg-red-500" : "bg-orange-500"
                              )}
                            >
                              {badgeCount}
                            </Badge>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </TooltipProvider>
  );
};