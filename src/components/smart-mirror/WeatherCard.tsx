import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  Sun,
  CloudRain,
  CloudSun,
  type LucideIcon,
} from "lucide-react";
import { useWeatherLive } from "@/hooks/useWeatherLive";

/* ---------------- Types ---------------- */

interface ForecastDay {
  day: string;
  min: number;
  max: number;
  icon: LucideIcon;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  lastUpdated: string;
  forecast: ForecastDay[];
}

/* ---------------- Static forecast (intentional) ---------------- */

const FORECAST: ForecastDay[] = [
  { day: "Sun", min: 15, max: 23, icon: Sun },
  { day: "Mon", min: 15, max: 24, icon: CloudSun },
  { day: "Tue", min: 15, max: 25, icon: Cloud },
  { day: "Wed", min: 16, max: 25, icon: CloudRain },
];


interface StatProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium font-serif">{value}</p>
      </div>
    </div>
  );
}


/* ---------------- Component ---------------- */

export default function WeatherCard() {
  const live = useWeatherLive();



  if (!live) {
    return <div className="glass-card p-6">Loading weather…</div>;
  }

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">
          {live.location}
        </span>
      </div>

      {/* Temperature */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-start">
          <span className="text-7xl font-light font-serif">
            {live.temperature}
          </span>
          <span className="text-3xl mt-2">°</span>
        </div>

        <div className="mt-4">
          <Cloud className="w-10 h-10 mb-1" />
          <span className="text-sm">{live.description}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat icon={Droplets} label="Humidity" value={`${live.humidity}%`} />
        <Stat icon={Wind} label="Wind" value={`${live.windSpeed} km/h`} />
        <Stat icon={Thermometer} label="Feels like" value={`${live.feelsLike}°`} />
      </div>

      {/* Forecast (still static — OK for now) */}
      <div className="border-t pt-4 flex justify-between">
        {FORECAST.map((day) => {
          const Icon = day.icon;
          return (
            <div key={day.day} className="text-center">
              <p className="text-xs">{day.day}</p>
              <Icon className="w-5 h-5 mx-auto my-2" />
              <span>{day.max}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
