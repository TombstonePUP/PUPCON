<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Exhibits;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class ExhibitsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $exhibits = Exhibits::with([
            'ExhibitOutlines' => function ($query) {
                $query->with([
                    'ExhibitFiles' => function ($q) {
                        $q->whereHas('FileStatus', function ($fs) {
                            $fs->where('status_name', 'Approved');
                        });
                    },
                ]);
            },
        ])->get();

        $exhibits->map(function ($exhibit) {

            if ($exhibit->image_path) {
                $exhibit->image_path = Storage::url($exhibit->image_path);
            }
            $exhibit->ExhibitOutlines->map(function ($outline) {
                if ($outline->ExhibitFiles) {
                    $outline->ExhibitFiles->file_path = $outline->ExhibitFiles->file_path
                        ? Storage::url($outline->ExhibitFiles->file_path)
                        : null;
                }

                return $outline;
            });

            return $exhibit;
        });

        return inertia('guest/exhibits', [
            'exhibits' => $exhibits,
        ]);
    }
}
