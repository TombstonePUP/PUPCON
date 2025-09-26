<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'otp' => 'required|digits:6',
        ]);
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if (!Hash::check($validated['otp'], $user->otp)) {
            return redirect()->back()->withErrors(['otp' => 'The provided OTP is invalid.']);
        }
        if ($user->otp_expires_at->isPast()) {
            return redirect()->back()->withErrors(['otp' => 'The provided OTP has expired.']);
        }

        if ($user->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
