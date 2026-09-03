<?php

namespace App\Http\Middleware;

use App\Models\Programs;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccreditationLevelExists
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $exists = Programs::where('program_id', $request->program_id)
            ->whereHas('Levels', fn ($query) => $query->where('accreditation_level_id', $request->level_id))
            ->exists();

        if (! $exists) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Invalid Accreditation Level')
                ->with('message', 'The specified accreditation level does not exist for the selected program.');
        }

        return $next($request);
    }
}
