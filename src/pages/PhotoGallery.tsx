import { useEffect, useState } from "react";

interface Photo {
  name: string;
  url: string;
}

const BASE_URL = "https://photos.refboosts.com/gallery"; 
// ⬆️ later replace with Cloudflare URL

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/photos`)
      .then(res => res.json())
      .then(data => setPhotos(data.photos || []));
  }, []);

  return (
    <div className="min-h-screen bg-black px-3 py-4">
      {/* Header */}
      <h1 className="text-white text-lg font-semibold mb-4 text-center">
        📸 Smart Mirror Gallery
      </h1>

      {/* Gallery */}
      <div className="flex flex-col gap-6">
        {photos.map(photo => {
          const fullUrl = BASE_URL + photo.url;

          return (
            <div
              key={photo.name}
              className="bg-[#111] rounded-2xl overflow-hidden"
            >
              {/* Image */}
              <img
                src={fullUrl}
                alt={photo.name}
                className="w-full object-contain bg-black"
              />

              {/* Footer */}
              <div className="p-3">
                <div className="text-gray-400 text-sm mb-2 truncate">
                  {photo.name}
                </div>

                <a
                  href={fullUrl}
                  download
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
