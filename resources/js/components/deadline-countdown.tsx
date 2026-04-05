import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SharedData } from '@/types';
import { CalendarClock, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'document_submission_deadline';

function getTimeLeft(deadline: Date) {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, diff };
}

export default function DeadlineCountdown() {
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { auth } = usePage<SharedData>().props;
  const isAdmin = auth?.user?.roles?.role_name.toLowerCase() === 'admin';

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const date = new Date(stored);
      if (date > new Date()) {
        setDeadline(date);
        setInputValue(date.toISOString().slice(0, 16));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Countdown tick
  useEffect(() => {
    if (!deadline) return;
    const tick = () => setTimeLeft(getTimeLeft(deadline));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const handleSave = () => {
    if (!inputValue) return;
    const date = new Date(inputValue);
    if (isNaN(date.getTime()) || date <= new Date()) return;
    setDeadline(date);
    localStorage.setItem(STORAGE_KEY, date.toISOString());
    setOpen(false);
  };

  const handleClear = () => {
    setDeadline(null);
    setTimeLeft(null);
    setInputValue('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const urgency =
    !timeLeft ? 'expired'
      : timeLeft.days < 1 ? 'critical'
        : timeLeft.days < 3 ? 'warning'
          : 'normal';

  const urgencyClasses = {
    expired: 'text-destructive',
    critical: 'text-destructive',
    warning: 'text-warning-foreground',
    normal: 'text-foreground',
  };

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );

  const Divider = () => (
    <span className="mb-3 text-lg font-bold text-muted-foreground">:</span>
  );

  return (
    <Popover open={isAdmin ? open : false} onOpenChange={isAdmin ? setOpen : undefined}>
      <PopoverTrigger asChild>
        {!deadline ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-muted-foreground"
          >
            <CalendarClock className="h-4 w-4" />
            Set Submission Deadline
          </Button>
        ) : (
          <button
            className={`group flex items-center gap-3 rounded-lg transition-all duration-150 hover:shadow-sm ${isAdmin ? 'cursor-pointer' : 'cursor-default'} ${urgencyClasses[urgency]}`}
          >
            {/* <CalendarClock className="h-4 w-4 shrink-0" /> */}
            <div className="text-left">
              <p className="text-[10px] font-medium text-muted-foreground text-right">Deadline Countdown</p>
              {timeLeft ? (
                <div className="flex items-end gap-1">
                  <Unit value={timeLeft.days} label="days" />
                  <Divider />
                  <Unit value={timeLeft.hours} label="hrs" />
                  <Divider />
                  <Unit value={timeLeft.minutes} label="min" />
                  <Divider />
                  <Unit value={timeLeft.seconds} label="sec" />
                </div>
              ) : (
                <p className="text-sm font-semibold text-destructive">Deadline passed</p>
              )}
            </div>
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4" align="end">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Document Submission Deadline</p>
            <p className="text-xs text-muted-foreground">Set the target date and time</p>
          </div>
          {deadline && (
            <button onClick={handleClear} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <input
          type="datetime-local"
          value={inputValue}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => setInputValue(e.target.value)}
          className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button className="w-full" size="sm" onClick={handleSave} disabled={!inputValue}>
          {deadline ? 'Update Deadline' : 'Set Deadline'}
        </Button>
      </PopoverContent>
    </Popover>
  );
}