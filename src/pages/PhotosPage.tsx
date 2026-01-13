import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function PhotosPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 🔒 HARD GATE
      if (!user) {
        navigate("/login?redirect=/photos", { replace: true });
        return;
      }

      // ✅ user exists → load photos
      const { data: files, error } = await supabase.storage
        .from("user-photos")
        .list(`users/${user.id}`, {
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const urls = await Promise.all(
        files.map(async (f) => {
          const { data } = await supabase.storage
            .from("user-photos")
            .createSignedUrl(`users/${user.id}/${f.name}`, 300);
          return data?.signedUrl;
        })
      );

      setPhotos(urls.filter(Boolean) as string[]);
      setLoading(false);
    };

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading photos…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 grid grid-cols-2 gap-4">
      {photos.map((url) => (
        <img
          key={url}
          src={url}
          className="rounded-xl"
          alt="photo"
        />
      ))}
    </div>
  );
}
