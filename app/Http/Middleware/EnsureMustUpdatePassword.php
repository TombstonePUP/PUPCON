<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMustUpdatePassword
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userPasswordStatus = $request->user() && $request->user()->must_update_password;

        return $userPasswordStatus
            ? $next($request)
            : redirect()->back()->with('info', 'You already updated your password from default.');
    }
}
