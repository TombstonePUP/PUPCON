<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Exhibits;
use Illuminate\Support\Facades\Storage;

class ExhibitsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $exhibits = Exhibits::with(['ExhibitOutlines.ExhibitFiles'])->get();

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
