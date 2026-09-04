'use client';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ActivityLogs } from '@/types/dashboard';
import { router } from '@inertiajs/react';
import { CheckCheck, Bell, FileX2, LogIn, Pencil, Trash, Upload, UserRoundPlus, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

const TYPE_FILTERS = ['All', 'File Management', 'Content Management', 'User Management', 'Authentication'] as const;

// Map an activity action (from ActivityLogAction enum) to an icon + tone so the
// feed is scannable at a glance. Falls back to a neutral dot for unknown verbs.
const ACTION_META: Record<string, { Icon: LucideIcon; className: string }> = {
    Upload: { Icon: Upload, className: 'text-primary' },
    Download: { Icon: Upload, className: 'text-muted-foreground' },
    Approve: { Icon: CheckCheck, className: 'text-green-600 dark:text-green-400' },
    Reject: { Icon: FileX2, className: 'text-destructive' },
    Revert: { Icon: Pencil, className: 'text-amber-600 dark:text-amber-400' },
    Delete: { Icon: Trash, className: 'text-destructive' },
    Login: { Icon: LogIn, className: 'text-muted-foreground' },
    Logout: { Icon: LogIn, className: 'text-muted-foreground' },
    Create: { Icon: UserRoundPlus, className: 'text-primary' },
    Update: { Icon: Pencil, className: 'text-muted-foreground' },
};

function actionMeta(activity: string) {
    const fallback = { Icon: Upload, className: 'text-muted-foreground' };
    const meta = ACTION_META[activity];
    return meta ?? { ...fallback, Icon: activity ? fallback.Icon : CheckCheck };
}

function initials(name: string) {
    return name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
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

    const unseenCount = logs.filter((l) => new Date(l.activity_date).getTime() > lastSeen).length;

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
                        <span className="bg-destructive text-destructive-foreground absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                            {unseenCount > 9 ? '9+' : unseenCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0" align="end">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <p className="text-foreground text-sm font-medium">Activity Feed</p>
                    {unseenCount > 0 && <span className="text-muted-foreground text-xs">{unseenCount} new</span>}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-1.5 border-b px-4 py-2.5">
                    {TYPE_FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                                filter === f
                                    ? 'bg-secondary text-foreground border-border'
                                    : 'text-muted-foreground border-border/50 hover:border-border'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Feed */}
                <div className="divide-border flex max-h-80 flex-col divide-y overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center text-sm">No activity found.</p>
                    ) : (
                        filtered.map((log) => {
                            const isUnseen = new Date(log.activity_date).getTime() > lastSeen;
                            const { Icon, className } = actionMeta(log.activity);
                            return (
                                <div key={log.activity_log_id} className={`flex min-w-0 gap-3 px-4 py-3 ${isUnseen ? 'bg-muted/40' : ''}`}>
                                    <div className="relative shrink-0">
                                        <div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                                            {initials(log.full_name)}
                                        </div>
                                        <span className={`absolute -bottom-1 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border ${className}`}>
                                            <Icon className="h-2.5 w-2.5" />
                                        </span>
                                        {isUnseen && <span className="bg-destructive absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-0.5 flex items-center gap-1">
                                            <span className="text-foreground truncate text-xs font-medium">{log.full_name}</span>
                                            {log.type !== 'File Management' && (
                                                <span className="bg-secondary text-muted-foreground shrink-0 rounded-full px-1.5 py-0.5 text-[0.625rem]">
                                                    {log.type}
                                                </span>
                                            )}
                                            <p className="text-muted-foreground/60 ml-auto shrink-0 text-xs">{timeAgo(log.activity_date)}</p>
                                        </div>
                                        <p className="text-muted-foreground truncate text-xs">
                                            <span className="capitalize text-foreground/80">{log.activity}</span> {log.description}
                                        </p>
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
                        className="text-muted-foreground hover:text-foreground w-full text-center text-xs transition-colors"
                    >
                        See all activity
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
