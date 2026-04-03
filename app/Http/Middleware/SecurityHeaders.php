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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
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
        
        // Content Security Policy (Basic starting point)
        // We allow self, and some common CDNs/Vite dev server for convenience
        $csp = "default-src 'self'; ";
        
        $viteDevServer = "http://192.168.1.23:5173 http://localhost:5173 ws://192.168.1.23:5173 ws://localhost:5173";
        $scriptSources = "'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net " . $viteDevServer;
        $styleSources = "'self' 'unsafe-inline' https://fonts.googleapis.com " . $viteDevServer;
        $connectSources = "'self' ws: wss: " . $viteDevServer;
        
        $csp .= "script-src " . $scriptSources . "; ";
        $csp .= "style-src " . $styleSources . "; ";
        $csp .= "font-src 'self' https://fonts.gstatic.com " . $viteDevServer . "; ";
        $csp .= "img-src 'self' data: blob: " . $viteDevServer . "; ";
        $csp .= "connect-src " . $connectSources . "; ";
        $csp .= "frame-ancestors 'self'; ";
        $csp .= "object-src 'none';";
        
        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
