import { AlertTriangle, Zap, Construction } from "lucide-react";
import { useScenario, ScenarioId } from "@/contexts/ScenarioContext";

const tickets: { id: ScenarioId; priority: string; label: string; vehicle: string; time: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: "INT-4821",
    priority: "critical",
    label: "P1 - Pickup Location Mismatch",
    vehicle: "NRU-0042",
    time: "00:42",
    icon: AlertTriangle,
  },
  {
    id: "INT-4822",
    priority: "high",
    label: "P2 - Unmapped Construction",
    vehicle: "NL-0025",
    time: "01:15",
    icon: Construction,
  },
  {
    id: "INT-4823",
    priority: "medium",
    label: "Sensor Calibration",
    vehicle: "NRU-0089",
    time: "02:33",
    icon: Zap,
  },
];

const priorityStyles: Record<string, string> = {
  critical: "border-l-destructive text-destructive",
  high: "border-l-warning text-warning",
  medium: "border-l-primary text-primary",
};

const TaskQueue = () => {
  const { activeTicket, setActiveTicket } = useScenario();

  return (
    <div className="flex flex-col h-full panel-border">
      <div className="panel-header flex items-center justify-between">
        <span>Active Interventions</span>
        <span className="text-foreground font-mono text-[10px]">{tickets.length}</span>
      </div>
      <div className="flex-1 overflow-auto p-1.5 space-y-1.5">
        {tickets.map((t) => {
          const Icon = t.icon;
          const isActive = activeTicket === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTicket(t.id)}
              className={`w-full text-left p-2.5 rounded-sm border-l-2 transition-all ${
                priorityStyles[t.priority]
              } ${
                isActive
                  ? "bg-secondary"
                  : "bg-transparent hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3" />
                  <span className="text-[11px] font-semibold">{t.id}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{t.time}</span>
              </div>
              <div className="text-[11px] text-card-foreground">{t.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{t.vehicle}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskQueue;
