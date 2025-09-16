<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class FacebookController extends Controller
{
    public function feed(Request $request)
    {
        $pageId = config('services.facebook.page_id');
        $token = config('services.facebook.page_access_token');

        if (!$pageId || !$token) {
            return response()->json(['error' => 'Facebook not configured'], 400);
        }

        $cacheKey = "fb_feed_{$pageId}";
        $items = Cache::remember($cacheKey, 300, function () use ($pageId, $token) {
            $fields = 'message,created_time,full_picture,permalink_url,attachments{media,subattachments}';
            $url = "https://graph.facebook.com/{$pageId}/posts?fields={$fields}&access_token={$token}&limit=6";
            $res = Http::get($url);
            if (!$res->successful()) {
                return [];
            }
            $data = $res->json()['data'] ?? [];
            return collect($data)->map(function ($p) {
                $image = $p['full_picture'] ?? null;
                if (!$image && !empty($p['attachments']['data'][0]['media']['image']['src'])) {
                    $image = $p['attachments']['data'][0]['media']['image']['src'];
                }
                return [
                    'id' => $p['id'] ?? null,
                    'message' => $p['message'] ?? '',
                    'image' => $image,
                    'permalink' => $p['permalink_url'] ?? null,
                    'created_time' => $p['created_time'] ?? null,
                ];
            })->toArray();
        });

        return response()->json($items);
    }
}