'use client';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ActivityLogs } from '@/types/dashboard';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

const TYPE_FILTERS = ['All', 'Document', 'Users', 'Content'] as const;

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

const SEEN_KEY = 'activity_feed_last_seen';

interface ActivityFeedProps {
  logs: ActivityLogs[];
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  const [filter, setFilter] = useState<string>('All');
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(SEEN_KEY) ?? 0);
    } catch {
      return 0;
    }
  });

  const unseenCount = logs.filter(
    (l) => new Date(l.activity_date).getTime() > lastSeen,
  ).length;

  const filtered = (filter === 'All' ? logs : logs.filter((l) => l.type === filter)).slice(0, 7);

  const handleOpen = (val: boolean) => {
    setOpen(val);
    if (val) {
      const now = Date.now();
      setLastSeen(now);
      localStorage.setItem(SEEN_KEY, String(now));
    }
  };



  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-8 w-8 shadow-none">
          <Bell className="h-4 w-4" />
          {unseenCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unseenCount > 9 ? '9+' : unseenCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="text-sm font-medium text-foreground">Activity Feed</p>
          {unseenCount > 0 && (
            <span className="text-xs text-muted-foreground">{unseenCount} new</span>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 px-4 py-2.5 border-b flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors ${filter === f
                ? 'bg-secondary text-foreground border-border'
                : 'text-muted-foreground border-border/50 hover:border-border'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="flex flex-col divide-y divide-border max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activity found.</p>
          ) : (
            filtered.map((log) => {
              const isUnseen = new Date(log.activity_date).getTime() > lastSeen;
              return (
                <div
                  key={log.activity_log_id}
                  className={`flex gap-3 px-4 py-3 min-w-0 ${isUnseen ? 'bg-muted/40' : ''}`}
                >
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-muted text-muted-foreground">
                      {initials(log.full_name)}
                    </div>
                    {isUnseen && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-0.5 gap-1">
                      <span className="text-xs font-medium text-foreground truncate">{log.full_name}</span>
                      <p className="text-xs text-muted-foreground/60 ml-auto shrink-0">{timeAgo(log.activity_date)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{log.description}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t px-4 py-2.5">
          <button
            onClick={() => {
              setOpen(false);
              router.visit(route('dashboard'), {
                onFinish: () => {
                  setTimeout(() => {
                    document.getElementById('stat-table')?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                },
              });
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center"
          >
            See all activity
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}