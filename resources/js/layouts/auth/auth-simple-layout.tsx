import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface LoginFormLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    className?: string;
}

export default function LoginFormLayout({ children, title, description, className }: LoginFormLayoutProps) {
    return (
        <div className={cn('flex min-h-svh flex-col items-center justify-center gap-6 bg-[#f4f4f4] p-6 md:p-10', className)}>
            <div className="w-full max-w-4xl">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                {/* <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" /> */}
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">{/* <h1 className="text-xl font-medium">{title}</h1> */}</div>
                    </div>

                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid items-center justify-center p-0 md:grid-cols-2">
                            <div className="mt-15 flex h-full flex-col p-15">
                                <div className="grid place-items-center">
                                    <img className="object-fit h-18" src="images/pupcon-logo.png" alt="Login Banner" />
                                </div>
                                <p className="text-muted-foreground pt-5 pb-15 text-center text-sm">{description}</p>

                                {children}

                                {/* ✅ Go to Home Page link */}
                                <div className="mt-2 text-center">
                                    <Link href={route('home')} className="text-sm font-normal text-[#7f1414ad] hover:underline">
                                        Go to Home Page
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-muted relative hidden md:block">
                                <img src="/images/login-banner.png" alt="Login Banner" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        All Rights Reserved 2025
                    </div>
                </div>
            </div>
        </div>
    );
}
