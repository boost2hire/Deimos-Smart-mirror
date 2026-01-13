import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

const DEVICE_ID = "LUMI-001";
const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL;
const PHONE_FRONTEND = import.meta.env.VITE_PHONE_FRONTEND;

type DeviceState = "loading" | "unlinked" | "linked";
type MirrorMode = "idle" | "show_photos";

export default function DeviceLoginQR() {
  const navigate = useNavigate();

  const pollRef = useRef<number | null>(null);
  const codeGeneratedRef = useRef(false);

  const [deviceState, setDeviceState] = useState<DeviceState>("loading");
  const [mirrorMode, setMirrorMode] = useState<MirrorMode>("idle");
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [galleryUrl, setGalleryUrl] = useState<string | null>(null);

  /* ------------------------------------------------
     1️⃣ INITIAL DEVICE STATUS CHECK (ONCE)
  ------------------------------------------------ */
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
        console.error("Status error:", err);
        setDeviceState("unlinked");
      }
    };

    checkStatus();
  }, []);

  /* ------------------------------------------------
     2️⃣ UNLINKED → GENERATE LOGIN QR (ONCE)
  ------------------------------------------------ */
  useEffect(() => {
    if (deviceState !== "unlinked") return;
    if (codeGeneratedRef.current) return;

    const generateCode = async () => {
      try {
        codeGeneratedRef.current = true;

        const res = await fetch(
          `${BACKEND_BASE}/auth/device/code?device_id=${DEVICE_ID}`,
          { method: "POST" }
        );

        if (!res.ok) throw new Error("code failed");

        const data = await res.json();
        setDeviceCode(data.code);
      } catch (err) {
        console.error("QR error:", err);
      }
    };

    generateCode();
  }, [deviceState]);

  /* ------------------------------------------------
     3️⃣ POLLING (READ-ONLY, SAFE)
  ------------------------------------------------ */
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
          return;
        }

        pollRef.current = window.setTimeout(poll, 2000);
      } catch {
        pollRef.current = window.setTimeout(poll, 2000);
      }
    };

    poll();

    return () => {
      if (pollRef.current) {
        clearTimeout(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [deviceState]);

  /* ------------------------------------------------
     4️⃣ USER ACTION: SHOW PHOTOS
  ------------------------------------------------ */
  const showPhotos = async () => {
    try {
      const res = await fetch(
        `${BACKEND_BASE}/gallery/session/create-session?device_id=${DEVICE_ID}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("gallery failed");

      const data = await res.json();
      setGalleryUrl(data.session_url);
      setMirrorMode("show_photos");
    } catch (err) {
      console.error("Gallery error:", err);
    }
  };

  /* ------------------------------------------------
     5️⃣ USER ACTION: LOGOUT
  ------------------------------------------------ */
  const logout = async () => {
    await fetch(
      `${BACKEND_BASE}/auth/device/unlink?device_id=${DEVICE_ID}`,
      { method: "POST" }
    );

    // reset everything cleanly
    codeGeneratedRef.current = false;
    setDeviceCode(null);
    setGalleryUrl(null);
    setMirrorMode("idle");
    setDeviceState("unlinked");
  };

  /* ------------------------------------------------
     UI
  ------------------------------------------------ */

  // ⏳ LOADING
  if (deviceState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Checking device…
      </div>
    );
  }

  // 🔑 UNLINKED → LOGIN QR
  if (deviceState === "unlinked") {
    if (!deviceCode) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
          Preparing login…
        </div>
      );
    }

    const loginQrUrl = `${PHONE_FRONTEND}/device-login?code=${deviceCode}`;

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-white">
        <div className="text-lg">Scan to link your mirror</div>

        <div className="bg-white p-4 rounded-xl">
          <QRCode value={loginQrUrl} size={256} />
        </div>

        <div className="text-gray-400 tracking-widest text-sm">
          {deviceCode}
        </div>
      </div>
    );
  }

  // 🔒 LINKED → MIRROR HOME (DEFAULT)
  if (deviceState === "linked" && mirrorMode === "idle") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-white">
        <div className="text-xl">🪞 Mirror Ready</div>

        <div className="text-gray-400">
          Say “Hey Lumi” or choose an action
        </div>

        <button
          className="px-6 py-2 bg-blue-600 rounded"
          onClick={showPhotos}
        >
          Show Photos
        </button>

        <button
          className="px-6 py-2 bg-red-600 rounded"
          onClick={logout}
        >
          Unlink Device
        </button>
      </div>
    );
  }

  // 📸 SHOW PHOTOS → QR
  if (mirrorMode === "show_photos" && galleryUrl) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-white">
        <div className="text-lg">Scan to view photos</div>

        <div className="bg-white p-4 rounded-xl">
          <QRCode value={galleryUrl} size={256} />
        </div>

        <button
          className="px-6 py-2 bg-gray-600 rounded"
          onClick={() => setMirrorMode("idle")}
        >
          Back
        </button>
      </div>
    );
  }

  return null;
}
