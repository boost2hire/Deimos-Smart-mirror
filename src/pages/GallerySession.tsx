import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

type GalleryImage = {
  name: string;
  url: string;
};

type GalleryResponse = {
images: GalleryImage[];
};

export default function GallerySession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    fetch(`${API_BASE}/gallery/session/${sessionId}`)
      .then(r => {
        if (!r.ok) throw new Error("Session expired");
        return r.json();
      })
      .then((d: GalleryResponse) => {
        setImages(d.images.map(i => i.url));
      })
      .catch(() => setError("Session expired or invalid"));
  }, [sessionId]);

  if (error) {
    return <div className="p-6 text-center text-white">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black p-4 grid grid-cols-2 gap-4">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          className="rounded-xl"
          alt="gallery"
        />
      ))}
    </div>
  );
}
