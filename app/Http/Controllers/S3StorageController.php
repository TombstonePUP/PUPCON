<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class S3StorageController extends Controller
{
    /**
     * Stream a file stored on S3 through the application.
     */
    public function __invoke(Request $request, string $path): StreamedResponse
    {
        $path = $this->decodePath($path);

        $disk = Storage::disk('s3');

        if (! $disk->exists($path)) {
            abort(404);
        }

        return $disk->response($path);
    }

    /**
     * Decode the given path, falling back gracefully.
     */
    private function decodePath(string $path): string
    {
        $decoded = rawurldecode($path);

        return $decoded === '' ? $path : $decoded;
    }
}
