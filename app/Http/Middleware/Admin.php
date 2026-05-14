<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $role = $request->user()->Roles->role_name;

        if ($role === 'Admin' || $role === 'Coordinator') {
            return $next($request);
        } else {
            return redirect()->back()->with('error', 'You do not have permission to access this page.');
        }
    }
}
