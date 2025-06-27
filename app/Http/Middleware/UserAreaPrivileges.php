<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UserAreaPrivileges
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userRole = $request->user()?->Roles->first()?->role_name;

        if ($userRole === 'Admin' || $userRole === 'Coordinator') {
            return $next($request);
        } elseif ($userRole === 'Chairman') {
            $userAreaRole = $request->user()?->UserRoles->first()->Areas;
            if ($userAreaRole->firstWhere('area_id', $request->area_id)) {
                return $next($request);
            }
        }
        return redirect()->back()->with('error', 'You do not have permission to access this page.');
    }
}
