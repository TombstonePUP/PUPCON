import { LucideIcon, MousePointerClick } from 'lucide-react';

type EmptyStateProps = {
    icon?: LucideIcon;
    title: string;
    description?: string;
};

export function EmptyState({ icon: Icon = MousePointerClick, title, description }: EmptyStateProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <div className="bg-muted rounded-full p-4">
                <Icon className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-foreground/80 text-sm font-medium">{title}</p>
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
        </div>
    );
}
