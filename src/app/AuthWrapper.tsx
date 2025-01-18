'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Loader';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';
import { useSelector } from 'react-redux';
import OfflineStatusHandler from '@/components/OfflineStatusHandler';
import { useTokenSync } from './hooks/useTokenSync';

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
    useTokenSync()
    const { isLoading, isError } = useLoadUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    
    const { user, isAuthenticated } = useSelector((state: any) => state.auth);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const isPublicRoute = publicRoutes.some(route => 
            pathname === route || pathname.startsWith('/resources/'));

        if (!isPublicRoute && !isLoading) {
            if (!isAuthenticated || !user) {
                router.push('/signin');
            }
        }
    }, [pathname, isLoading, isAuthenticated, user, router]);

    // Wrap everything in the OfflineStatusHandler
    return (
        <OfflineStatusHandler>
            {isLoading && !publicRoutes.includes(pathname) && 
             !pathname.startsWith('/resources/') ? (
                <Loader />
            ) : (
                children
            )}
        </OfflineStatusHandler>
    );
}