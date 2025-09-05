<?php

namespace App\Http\Middleware;

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
        $userRole = $request->user()?->Roles->first()?->role_name;

        if ($userRole === 'Admin' || $userRole === 'Coordinator') {
            return $next($request);
        } elseif ($userRole === 'Chairman') {
            $userProgramRole = $request->user()->Programs;
            if ($userProgramRole->firstWhere('program_name', $program)) {
                return $next($request);
            }
        }
        return redirect()->back()->with('error', 'You do not have permission to access this page.');
    }
}
