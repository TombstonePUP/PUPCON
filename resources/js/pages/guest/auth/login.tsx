import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useId, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/guest/auth-layout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginPageProps {
  status?: string;
  canResetPassword: boolean;
}

// ─── Field ────────────────────────────────────────────────────────────────────
// Co-locates Label + Input + InputError. Generates stable IDs with useId()
// so label/input/error are always correctly associated — no manual id props.

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  /** Optional node rendered to the right of the label (e.g. "Forgot password?" link) */
  aside?: React.ReactNode;
  children: (a11y: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => React.ReactNode;
}

function Field({ label, error, required = false, aside, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  const a11y = {
    id,
    ...(error ? { 'aria-invalid': true as const, 'aria-describedby': errorId } : {}),
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label className="text-black" htmlFor={id}>
          {label}
          {required && (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
        {aside && <span className="ml-auto">{aside}</span>}
      </div>

      {children(a11y)}

      {error && <InputError id={errorId} message={error} />}
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function Login({ status, canResetPassword }: LoginPageProps) {
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm<LoginForm>({
    email: '',
    password: '',
    remember: false,
  });

  // ── Lockout countdown ──────────────────────────────────────────────────

  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!errors.email) return;
    const match = errors.email.match(/(\d+)\s*seconds?/i);
    if (match) setLockoutSeconds(parseInt(match[1], 10));
  }, [errors.email]);

  useEffect(() => {
    if (lockoutSeconds === null) return;

    if (lockoutSeconds <= 0) {
      setLockoutSeconds(null);
      clearErrors('email');
      return;
    }

    const timer = setInterval(() => {
      setLockoutSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds, clearErrors]);

  const isLocked = (lockoutSeconds ?? 0) > 0;
  const isSubmitting = processing || isLocked;

  // ── Submit ─────────────────────────────────────────────────────────────

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), { onFinish: () => reset('password') });
  };

  // ── Derived messages ───────────────────────────────────────────────────

  const emailError = isLocked ? `Too many attempts. Try again in ${lockoutSeconds} second${lockoutSeconds !== 1 ? 's' : ''}.` : errors.email;

  // ──────────────────────────────────────────────────────────────────────

  return (
    <AuthLayout title="Log in to your account" description="Enter your email and password below">
      <Head title="Log in" />

      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6">
          <Field label="Email address" error={emailError} required>
            {(a11y) => (
              <Input
                {...a11y}
                type="email"
                autoFocus
                tabIndex={1}
                autoComplete="email"
                placeholder="email@example.com"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="border-[#7a7a7a] text-black"
              />
            )}
          </Field>
          <Field
            label="Password"
            error={errors.password}
            required
            aside={
              canResetPassword && (
                <a
                  href={route('password.request')}
                  className="text-xs text-[#7a7a7a] underline-offset-4 hover:underline"
                  tabIndex={5}
                >
                  Forgot password?
                </a>
              )
            }
          >
            {(a11y) => (
              <Input
                {...a11y}
                type="password"
                tabIndex={2}
                autoComplete="current-password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="border-[#7a7a7a] text-black"
              />
            )}
          </Field>
          <div className="flex items-center gap-3">
            <Checkbox
              id="remember"
              name="remember"
              tabIndex={3}
              className="rounded"
              checked={data.remember}
              onCheckedChange={(checked) => setData('remember', checked === true)}
            />
            <Label htmlFor="remember" className="cursor-pointer font-normal text-[#383838]">
              Remember me
            </Label>
          </div>
          <Button type="submit" className="mt-4 w-full bg-[#7f1414] text-white hover:bg-[#9b1818]" tabIndex={4} disabled={isSubmitting}>
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {processing ? 'Logging in…' : isLocked ? `Locked (${lockoutSeconds}s)` : 'Log in'}
          </Button>
        </div>
      </form>

      {status && (
        <p role="status" className="my-2 text-center text-sm font-medium text-[#16a34a]">
          {status}
        </p>
      )}
    </AuthLayout>
  );
}
