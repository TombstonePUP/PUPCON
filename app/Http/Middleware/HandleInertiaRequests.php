<?php

namespace App\Http\Middleware;

use App\Models\ParameterOutlines;
use App\Models\Programs;
use App\Traits\ProgramLinkFormats;
use Illuminate\Http\Request;
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
        $programs_under_survey = Programs::select('program_name', 'program_id')
            ->where('under_survey', true)
            ->where('is_active', true)
            ->get();

        $outlines = ParameterOutlines::select('*')
            ->with([
                'AreaParameter',
                'AreaParameter.Areas' => function ($areaQuery) {
                    $areaQuery->where('archive', false);
                },
                'AreaParameter.Areas.Levels' => function ($programQuery) {
                    $programQuery->where('is_active', true)->with([
                        'Programs' => function ($programsQuery) {
                            $programsQuery->where('under_survey', true);
                        },
                    ]);
                },
            ])
            ->whereHas('AreaParameter.Areas', function ($areaQuery) {
                $areaQuery->where('archive', false);
            })
            ->whereHas('AreaParameter.Areas.Levels', function ($programQuery) {
                $programQuery->where('is_active', true);
            })
            ->whereHas('AreaParameter.Areas.Levels.Programs', function ($programsQuery) {
                $programsQuery->where('under_survey', true);
            })
            ->get();

        $outlines = $outlines->map(function ($outline) {
            $levels = optional(optional(optional($outline->AreaParameter)->Areas)->Levels);

            if ($levels->Programs) {
                $levels->Programs = $this->formatPrograms($levels->Programs);
            }

            return $outline;
        });

        $role = $request->user()?->Roles->role_name;
        $user = $request->user();
        $programs = [];

        if ($role === 'Admin' || $role === 'Coordinator') {
            $programs = Programs::select('program_name', 'program_id')
                ->where('is_active', true)
                ->whereHas('latestLevel')
                ->with('latestLevel')
                ->get();
        } elseif ($role === 'Chairman') {
            $programs = Programs::whereHas('latestLevel.Areas', function ($query) use ($user) {
                $query->whereIn('areas.area_id', $user->Areas->pluck('area_id'));
            })
                ->with([
                    'latestLevel' => function ($levelQuery) use ($user) {
                        $levelQuery->whereIn('accreditation_level_id', $user->Areas->pluck('accreditation_level_id'));
                    },
                ])
                ->where('is_active', true)
                ->get()
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

        $user = $request->user() ? $request->user()->load('Areas') : null;

        return [
            ...parent::share($request),
            'flash' => [
                'type' => fn () => $request->session()->get('type'),
                'title' => fn () => $request->session()->get('title'),
                'message' => fn () => $request->session()->get('message'),
            ],
            'auth' => [
                'user' => $user,
                'programs' => $programs,
            ],
            'guest' => [
                'programs' => $programs_under_survey,
                'outlines' => $outlines,
            ],
        ];
    }
}
