import { LayoutDashboard } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type IndicatorProps = {
    color?: string; // tailwind bg class e.g. 'bg-success', 'bg-destructive'
    tooltip?: React.ReactNode;
};

type PageTitleProps = {
    title: React.ReactNode;
    description?: string;
    actions?: React.ReactNode;
    icon?: React.ReactNode;
    indicator?: IndicatorProps;
};

export function PageTitle({ title, description, actions, icon = <LayoutDashboard className="size-5" />, indicator }: PageTitleProps) {
    return (
        <Card className="relative w-full">
            <div className="flex items-center justify-between gap-6 px-7 py-6">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-lg">{icon}</div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-foreground text-xl leading-tight font-semibold tracking-tight">{title}</CardTitle>
                            {indicator && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="relative flex size-2.5 shrink-0 cursor-default">
                                                <span
                                                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${indicator.color ?? 'bg-primary'}`}
                                                />
                                                <span className={`relative inline-flex size-2.5 rounded-full ${indicator.color ?? 'bg-primary'}`} />
                                            </span>
                                        </TooltipTrigger>
                                        {indicator.tooltip && <TooltipContent>{indicator.tooltip}</TooltipContent>}
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        {description && <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>}
                    </div>
                </div>
                {actions && <>{actions}</>}
            </div>
            <div className="bg-muted/50 flex min-h-6 items-center border-t px-7"></div>
        </Card>
    );
}
