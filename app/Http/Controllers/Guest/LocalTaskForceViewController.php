<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use App\Models\LocalTaskForce;
use Illuminate\Support\Facades\Storage;

class LocalTaskForceViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $page = ContentPages::where('page', 'Local Task Force')->first();
        $local_task_force = LocalTaskForce::with('Members')->get();
        $local_task_force = $local_task_force->map(function ($task_force) {
            $task_force->profile_image_path = $task_force->profile_image_path ?
                Storage::url($task_force->profile_image_path) : null;
            return $task_force;
        });

        return inertia('about/local-task-force', [
            'page' => $page,
            'local_task_force' => $local_task_force,
        ]);
    }
}
