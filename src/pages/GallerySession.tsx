import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type ImageItem = {
  name: string;
  url: string;
};

/**
 * IMPORTANT:
 * Set this in .env
 * VITE_API_BASE=http://192.168.31.75:8000
 * or later:
 * VITE_API_BASE=https://api.yourdomain.com
 */
const API_BASE = import.meta.env.VITE_API_BASE;

export default function GallerySession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      console.error("❌ sessionId is missing");
      setError("Invalid gallery session");
      setLoading(false);
      return;
    }

    const loadGallery = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/gallery/session/${sessionId}`,
          {
            method: "GET",
            credentials: "include", // 🔑 REQUIRED for auth / cookies
          }
        );

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }

        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        console.error("Gallery fetch failed", err);
        setError("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [sessionId]);

  if (loading) {
    return <div className="text-white p-6">Loading photos...</div>;
  }

  if (error) {
    return <div className="text-red-400 p-6">{error}</div>;
  }

  if (!images.length) {
    return <div className="text-white p-6">No photos found</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-black min-h-screen">
      {images.map(img => (
        <img
          key={img.name}
          src={`${API_BASE}/gallery/image?url=${encodeURIComponent(img.url)}`}
          className="rounded-lg"
          loading="lazy"
          alt={img.name}
        />
      ))}
    </div>
  );
}
