<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class CertificateController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $certificate = ContentPages::where('page', 'Welcome')->first();
        if ($certificate) {
            $certificate->certificate_of_authenticity = $certificate->certificate_of_authenticity ? Storage::url($certificate->certificate_of_authenticity) : null;
        }

        return inertia('admin/certificate', [
            'certificate' => $certificate,
        ]);
    }
}
