import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export default function GalleryQR({ deviceId }: { deviceId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function createSession() {
      try {
        const res = await fetch(
          `/gallery/session/create-session?device_id=${deviceId}`,
          { method: "POST" }
        );

        if (!res.ok) {
          throw new Error("Failed to create gallery session");
        }

        const data = await res.json();

        if (!cancelled) {
          setUrl(data.session_url);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Unable to create session");
        }
      }
    }

    createSession();

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  // 🔄 Loading
  if (!url && !error) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center text-white">
        Creating secure session…
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  // ✅ QR ready
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl rounded-2xl shadow-xl">
        <QRCode
          value={url}
          size={280}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
    </div>
  );
}
