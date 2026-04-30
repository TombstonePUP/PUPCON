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
        'bg-muted bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px] relative overflow-hidden',
        className
      )}
    >
      {/* ─── Performance-Safe 2D Animated Background ─────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Floating Circle 1 */}
        <div 
          className="absolute top-[10%] left-[5%] h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-[pulse_8s_infinite] transition-transform duration-[10s] hover:scale-110"
          style={{ willChange: 'transform' }}
        ></div>
        
        {/* Floating Circle 2 */}
        <div 
          className="absolute bottom-[15%] right-[5%] h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-[pulse_12s_infinite] transition-transform duration-[15s]"
          style={{ willChange: 'transform' }}
        ></div>

        {/* Floating Geometric Shape 1 */}
        <div 
          className="absolute top-1/4 right-[20%] h-32 w-32 rotate-12 border-2 border-primary/10 rounded-3xl animate-[spin_20s_linear_infinite]"
          style={{ willChange: 'transform' }}
        ></div>

        {/* Floating Geometric Shape 2 */}
        <div 
          className="absolute bottom-1/4 left-[15%] h-48 w-48 -rotate-12 border border-primary/10 rounded-full animate-[pulse_10s_ease-in-out_infinite]"
          style={{ willChange: 'transform' }}
        ></div>
      </div>

      {/* ─── Content ──────────────────────────────────────────────────────── */}
      <div className="w-full h-fit max-w-4xl p-0 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col gap-8">
          <Card className="overflow-hidden p-0 bg-card/90 backdrop-blur-sm border border-border shadow-none rounded-2xl">
            <CardContent className="grid items-center justify-center p-0 md:grid-cols-2">
              <div className="flex h-full flex-col p-6 sm:p-10 md:p-15">
                <div className="grid place-items-center mb-8">
                  <img 
                    className="object-contain h-14 sm:h-16 md:h-20 transition-transform duration-300 hover:scale-105" 
                    src="/images/pupcon-logo.png" 
                    alt="app logo" 
                  />
                </div>
                {description && (
                  <p className="text-muted-foreground pb-8 text-center text-sm font-medium leading-relaxed">
                    {description}
                  </p>
                ) as any}
                {children}
                <div className="mt-8 text-center">
                  <Link
                    href={route('home')}
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary"
                  >
                    Back to Home Page
                  </Link>
                </div>
              </div>
              <div className="relative hidden h-full md:block group overflow-hidden border-l border-border">
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
