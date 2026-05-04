<?php

namespace App\Http\Controllers\Auth;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UpdatePasswordController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('guest/auth/update-password');
    }

    public function update(Request $request)
    {
        $validated = $request->validate(
            [
            'password' => 'required|string',
            'password_confirmation' => 'required|string|min:8|confirmed:password',
            ],
            [
                'password.required' => 'Current password is required',
                'password_confirmation.required' => 'New password is required',
                'password_confirmation.min' => 'New password must be at least 8 characters',
                'password_confirmation.confirmed' => 'New password confirmation does not match',
            ]
        );
        $user = $request->user();
        $user->password = bcrypt($validated['password_confirmation']);
        $user->must_update_password = false;
        $user->updated_at = now();
        $user->save();

        ActivityLogService::authenticationLog(
            userId: $user->user_id,
            activity: ActivityLogAction::UpdatePassword,
            description: "New Password Updated After Reset",
        );

        return redirect()->intended(route('dashboard', absolute: false).'?password-updated=1')
            ->with('success', 'Password updated successfully.');
    }
}
