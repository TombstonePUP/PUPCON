// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import AuthLayout from '@/layouts/auth-layout';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export default function VerifyEmail({ status }: { status?: string }) {
    const [otp, setOtp] = useState('');
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.verify', [otp]));

    };

    return (
        <AuthLayout title="Verify email" description="Please enter the 6-digit code we sent to your email.">
            <Head title="Email verification" />
            {status && (
                <div className="mb-4 text-center text-sm font-small text-green-700">
                    {status}
                </div>
            )}
            <form onSubmit={submit} className="space-y-6 text-center">
                {/* OTP Input */}
                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    className="mx-auto mb-4 w-full justify-center gap-3 sm:w-80"
                    pattern={REGEXP_ONLY_DIGITS}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>

                {/* Submit button */}
                <Button type="submit" disabled={processing} className="mx-auto flex w-full max-w-xs items-center justify-center gap-2">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Verify
                </Button>

                {/* Secondary actions */}
                <div className="mt-4 flex flex-row-center justify-center space-between gap-4">
                    <TextLink href={route('logout')} method="post" className="block text-sm text-gray-500 hover:underline">
                        Log out
                    </TextLink>

                    <TextLink
                        href={route('verification.send')}
                        method="post"
                        as="button"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Resend code
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
