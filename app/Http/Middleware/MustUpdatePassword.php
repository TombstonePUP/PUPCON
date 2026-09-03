<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MustUpdatePassword
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userPasswordStatus = $request->user()?->must_update_password;

        return $userPasswordStatus
            ? redirect()->route('password.create')->with('warning', 'You must update your password before proceeding.')
            : $next($request);
    }
}
