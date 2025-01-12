'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Loader';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';
import { useSelector } from 'react-redux';

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
    '/resources/*'
];

export default function AuthWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading } = useLoadUserQuery(undefined, {
        refetchOnMountOrArgChange: true, // Refetch on component mount
        refetchOnFocus: true, // Refetch when window regains focus
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

    if (isLoading && !publicRoutes.includes(pathname) && 
        !pathname.startsWith('/resources/')) {
        return <Loader />;
    }

    return <>{children}</>;
}