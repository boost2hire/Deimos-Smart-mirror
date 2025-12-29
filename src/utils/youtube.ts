export async function searchYouTube(
  query: string
): Promise<string | null> {
  const res = await fetch(
    `/api/youtube/search?q=${encodeURIComponent(query)}`
  );

  const text = await res.text();

  // 🛡️ Guard: backend not ready / invalid response
  if (!res.ok || !text || text[0] !== "{") {
    console.error("YouTube search failed:", text);
    return null;
  }

  const data = JSON.parse(text);
  return data.videoId ?? null;
}
