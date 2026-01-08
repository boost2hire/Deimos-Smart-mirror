import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

const DEVICE_ID = "LUMI-001";

export default function DeviceLoginQR() {
  const navigate = useNavigate();

  const pollingRef = useRef<number | null>(null);
  const codeGeneratedRef = useRef(false); // 🔒 ABSOLUTE KEY

  const [code, setCode] = useState<string | null>(null);
  const [linked, setLinked] = useState<boolean | null>(null);

  /* --------------------------------
     1️⃣ INITIAL STATUS CHECK (ONCE)
  --------------------------------*/
  useEffect(() => {
    const init = async () => {
      const res = await fetch(
        `/api/auth/device/status?device_id=${DEVICE_ID}`
      );

      if (!res.ok) {
        console.error("Status check failed");
        return;
      }

      const data = await res.json();
      setLinked(data.linked);

      // ✅ If already linked → STOP HERE
      if (data.linked) return;

      // 🔒 Generate QR ONLY ONCE
      if (!codeGeneratedRef.current) {
        codeGeneratedRef.current = true;

        const codeRes = await fetch(
          `/auth/device/code?device_id=${DEVICE_ID}`,
          { method: "POST" }
        );

        const codeData = await codeRes.json();

        if (codeData.code) {
          setCode(codeData.code);
        }
      }
    };

    init();
  }, []);

  /* --------------------------------
     2️⃣ POLLING (ONLY IF NOT LINKED)
  --------------------------------*/
  useEffect(() => {
    if (linked !== false) return;

    const poll = async () => {
      const res = await fetch(
        `/api/auth/device/status?device_id=${DEVICE_ID}`
      );

      if (!res.ok) return;

      const data = await res.json();

      if (data.linked) {
        setLinked(true);
        navigate("/mirror", { replace: true });
        return;
      }

      pollingRef.current = window.setTimeout(poll, 2000);
    };

    poll();

    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [linked, navigate]);

  /* --------------------------------
     3️⃣ LOGOUT
  --------------------------------*/
  const logout = async () => {
    await fetch(`/api/auth/device/unlink?device_id=${DEVICE_ID}`, {
      method: "POST",
    });

    codeGeneratedRef.current = false;
    setCode(null);
    setLinked(false);
  };

  /* --------------------------------
     UI
  --------------------------------*/

  // 🔄 Loading
  if (linked === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-black">
        Checking device…
      </div>
    );
  }

  // ✅ Already logged in
  if (linked === true) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <div className="text-xl">✅ Mirror already linked</div>

        <button
          className="px-6 py-2 bg-green-600 rounded"
          onClick={() => navigate("/mirror")}
        >
          Go to Mirror
        </button>

        <button
          className="px-6 py-2 bg-red-600 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    );
  }

  // ❌ Not linked yet → QR
  if (!code) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Preparing login…
      </div>
    );
  }

  const PHONE_FRONTEND = import.meta.env.VITE_PHONE_FRONTEND;

const qrUrl = `${PHONE_FRONTEND}/device-login?code=${code}`;



  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="text-white text-lg">Scan to link your mirror</div>

      <div className="bg-white p-4 rounded-xl">
        <QRCode value={qrUrl} size={256} />
      </div>

      <div className="text-gray-400 tracking-widest text-sm">
        {code}
      </div>
    </div>
  );
}
