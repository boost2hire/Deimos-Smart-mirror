import { useState, useEffect } from "react";
import { AlarmClock } from "lucide-react";
interface TimeCardProps {
  alarmTime?: string;
}
const TimeCard = ({
  alarmTime = "7:00 AM"
}: TimeCardProps) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return {
      hours,
      minutes,
      seconds
    };
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };
  const {
    hours,
    minutes,
    seconds
  } = formatTime(time);
  return <div className="glass-card p-6 animate-fade-in-up" style={{
    animationDelay: "0.1s"
  }}>
      {/* Time Display */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-7xl tracking-tight text-foreground font-serif font-medium">
          {hours}
        </span>
        <span className="text-7xl font-light text-foreground animate-pulse">:</span>
        <span className="text-7xl tracking-tight text-foreground font-serif font-medium">
          {minutes}
        </span>
        <span className="text-7xl font-light text-foreground animate-pulse">:</span>
        <span className="text-7xl tracking-tight text-muted-foreground font-serif font-medium">
          {seconds}
        </span>
      </div>

      {/* Date Display */}
      <p className="text-lg text-muted-foreground mb-4">
        {formatDate(time)}
      </p>

      {/* Alarm Display */}
      <div className="flex items-center gap-2 text-primary">
        <AlarmClock className="w-4 h-4" />
        <span className="text-sm font-medium">{alarmTime}</span>
      </div>
    </div>;
};
export default TimeCard;