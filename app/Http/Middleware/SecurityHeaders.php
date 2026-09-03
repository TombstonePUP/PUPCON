<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME-type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Basic XSS protection (though modern browsers handle this better)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy (Liberalized for Development)
        // We allow all origins (*) to ensure external resources like Facebook, YouTube, and Google Maps are not blocked.
        $csp = "default-src 'self' * 'unsafe-inline' 'unsafe-eval' data: blob:; ";
        $csp .= "frame-src 'self' *; ";
        $csp .= "frame-ancestors 'self' *; ";
        $csp .= "object-src 'none';";

        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
