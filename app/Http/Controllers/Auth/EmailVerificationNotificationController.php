<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Notifications\UserVerification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $otp = rand(100000, 999999);

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $user->otp = Hash::make($otp);
        $user->otp_expires_at = now()->addMinutes(1);
        $user->save();

        $user->notify(new UserVerification($user->email, $otp));

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'OTP Sent')
            ->with('message', 'Resent Verification OTP to your email address.');
    }
}
