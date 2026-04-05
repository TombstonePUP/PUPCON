import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { LayoutDashboard } from 'lucide-react';
import { Card, CardTitle } from './ui/card';

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

export function PageTitle({
  title,
  description,
  actions,
  icon = <LayoutDashboard className="size-5" />,
  indicator,
}: PageTitleProps) {
  return (
    <Card className="relative w-full border-0 rounded-none bg-transparent">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0 flex items-center justify-center size-12 rounded-lg bg-primary text-primary-foreground">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{title}</CardTitle>
              {indicator && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="relative flex size-2.5 shrink-0 cursor-default">
                        <span
                          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${indicator.color ?? 'bg-primary'}`}
                        />
                        <span
                          className={`relative inline-flex size-2.5 rounded-full ${indicator.color ?? 'bg-primary'}`}
                        />
                      </span>
                    </TooltipTrigger>
                    {indicator.tooltip && (
                      <TooltipContent>{indicator.tooltip}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {actions && <>{actions}</>}
      </div>
      {/* <div className="px-7 flex items-center min-h-6"></div> */}
    </Card>
  );
}