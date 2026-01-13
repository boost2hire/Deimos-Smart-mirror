import { useEffect } from "react";
import { supabase } from "@/supabaseClient";

const FRONTEND_BASE =
  import.meta.env.VITE_FRONTEND_BASE || window.location.origin;

export default function DeviceLogin() {
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    alert("Invalid device login link");
    return;
  }

  localStorage.setItem("device_login_code", code);

  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${FRONTEND_BASE}/device-login/callback`,
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
