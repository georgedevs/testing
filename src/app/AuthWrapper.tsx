'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Loader';
import { useSelector } from 'react-redux';
import OfflineStatusHandler from '@/components/OfflineStatusHandler';
import { useAuthCheck } from '@/utils/useAuthCheck';
import { Toaster } from 'sonner';

const publicRoutes = [
    '/',
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/about',
    '/services',
    '/regcounselor',
    '/resources',
    '/resources/*',
    '/stories'
];

export default function AuthWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, checkComplete } = useAuthCheck();
    
    const { user, isAuthenticated } = useSelector((state: any) => state.auth);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Only run this effect after auth check is complete
        if (!checkComplete) return;

        const isPublicRoute = publicRoutes.some(route => 
            pathname === route || pathname?.startsWith('/resources/'));

        if (!isPublicRoute) {
            if (!isAuthenticated || !user) {
                router.push('/signin');
            }
        }
    }, [pathname, checkComplete, isAuthenticated, user, router]);

    return (
        <OfflineStatusHandler>
            {isLoading && !publicRoutes.includes(pathname || '') && 
             !pathname?.startsWith('/resources/') ? (
                <Loader />
            ) : (
                children
            )}
        </OfflineStatusHandler>
    );
}