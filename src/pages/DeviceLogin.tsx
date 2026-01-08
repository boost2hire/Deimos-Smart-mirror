import { useEffect } from "react";
import { supabase } from "@/supabaseClient";

export default function DeviceLogin() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      alert("Invalid device login link");
      return;
    }

    // 🔒 Store device code BEFORE OAuth
    localStorage.setItem("device_login_code", code);

    // 🔥 Start Supabase OAuth (NO state, NO hacks)
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/device-login/callback`,
      },
    });
  }, []);

  return (
    <div style={styles.page}>
      Redirecting to login…
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui",
  },
};
