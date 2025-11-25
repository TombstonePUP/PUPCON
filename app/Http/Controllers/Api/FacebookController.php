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
            'token' => $token ? substr($token, 0, 20) . '...' : 'Missing'
        ]);

        if (!$pageId || !$token) {
            Log::warning('Facebook credentials not configured');
            return response()->json([
                'error' => 'Facebook not configured',
                'data' => []
            ], 200);
        }

        $cacheKey = "fb_feed_{$pageId}";
        
        try {
            $items = Cache::remember($cacheKey, 300, function () use ($pageId, $token) {
                // Add attachments field to get shared post images
                $fields = 'message,created_time,full_picture,permalink_url,attachments{media,subattachments,media_type,url,type}';
                $url = "https://graph.facebook.com/v21.0/{$pageId}/posts?fields={$fields}&access_token={$token}&limit=8";
                
                Log::info('Fetching Facebook posts', [
                    'page_id' => $pageId,
                    'url_without_token' => "https://graph.facebook.com/v21.0/{$pageId}/posts"
                ]);
                
                $res = Http::withOptions(['verify' => false])->timeout(10)->get($url);
                
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
                    // Try multiple sources for image
                    $image = null;
                    
                    // 1. Try full_picture first
                    if (!empty($p['full_picture'])) {
                        $image = $p['full_picture'];
                    }
                    
                    // 2. Try attachments (for shared posts)
                    if (!$image && isset($p['attachments']['data'][0])) {
                        $attachment = $p['attachments']['data'][0];
                        
                        // Check media
                        if (isset($attachment['media']['image']['src'])) {
                            $image = $attachment['media']['image']['src'];
                        }
                        
                        // Check subattachments (albums/multiple photos)
                        if (!$image && isset($attachment['subattachments']['data'][0]['media']['image']['src'])) {
                            $image = $attachment['subattachments']['data'][0]['media']['image']['src'];
                        }
                        
                        // Check if it's a shared link with image
                        if (!$image && isset($attachment['url']) && $attachment['type'] === 'share') {
                            $image = $attachment['url'];
                        }
                    }
                    
                    // 3. Fallback to null (will use placeholder in frontend)
                    
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
            
        } catch (\Exception $e) {
            Log::error('Facebook feed error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch Facebook feed',
                'message' => $e->getMessage(),
                'data' => []
            ], 200);
        }
    }
}