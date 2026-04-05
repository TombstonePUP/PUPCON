import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useId, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

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
  children: (a11y: {
    id: string;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
  }) => React.ReactNode;
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
        <Label className='text-black' htmlFor={id}>
          {label}
          {/* {required && <span className="text-destructive ml-0.5" aria-hidden="true">*</span>} */}
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

  const emailError = isLocked
    ? `Too many attempts. Try again in ${lockoutSeconds} second${lockoutSeconds !== 1 ? 's' : ''}.`
    : errors.email;

  // ──────────────────────────────────────────────────────────────────────

  return (
    <AuthLayout
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <Head title="Log in" />

      <form className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6">
          <Field label="Email Address" error={emailError} required>
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
                className="rounded-xl border-gray-200 focus-visible:ring-[#7f1414]"
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
                  className="text-xs font-medium text-[#7a7a7a] underline-offset-4 hover:underline hover:text-[#7f1414] transition-colors"
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
                className="rounded-xl border-gray-200 focus-visible:ring-[#7f1414]"
              />
            )}
          </Field>
          <div className="flex items-center gap-3">
            <Checkbox
              id="remember"
              name="remember"
              tabIndex={3}
              className="rounded-md border-gray-300 data-[state=checked]:bg-[#7f1414] data-[state=checked]:border-[#7f1414]"
              checked={data.remember}
              onCheckedChange={(checked) => setData('remember', checked === true)}
            />
            <Label htmlFor="remember" className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Remember me
            </Label>
          </div>
          <Button
            type="submit"
            className="mt-4 w-full h-11 rounded-xl bg-[#7f1414] text-white hover:bg-[#9b1818] shadow-none border-none transition-all active:scale-[0.98]"
            tabIndex={4}
            disabled={isSubmitting}
          >
            {processing && (
              <LoaderCircle className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
            )}
            {processing
              ? 'Logging in…'
              : isLocked
                ? `Locked (${lockoutSeconds}s)`
                : 'Sign In'}
          </Button>
        </div>
      </form>

      {status && (
        <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-100 animate-in fade-in slide-in-from-top-2">
          <p role="status" className="text-center text-sm font-medium text-green-700">
            {status}
          </p>
        </div>
      )}
    </AuthLayout>
  );
}