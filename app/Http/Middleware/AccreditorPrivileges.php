<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AccreditorPrivileges
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $role = $request->user()?->Roles->first()?->role_name;

        if ($role === 'Accreditor') {
            return $next($request);
        } else {
            return redirect()->back()->with('error', 'You do not have permission to access this page.');
        }
    }
}
