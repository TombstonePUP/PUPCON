import AuthLayoutTemplate from './auth-simple-layout';
import GuideTour from '@/components/tour/guide-tour';
interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

import { TourProvider } from '@/components/tour/tour-context';
import { Monitor } from 'lucide-react';

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <TourProvider>
            {/* Mobile Block */}
            <div className="flex flex-col items-center justify-center h-svh p-6 text-center bg-[#f4f4f5] md:hidden">
                <div className="rounded-2xl bg-white p-8 shadow-sm border border-border max-w-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#7f1414]/10 mb-4">
                        <Monitor className="h-7 w-7 text-[#7f1414]" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Desktop Required</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
