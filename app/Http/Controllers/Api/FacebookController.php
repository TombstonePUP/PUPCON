<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class FacebookController extends Controller
{
    public function feed(Request $request)
    {
        $pageId = config('services.facebook.page_id');
        $token = config('services.facebook.page_access_token');

        Log::info('Facebook Feed Request', [
            'page_id' => $pageId ? 'Set' : 'Missing',
            'token' => $token ? 'Set' : 'Missing'
        ]);

        if (!$pageId || !$token) {
            Log::warning('Facebook credentials not configured');
            return response()->json([
                'error' => 'Facebook not configured',
                'data' => []
            ], 200); // Return 200 with empty data instead of 500
        }

        $cacheKey = "fb_feed_{$pageId}";
        
        try {
            $items = Cache::remember($cacheKey, 300, function () use ($pageId, $token) {
                $fields = 'message,created_time,full_picture,permalink_url';
                $url = "https://graph.facebook.com/{$pageId}/posts?fields={$fields}&access_token={$token}&limit=6";
                
                Log::info('Fetching Facebook posts', ['url' => $url]);
                
                $res = Http::timeout(10)->get($url);
                
                if (!$res->successful()) {
                    Log::error('Facebook API error', [
                        'status' => $res->status(),
                        'body' => $res->body()
                    ]);
                    throw new \Exception('Facebook API request failed');
                }
                
                $data = $res->json()['data'] ?? [];
                
                Log::info('Facebook posts fetched', ['count' => count($data)]);
                
                return collect($data)->map(function ($p) {
                    return [
                        'id' => $p['id'] ?? null,
                        'message' => $p['message'] ?? '',
                        'image' => $p['full_picture'] ?? null,
                        'permalink' => $p['permalink_url'] ?? null,
                        'created_time' => $p['created_time'] ?? null,
                    ];
                })->toArray();
            });

            return response()->json($items);
            
        } catch (\Exception $e) {
            Log::error('Facebook feed error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch Facebook feed',
                'data' => []
            ], 200); // Return 200 with empty data for graceful degradation
        }
    }
}