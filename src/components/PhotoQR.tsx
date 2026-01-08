import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export default function GalleryQR({ deviceId }: { deviceId: string }) {
  const [url, setUrl] = useState("");

useEffect(() => {
  fetch(`/gallery/session/create-session?device_id=LUMI-001`, {
    method: "POST",
  })
    .then((r) => {
      if (!r.ok) throw new Error("Failed to create session");
      return r.json();
    })
    .then((d) => setUrl(d.session_url))
    .catch(console.error);
}, []);



  if (!url) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center text-white">
        Creating session…
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl">
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
