<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class S3StorageController extends Controller
{
    /**
     * How long (seconds) a private file may be cached by the browser. Short
     * enough to avoid serving stale files, long enough that repeated views of
     * the same exhibit don't re-hit S3.
     */
    private const int MAX_AGE_SECONDS = 300;

    /**
     * Stream a file stored on S3 through the application.
     *
     * Files are deliberately proxied through EC2 (rather than redirected to S3)
     * so the in-app PDF viewer (react-pdf/pdfjs) reads from our own origin —
     * no S3 CORS or API Gateway dependency. To make that proxying fast we add
     * byte-range support (206 Partial Content) and cache headers so pdf.js and
     * browsers can seek and reuse content efficiently.
     */
    public function __invoke(Request $request, string $path): StreamedResponse|Response
    {
        $path = $this->decodePath($path);

        $disk = Storage::disk('s3');

        if (! $disk->exists($path)) {
            abort(404);
        }

        $size = intval($disk->size($path));

        $headers = [
            'Content-Type' => (string) $disk->mimeType($path) ?: 'application/octet-stream',
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'private, max-age='.self::MAX_AGE_SECONDS,
            'X-Accel-Buffering' => 'no',
        ];

        $rangeHeader = $request->headers->get('Range');

        // No Range header (or a "bytes=0-" / whole-file request): fall back to the
        // framework's own streaming response so the common case stays on proven code.
        if (! $rangeHeader) {
            $headers['Content-Length'] = str($size);

            return $disk->response($path, headers: $headers);
        }

        // Only "bytes=start-end" is supported here.
        if (! preg_match('#^bytes=(\d*)-(\d*)$#', $rangeHeader, $m)) {
            return (new Response(null, Response::HTTP_REQUESTED_RANGE_NOT_SATISFIABLE, [
                'Content-Range' => 'bytes */'.$size,
                'Cache-Control' => 'no-store',
            ]));
        }

        $start = $m[1] === '' ? 0 : intval($m[1]);
        $end = $m[2] === '' ? $size - 1 : min(intval($m[2]), $size - 1);

        if ($start >= $size) {
            return (new Response(null, Response::HTTP_REQUESTED_RANGE_NOT_SATISFIABLE, [
                'Content-Range' => 'bytes */'.$size,
                'Cache-Control' => 'no-store',
            ]));
        }

        if ($end > $size - 1) {
            $end = $size - 1;
        }

        return $this->streamRange($disk, $path, $start, $end, $size, $headers);
    }

    /**
     * Stream only the requested byte window [start, end] from the S3 object.
     */
    private function streamRange($disk, string $path, int $start, int $end, int $size, array $headers): StreamedResponse
    {
        $status = Response::HTTP_PARTIAL_CONTENT;

        $headers['Content-Range'] = sprintf('bytes %d-%d/%d', $start, $end, $size);
        $headers['Content-Length'] = str($end - $start + 1);

        $stream = $disk->readStream($path);
        $length = $end - $start + 1;

        return new StreamedResponse(
            static function () use ($stream, $start, $length): void {
                if ($start > 0) {
                    fseek($stream, $start, SEEK_SET);
                }

                $remaining = $length;

                while ($remaining > 0) {
                    $buffer = fread($stream, min(8192, $remaining));

                    if (is_empty($buffer)) {
                        break;
                    }

                    echo $buffer;
                    $remaining -= strlen($buffer);
                }

                fclose($stream);
            },
            $status,
            $headers
        );
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