import { LayoutDashboard } from 'lucide-react';

type PageTitleProps = {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
};

export function PageTitle({ title, description, actions, icon = <LayoutDashboard className="size-5" /> }: PageTitleProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden w-full">
      <div className="flex items-center justify-between px-7 py-6 gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0 flex items-center justify-center size-12 rounded-lg bg-primary text-primary-foreground">
            {icon}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="px-7 border-t bg-muted/50 flex items-center min-h-6"></div>
    </div>
  );
}