<?php

namespace App\Http\Middleware;

use App\Models\Areas;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserAreaPrivileges
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userRole = $request->user()->Roles->role_name;

        if ($userRole === 'Admin' || $userRole === 'Coordinator') {
            return $next($request);
        } elseif ($userRole === 'Chairman') {
            $userAreaRole = $request->user()->Areas;
            $level = Areas::where('area_id', $request->area_id)->first()->Levels->is_active;
            $activeArea = Areas::where('area_id', $request->area_id)->first()->is_active;
            if ($userAreaRole->firstWhere('area_id', $request->area_id) && $level) {
                return $next($request);
            } elseif (! $activeArea && ! $level) {
                return $next($request);
            }
        }

        return redirect()->back()
            ->with('type', 'error')
            ->with('title', 'Access Denied')
            ->with('message', 'You do not have permission to access this area.');
    }
}
