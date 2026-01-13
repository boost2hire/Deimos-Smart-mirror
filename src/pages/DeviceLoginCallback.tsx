import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { CSSProperties } from "react";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL;

export default function DeviceLoginCallback() {
  const [status, setStatus] = useState("Linking device…");

  useEffect(() => {
    const linkDevice = async () => {
      try {
        // 1️⃣ Get Supabase session
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session?.user) {
          setStatus("❌ Login failed");
          return;
        }

        // 2️⃣ Read stored device code
        const code = localStorage.getItem("device_login_code");

        if (!code) {
          // Device already linked earlier
          setStatus("✅ Device already linked. You can close this.");
          return;
        }
     console.log("BACKEND_BASE =", BACKEND_BASE);

        // 3️⃣ Link device
        const res = await fetch(`${BACKEND_BASE}/auth/device/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            user_id: data.session.user.id,
          }),
        });

        if (!res.ok) {
          setStatus("❌ Device linking failed");
          return;
        }

        // 4️⃣ Cleanup
        localStorage.removeItem("device_login_code");
        setStatus("✅ Mirror linked. You can close this.");
      } catch (err) {
        console.error(err);
        setStatus("❌ Unexpected error");
      }
    };

    linkDevice();
  }, []);

  return (
    <div style={styles.page}>
      {status}
    </div>
  );
}

const styles: { page: CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "black",
    color: "white",
    fontFamily: "system-ui",
    textAlign: "center",
  },
};
