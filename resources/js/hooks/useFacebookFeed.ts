import { useEffect, useState } from 'react';

export type FbPost = {
    id?: string;
    message?: string;
    image?: string | null;
    permalink?: string | null;
    created_time?: string | null;
};

export default function useFacebookFeed(limit = 8) {
    const [posts, setPosts] = useState<FbPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        async function fetchFeed() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch('/api/facebook-feed', { signal: controller.signal });
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                if (!mounted) return;
                if (Array.isArray(data)) setPosts(data.slice(0, limit));
                else setPosts([]);
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                if (!mounted) return;
                setError(err.message || 'Failed to fetch feed');
                setPosts([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchFeed();
        return () => {
            mounted = false;
            controller.abort();
        };
    }, [limit]);

    return { posts, loading, error };
}
