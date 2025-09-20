<?php

namespace App\Http\Middleware;

use App\Models\ParameterOutlines;
use App\Models\Programs;
use App\Traits\ProgramLinkFormats;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    use ProgramLinkFormats;
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

        $outlines = ParameterOutlines::select('*')
            ->with(['AreaParameter', 'AreaParameter.Areas', 'AreaParameter.Areas.Programs', 'ParameterOutlineCategory'])
            ->get();

        $role = $request->user()?->Roles->role_name;
        $programs = [];

        if ($role === 'Admin' || $role === 'Coordinator') {
            $programs = Programs::select('program_name')->get();
        } elseif ($role === 'Chairman') {
            $programs = $request->user()->Areas()
                ->with(['Programs' => function ($query) {
                    $query->select('programs.program_name', 'programs.program_id');
                }])
                ->get()
                ->pluck('Programs')
                ->flatten()
                ->unique('program_id');
        } else {
            $programs = collect();
        }

        $programs_under_survey = $programs_under_survey->map(function ($program) {
            $this->formatPrograms($program);
            return $program;
        });

        $programs = $programs->map(function ($program) {
            $this->formatPrograms($program);
            return $program;
        });

        return [
            ...parent::share($request),
            'flash' => [
                'title' => fn () => $request->session()->get('title'),
                'message' => fn () => $request->session()->get('message'),
            ],
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
