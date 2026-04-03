import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import GuideTour from '@/components/tour/guide-tour';
interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

import { TourProvider } from '@/components/tour/tour-context';

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <TourProvider>
            <AuthLayoutTemplate title={title} description={description}>
                <GuideTour />
                {children}
            </AuthLayoutTemplate>
        </TourProvider>
    );
}
