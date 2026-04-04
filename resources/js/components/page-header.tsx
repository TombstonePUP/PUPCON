import { LayoutDashboard } from 'lucide-react';
import { Card, CardTitle } from './ui/card';

type PageTitleProps = {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
};

export function PageTitle({ title, description, actions, icon = <LayoutDashboard className="size-5" /> }: PageTitleProps) {
  return (
    <Card className="relative w-full">
      <div className="flex items-center justify-between px-7 py-6 gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0 flex items-center justify-center size-12 rounded-lg bg-primary text-primary-foreground">
            {icon}
          </div>
          <div className="min-w-0">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {actions && <>{actions}</>}
      </div>
      <div className="px-7 border-t bg-muted/50 flex items-center min-h-6"></div>
    </Card>
  );
}