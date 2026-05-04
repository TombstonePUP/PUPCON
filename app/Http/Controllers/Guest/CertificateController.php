<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class CertificateController extends Controller
{
    /**
     * Handle the incoming request.
     * @return Response
     */
    public function __invoke(Request $request)
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
