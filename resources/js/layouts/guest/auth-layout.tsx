import GuideTour from '@/components/admin/tour/guide-tour';
import AuthLayoutTemplate from '@/layouts/guest/auth/auth-simple-layout';
interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

import { TourProvider } from '@/components/admin/tour/tour-context';
import { Monitor } from 'lucide-react';

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <TourProvider>
            {/* Mobile Block */}
            <div className="flex h-svh flex-col items-center justify-center bg-[#f4f4f5] p-6 text-center md:hidden">
                <div className="border-border max-w-sm rounded-2xl border bg-white p-8 shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#7f1414]/10">
                        <Monitor className="h-7 w-7 text-[#7f1414]" />
                    </div>
                    <h2 className="text-foreground mb-2 text-xl font-bold">Desktop Required</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Login access is securely restricted to desktop devices. Please use a PC or Laptop to proceed.
                    </p>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <AuthLayoutTemplate title={title} description={description}>
                    <GuideTour />
                    {children}
                </AuthLayoutTemplate>
            </div>
        </TourProvider>
    );
}
