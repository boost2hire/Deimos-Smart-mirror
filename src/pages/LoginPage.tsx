import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

const DEVICE_ID = "LUMI-001";
const API_BASE = import.meta.env.VITE_API_BASE;
const PHONE_FRONTEND = import.meta.env.VITE_PHONE_FRONTEND;

type Mode = "loading" | "unlinked" | "linked";

export default function DeviceLoginQR() {
  const navigate = useNavigate();

  const pollingRef = useRef<number | null>(null);
  const codeGeneratedRef = useRef(false);

  const [mode, setMode] = useState<Mode>("loading");
  const [code, setCode] = useState<string | null>(null);

  /* --------------------------------
     1️⃣ INITIAL STATUS CHECK
  --------------------------------*/
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await fetch(
          `${API_BASE}/auth/device/status?device_id=${DEVICE_ID}`
        );
        if (!res.ok) throw new Error("Status check failed");

        const data = await res.json();
        if (cancelled) return;

        if (data.linked) {
          setMode("linked");
          return;
        }

        setMode("unlinked");

        if (!codeGeneratedRef.current) {
          codeGeneratedRef.current = true;

          const codeRes = await fetch(
            `${API_BASE}/auth/device/code?device_id=${DEVICE_ID}`,
            { method: "POST" }
          );

          const codeData = await codeRes.json();
          if (codeData.code) {
            setCode(codeData.code);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  /* --------------------------------
     2️⃣ POLLING (ONLY WHEN UNLINKED)
  --------------------------------*/
  useEffect(() => {
    if (mode !== "unlinked") return;

    const poll = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/auth/device/status?device_id=${DEVICE_ID}`
        );
        if (!res.ok) return;

        const data = await res.json();
        if (data.linked) {
          setMode("linked");
          navigate("/mirror", { replace: true });
          return;
        }

        pollingRef.current = window.setTimeout(poll, 2000);
      } catch {
        pollingRef.current = window.setTimeout(poll, 2000);
      }
    };

    poll();

    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [mode, navigate]);

  /* --------------------------------
     3️⃣ DEVICE LOGOUT (SAFE)
  --------------------------------*/
  const logout = async () => {
    // 🔥 FIX: stop polling FIRST
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }

    await fetch(
      `${API_BASE}/auth/device/unlink?device_id=${DEVICE_ID}`,
      { method: "POST" }
    );

    // reset state cleanly
    codeGeneratedRef.current = false;
    setCode(null);
    setMode("unlinked");
  };

  /* --------------------------------
     UI
  --------------------------------*/

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Checking device…
      </div>
    );
  }

  if (mode === "linked") {
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

  if (!code) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Preparing login…
      </div>
    );
  }

  const qrUrl = `${PHONE_FRONTEND}/login?redirect=/photos&code=${code}`;

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
