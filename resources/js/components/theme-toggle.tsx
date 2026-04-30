import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme();

    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const Icon = resolvedTheme === 'dark' ? Sun : Moon;

    return (
        <Button variant="outline" size="icon" className={cn('h-8 w-8 shadow-none', className)} onClick={() => setTheme(next)}>
            <Icon className="h-4 w-4" />
        </Button>
    );
}
