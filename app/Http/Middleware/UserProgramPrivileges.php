<?php

namespace App\Http\Middleware;

use App\Models\Programs;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class UserProgramPrivileges
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $program = Str::of($request->program_name)->replace('_', ' ')->title();

        if ($this->programAccess($request->user(), $program)) {
            return $next($request);
        }

        return redirect()->back()->with('error', 'You do not have permission to access this page.');
    }

    private function programAccess($user, $program)
    {
        $role = $user->Roles->first()?->role_name;

        return match ($role) {
            'Admin', 'Coordinator' => Programs::where('program_name', $program)->exists(),
            'Chairman' => $user->Programs->contains('program_name', $program),
            default => false,
        };
    }
}
