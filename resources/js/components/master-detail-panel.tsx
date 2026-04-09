
import { EmptyState } from '@/components/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { CircleAlert, EditIcon, MousePointerClick, Trash2 } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface ListItem {
  id: number | string;
  label: string;
  hasError?: boolean;
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
  <button className={`p-1 text-muted-foreground transition-colors hover:text-foreground ${className}`} type="button" {...props}>
    {children}
  </button>
);

interface MasterDetailPanelProps {
  // Header
  title: string;
  description?: string;
  errorCount?: number;

  // List
  items: ListItem[];
  selectedId: number | string | null;
  onSelect: (id: number | string) => void;
  onAdd: () => void;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;

  // Icons
  emptyListIcon: LucideIcon;
  emptyListTitle: string;
  addIcon: LucideIcon;
  addLabel?: string;

  // Detail panel
  detail: React.ReactNode;
  emptyDetailIcon?: LucideIcon;
  emptyDetailTitle?: string;
  emptyDetailDescription?: string;
}

export function MasterDetailPanel({
  title,
  description,
  errorCount = 0,
  items,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  emptyListIcon,
  emptyListTitle,
  addIcon: AddIcon,
  addLabel,
  detail,
  emptyDetailIcon = MousePointerClick,
  emptyDetailTitle = 'Nothing selected',
  emptyDetailDescription = 'Select an item from the list to view details',
}: MasterDetailPanelProps) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-6">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
          {title}
          {errorCount > 0 && (
            <Badge
              variant="destructive"
              className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium"
            >
              {errorCount}
            </Badge>
          )}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Panel */}
      <div className="flex min-h-[300px] rounded-lg border border-border">
        {/* Left: list */}
        <div className="flex w-1/3 flex-col border-r border-border bg-muted/30 p-4">
          <h4 className="mb-3 text-xs text-muted-foreground">Select an Item</h4>
          <div className="max-h-[250px] flex-1 overflow-y-auto space-y-1">
            {items.length === 0 ? (
              <div className="h-[200px]">
                <EmptyState icon={emptyListIcon} title={emptyListTitle} />
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${
                    item.id === selectedId
                      ? 'border-primary/30 bg-primary/10 text-primary/95'
                      : 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm">{item.label}</span>
                    {item.hasError && (
                      <CircleAlert className="inline-block h-4 w-4 shrink-0 text-destructive" />
                    )}
                  </div>
                  <div className="flex shrink-0 items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                    <ActionButton
                      onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}
                      className="cursor-pointer rounded-md hover:bg-muted hover:text-foreground"
                    >
                      <EditIcon className="h-4 w-4" />
                    </ActionButton>
                    <ActionButton
                      onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                      className="cursor-pointer rounded-md hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </ActionButton>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-auto border-t border-border pt-4">
            <Button onClick={onAdd} variant="default" className="w-full text-xs">
              <AddIcon className="h-4 w-4" />
              {addLabel && <span className="hidden xl:inline">{addLabel}</span>}
            </Button>
          </div>
        </div>

        {/* Right: detail */}
        <div className="w-2/3 p-6">
          {selectedId !== null && detail ? (
            detail
          ) : (
            <EmptyState
              icon={emptyDetailIcon}
              title={emptyDetailTitle}
              description={emptyDetailDescription}
            />
          )}
        </div>
      </div>
    </div>
  );
}