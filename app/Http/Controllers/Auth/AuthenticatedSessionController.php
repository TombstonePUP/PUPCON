<?php

namespace App\Http\Controllers\Auth;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\File;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        $folder = public_path('images/landing');
        $files = File::files($folder);

        $images = array_map(fn($file) => asset('images/landing/' . $file->getFilename()), $files);

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'carouselImages' => $images,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $userRole = $request->user()->Roles->role_name;

        ActivityLogService::authenticationLog(
            userId: $request->user()->user_id,
            activity: ActivityLogAction::Login,
            description: "Account Authenticated Successfully",
        );

        return $userRole === 'Accreditor'
            ? redirect()->intended(route('programs.index', absolute: false))
            : redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        ActivityLogService::authenticationLog(
            userId: $request->user()->user_id,
            activity: ActivityLogAction::Logout,
            description: "Account Logged out",
        );

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
