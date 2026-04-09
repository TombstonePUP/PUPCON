import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SharedData } from '@/types';
import { CalendarClock, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'document_submission_deadline';

function getTimeLeft(deadline: Date) {
  // helper at the top of the component
  const now = new Date();
  const minDate = now.toISOString().slice(0, 16);
  const maxDate = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate())
    .toISOString()
    .slice(0, 16);
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
  const [error, setError] = useState<string | null>(null);
  const { auth } = usePage<SharedData>().props;
  const isAdmin = auth?.user?.roles?.role_name.toLowerCase() === 'admin';

  useEffect(() => {
    try {
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
    } catch (e) {
      console.error('Failed to load deadline from storage:', e);
    }
  }, []);

  useEffect(() => {
    if (!deadline) return;
    const tick = () => setTimeLeft(getTimeLeft(deadline));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const handleSave = () => {
    setError(null);

    try {
      if (!inputValue) {
        setError('Please select a date and time.');
        return;
      }

      const date = new Date(inputValue);
      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
      
      if (isNaN(date.getTime()) || date > twoYearsFromNow) {
        setError('Invalid date. Please try again.');
        return;
      }

      if (date <= new Date()) {
        setError('Deadline must be a future date and time.');
        return;
      }

      setDeadline(date);
      localStorage.setItem(STORAGE_KEY, date.toISOString());
      setOpen(false);
    } catch (e) {
      console.error('Failed to save deadline:', e);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleClear = () => {
    try {
      setDeadline(null);
      setTimeLeft(null);
      setInputValue('');
      setError(null);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear deadline:', e);
    }
  };

  const urgency =
    !timeLeft ? 'expired'
      : timeLeft.days < 1 ? 'critical'
        : timeLeft.days < 3 ? 'warning'
          : 'normal';

  const urgencyClasses = {
    expired: 'text-destructive',
    critical: 'text-destructive',
    warning: 'text-yellow-600',
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
    <Popover
      open={open}
      onOpenChange={(val) => {
        if (!isAdmin) return;
        setOpen(val);
        if (!val) setError(null);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-lg transition-all duration-150 ${isAdmin ? 'cursor-pointer' : 'cursor-default'
            } ${urgencyClasses[urgency]}`}
        >
          {!deadline ? (
            isAdmin && (
              <span className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground shadow-xs hover:bg-accent">
                <CalendarClock className="h-4 w-4" />
                Set Submission Deadline
              </span>
            )
          ) : (
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
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4" align="end">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Document Submission Deadline</p>
            <p className="text-xs text-muted-foreground">Set the target date and time</p>
          </div>
          {deadline && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <input
          type="datetime-local"
          value={inputValue}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          className={`mb-1 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${error ? 'border-destructive' : 'border-border'
            }`}
        />

        {/* Error field */}
        {error && (
          <p className="mb-3 text-xs text-destructive">{error}</p>
        )}
        {!error && <div className="mb-3" />}

        <Button
          type="button"
          className="w-full"
          size="sm"
          onClick={handleSave}
        >
          {deadline ? 'Update Deadline' : 'Set Deadline'}
        </Button>
      </PopoverContent>
    </Popover>
  );
}