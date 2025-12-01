<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $certificate = ContentPages::where('page', 'Welcome')->first();
        if ($certificate) {
            if ($certificate->certificate_of_authenticity && Storage::exists($certificate->certificate_of_authenticity)) {
                $certificate->certificate_of_authenticity = Storage::url($certificate->certificate_of_authenticity);
            } else {
                $certificate->certificate_of_authenticity = null;
            }
        }

        return inertia('certificate', [
            'certificate' => $certificate,
        ]);
    }
}
