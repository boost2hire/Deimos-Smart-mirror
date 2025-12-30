import { Calendar } from "lucide-react";

interface ScheduleEvent {
  title: string;
  time: string;
}

interface ScheduleCardProps {
  events?: ScheduleEvent[];
}

const defaultEvents: ScheduleEvent[] = [
  { title: "Standup", time: "9:00 AM" },
  { title: "Design Review", time: "11:30 AM" },
  { title: "Client Call", time: "2:00 PM" },
  { title: "Yoga Session", time: "4:30 PM" },
];

const ScheduleCard = ({ events = defaultEvents }: ScheduleCardProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Today's Schedule</h3>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/10" />

        {/* Events */}
        <div className="space-y-5">
          {events.map((event, index) => (
            <div
              key={index}
              className="relative flex items-start gap-4 pl-6 group"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary group-hover:bg-primary/20 transition-colors duration-300">
                <div className="absolute inset-0.5 rounded-full bg-primary/40" />
              </div>

              {/* Event Content */}
              <div className="flex-1 flex justify-between items-baseline">
                <span className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">
                  {event.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {event.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
