<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\LocalTaskForce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class LocalTaskForceViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $page = ContentPages::where('page', 'Local Task Force')->first();
        $local_task_force = LocalTaskForce::with('Members')->get();
        $local_task_force = $local_task_force->map(function ($task_force) {
            $task_force->profile_image_path = $task_force->profile_image_path ?
                Storage::url($task_force->profile_image_path) : null;

            return $task_force;
        });

        return inertia('guest/about/local-task-force', [
            'page' => $page,
            'local_task_force' => $local_task_force,
        ]);
    }
}
