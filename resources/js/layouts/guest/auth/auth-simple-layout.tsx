import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface LoginFormLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    className?: string;
}

export default function LoginFormLayout({ children, description, className }: LoginFormLayoutProps) {
    return (
        <div
            className={cn(
                'flex min-h-svh flex-col items-center justify-center gap-6 p-4 sm:p-6 md:p-10',
                'bg-muted relative overflow-hidden bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]',
                className,
            )}
        >
            {/* ─── Performance-Safe 2D Animated Background ─────────────────────── */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                {/* Floating Circle 1 */}
                <div
                    className="bg-primary/5 absolute top-[10%] left-[5%] h-64 w-64 animate-[pulse_8s_infinite] rounded-full blur-3xl transition-transform duration-[10s] hover:scale-110"
                    style={{ willChange: 'transform' }}
                ></div>

                {/* Floating Circle 2 */}
                <div
                    className="bg-primary/5 absolute right-[5%] bottom-[15%] h-80 w-80 animate-[pulse_12s_infinite] rounded-full blur-3xl transition-transform duration-[15s]"
                    style={{ willChange: 'transform' }}
                ></div>

                {/* Floating Geometric Shape 1 */}
                <div
                    className="border-primary/10 absolute top-1/4 right-[20%] h-32 w-32 rotate-12 animate-[spin_20s_linear_infinite] rounded-3xl border-2"
                    style={{ willChange: 'transform' }}
                ></div>

                {/* Floating Geometric Shape 2 */}
                <div
                    className="border-primary/10 absolute bottom-1/4 left-[15%] h-48 w-48 -rotate-12 animate-[pulse_10s_ease-in-out_infinite] rounded-full border"
                    style={{ willChange: 'transform' }}
                ></div>
            </div>

            {/* ─── Content ──────────────────────────────────────────────────────── */}
            <div className="animate-in fade-in zoom-in relative z-10 h-fit w-full max-w-4xl p-0 duration-500">
                <div className="flex flex-col gap-8">
                    <Card className="bg-card/90 border-border overflow-hidden rounded-2xl border p-0 shadow-none backdrop-blur-sm">
                        <CardContent className="grid items-center justify-center p-0 md:grid-cols-2">
                            <div className="flex h-full flex-col p-6 sm:p-10 md:p-15">
                                <div className="mb-8 grid place-items-center">
                                    <img
                                        className="h-14 object-contain transition-transform duration-300 hover:scale-105 sm:h-16 md:h-20"
                                        src="/images/pupcon-logo.png"
                                        alt="app logo"
                                    />
                                </div>
                                {description &&
                                    ((
                                        <p className="text-muted-foreground pb-8 text-center text-sm leading-relaxed font-medium">{description}</p>
                                    ) as any)}
                                {children}
                                <div className="mt-8 text-center">
                                    <Link
                                        href={route('home')}
                                        className="text-muted-foreground hover:text-primary hover:border-primary border-b border-transparent text-xs font-semibold tracking-wider uppercase transition-colors"
                                    >
                                        Back to Home Page
                                    </Link>
                                </div>
                            </div>
                            <div className="group border-border relative hidden h-full overflow-hidden border-l md:block">
                                <img
                                    src="/images/login-banner.png"
                                    alt="Login Banner"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
