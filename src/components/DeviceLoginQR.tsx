import { Console } from "console";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

const DEVICE_ID = "LUMI-001";

// 🔥 IMPORTANT: explicit URLs
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL;
const PHONE_FRONTEND = import.meta.env.VITE_PHONE_FRONTEND;

type DeviceState = "loading" | "unlinked" | "linked";

export default function DeviceLoginQR() {
  const navigate = useNavigate();

  const pollTimeoutRef = useRef<number | null>(null);
  const qrGeneratedRef = useRef(false);

  const [deviceState, setDeviceState] = useState<DeviceState>("loading");
  const [code, setCode] = useState<string | null>(null);

  /* --------------------------------
     1️⃣ CHECK DEVICE STATUS (ONCE)
  --------------------------------*/
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(
        `${BACKEND_BASE}/auth/device/status?device_id=${DEVICE_ID}`
      );


        if (!res.ok) throw new Error("status failed");

        const data = await res.json();
        setDeviceState(data.linked ? "linked" : "unlinked");
      } catch (err) {
        console.error("Device status error:", err);
        setDeviceState("unlinked"); // fail-safe
      }
    };

    checkStatus();
  }, []);

  /* --------------------------------
     2️⃣ GENERATE QR (ONLY IF UNLINKED)
  --------------------------------*/
  useEffect(() => {
    if (deviceState !== "unlinked") return;
    if (qrGeneratedRef.current) return;

    const generateCode = async () => {
      try {
        qrGeneratedRef.current = true;

        const res = await fetch(
        `${BACKEND_BASE}/auth/device/code?device_id=${DEVICE_ID}`,
        { method: "POST" }
      );

        if (!res.ok) throw new Error("QR generation failed");

        const data = await res.json();
        if (data.code) setCode(data.code);
      } catch (err) {
        console.error("QR code generation error:", err);
      }
    };

    generateCode();
  }, [deviceState]);

  /* --------------------------------
     3️⃣ POLLING (WAIT FOR LINK)
  --------------------------------*/
  useEffect(() => {
    if (deviceState !== "unlinked") return;

    const poll = async () => {
      try {
        const res = await fetch(
            `${BACKEND_BASE}/auth/device/status?device_id=${DEVICE_ID}`
          );


        if (!res.ok) return;

        const data = await res.json();

        if (data.linked) {
          setDeviceState("linked");
          navigate("/mirror", { replace: true });
          return;
        }

        pollTimeoutRef.current = window.setTimeout(poll, 2000);
      } catch {
        pollTimeoutRef.current = window.setTimeout(poll, 2000);
      }
    };

    poll();

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [deviceState, navigate]);

  /* --------------------------------
     4️⃣ LOGOUT
  --------------------------------*/
  const logout = async () => {
    try {
     await fetch(
        `${BACKEND_BASE}/auth/device/unlink?device_id=${DEVICE_ID}`,
        { method: "POST" }
      );

    } catch(err) {
          console.error(err)
    }

    qrGeneratedRef.current = false;
    setCode(null);
    setDeviceState("unlinked");
  };

  /* --------------------------------
     UI
  --------------------------------*/

  // 🔄 Loading
  if (deviceState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Checking device…
      </div>
    );
  }

  // ✅ Linked
  if (deviceState === "linked") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <div className="text-xl">✅ Mirror linked</div>

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

  // ⏳ Waiting for QR code
  if (!code) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Preparing login…
      </div>
    );
  }

  // ❌ Unlinked → QR
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
