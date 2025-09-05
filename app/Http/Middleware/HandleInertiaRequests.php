<?php

namespace App\Http\Middleware;

use App\Models\ParameterOutlines;
use App\Models\Programs;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $programs_under_survey = Programs::select('program_name', 'program_id')
            ->where('under_survey', true)
            ->get();

        $programs_under_survey = $programs_under_survey->map(function ($program) {
            $program->program_link = Str::of($program->program_name)->snake();
            return $program;
        });

        $outlines = ParameterOutlines::select('*')
            ->with(['AreaParameter', 'AreaParameter.Areas', 'AreaParameter.Areas.Programs', 'ParameterOutlineCategory'])
            ->get();

        $role = $request->user()?->Roles->first()?->role_name;

        if ($role === 'Admin' || $role === 'Coordinator') {
            $programs = Programs::select('program_name as title')->get();
        } elseif ($role === 'Chairman') {
            $programs = $request->user()?->Programs()->select('program_name as title')->get();
        } else {
            $programs = [];
        }
        if ($programs !== null) {
            $programs = $programs->map(function ($program) {
                $program->program_link = Str::of($program->title)->snake();
                return $program;
            });
        }

        return [
            ...parent::share($request),
            // 'name' => config('app.name'),
            // 'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'programs' => $programs,
            ],
            'guest' => [
                'programs' => $programs_under_survey,
                'outlines' => $outlines,
            ],
        ];
    }
}
