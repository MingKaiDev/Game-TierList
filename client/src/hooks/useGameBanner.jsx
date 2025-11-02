import { useEffect, useState } from 'react';

// Shared queue + throttle mechanism to avoid spamming the backend
let queue = Promise.resolve();
const delay = ms => new Promise(res => setTimeout(res, ms));
const enqueue = async (fn, delayMs = 250) => {
  queue = queue.then(async () => {
    const result = await fn();
    await delay(delayMs); // wait before next
    return result;
  });
  return queue;
};

const useGameBanner = (title) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!title) {
      setLoading(false);
      return;
    }

    const fetchBannerDetails = async () => {
      setLoading(true);
      try {
        await enqueue(async () => {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/details?title=${encodeURIComponent(title)}`);
          const data = await res.json();

          if (res.ok) {
            // Prioritize artwork, fallback to cover
            const bannerUrl = data.artworkUrl || data.coverUrl || null;
            setImageUrl(bannerUrl);
            setDetails(data);
          } else {
            setImageUrl(null);
            setDetails(null);
          }
        }, 300);
      } catch (err) {
        console.error('Failed to fetch game details for banner:', err);
        setError(err);
        setImageUrl(null);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerDetails();
  }, [title]);

  return { imageUrl, details, loading, error };
};

export default useGameBanner;
