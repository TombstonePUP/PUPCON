<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Notifications\UserVerification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user && $user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        // If no OTP yet or OTP expired, generate a new one
        if (!$user->otp || $user->otp_expires_at < now()) {
            $otp = rand(100000, 999999);

            $user->otp = Hash::make($otp);
            $user->otp_expires_at = now()->addMinutes(1);
            $user->save();

            // Send OTP email
            $user->notify(new UserVerification($user->email, $otp));
        }

        return Inertia::render('auth/verify-email');
    }
}
