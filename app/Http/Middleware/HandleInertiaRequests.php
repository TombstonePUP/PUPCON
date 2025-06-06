<?php

namespace App\Http\Middleware;

use App\Models\Programs;
use Illuminate\Foundation\Inspiring;
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
        $role = $request->user()?->Roles->first()?->role_name;
        if ($role === 'Admin' || $role === 'Coordinator') {
            $programs = Programs::select('program_name as title')->get();
        } elseif ($role === 'Area Chair') {
            $programs = $request->user()?->Programs()->select('program_name as title')->get();
        } else {
            $programs = [];
        }

        return [
            ...parent::share($request),
            // 'name' => config('app.name'),
            // 'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'programs' => $programs,
            ],
        ];
    }
}
