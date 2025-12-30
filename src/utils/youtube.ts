export async function searchYouTube(
  query: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/youtube/search?q=${encodeURIComponent(query)}`
    );

    const contentType = res.headers.get("content-type");
    const text = await res.text();

    // ❌ Backend error or wrong response type
    if (!res.ok || !contentType?.includes("application/json")) {
      console.error("YouTube search failed:", {
        status: res.status,
        contentType,
        response: text,
      });
      return null;
    }

    const data = JSON.parse(text);

    // ❌ Valid JSON but missing videoId
    if (!data?.videoId) {
      console.warn("YouTube search returned no videoId:", data);
      return null;
    }

    return data.videoId;
  } catch (err) {
    console.error("YouTube search exception:", err);
    return null;
  }
}
