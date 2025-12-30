import { useEffect, useState } from "react";

export interface LiveWeather {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export function useWeatherLive() {
  const [data, setData] = useState<LiveWeather | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:8000/api/weather");
      

        const json = await res.json();
       

        setData(json);
      } catch (e) {
        console.error("WEATHER FETCH ERROR", e);
      }
    }

    load();
  }, []);

  return data;
}
