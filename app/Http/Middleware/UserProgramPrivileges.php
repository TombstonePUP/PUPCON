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
        // $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::findOrFail($request->program_id);
        $program = $program->program_id;

        if ($this->programAccess($request->user(), $program)) {
            return $next($request);
        }

        return redirect()->back()
            ->with('type', 'error')
            ->with('title', 'Access Denied')
            ->with('message', 'You do not have permission to access this program.');
    }

    private function programAccess($user, $program)
    {
        $role = $user->Roles->role_name;

        return match ($role) {
            'Admin', 'Coordinator' => Programs::findOrFail($program),
            'Chairman' => $user->Areas()
                ->whereHas('Levels.Programs', function ($query) use ($program) {
                    $query->where('program_id', $program);
                })
                ->exists(),
            default => false,
        };
    }
}
