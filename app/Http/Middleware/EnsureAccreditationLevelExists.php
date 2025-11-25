<?php

namespace App\Http\Middleware;

use App\Models\Programs;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class EnsureAccreditationLevelExists
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $level_id = $request->level_id;

        $program = Programs::where('program_name', 'ILIKE', $program)
            ->with([
                'Levels' => function ($query) use ($level_id) {
                    $query->where('accreditation_level_id', $level_id);
                },
            ])
            ->first();

        if (!$program) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Invalid Accreditation Level')
                ->with('message', 'The specified accreditation level does not exist for the selected program.');
        }

        return $next($request);
    }
}
