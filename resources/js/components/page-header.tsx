import { type ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

interface ActionCardProps {
  title?: string;
  children: ReactNode;
}

export function PageTitle({ title, description, actions }: PageTitleProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden w-full">
      <div className="flex items-center justify-between px-7 py-6 gap-6">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="px-7 border-t bg-muted/50 flex items-center min-h-6" >
      </div>
    </div>
  );
}

export function ActionCard({ title, children }: ActionCardProps) {
  return (
    <div className="rounded-xl border bg-card w-fit">
      {title && (
        <div className="px-5 py-3 border-b bg-muted/50">
          <h3 className="text-sm font-semibold text-foreground whitespace-nowrap">{title}</h3>
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}