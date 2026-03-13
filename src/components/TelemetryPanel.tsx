import { Battery, HardDrive, Gauge, AlertCircle, Send, ArrowRight, ChevronDown, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

type HealthStatus = "green" | "amber" | "red";

const statusColors: Record<HealthStatus, string> = {
  green: "bg-green-500",
  amber: "bg-yellow-500",
  red: "bg-red-500",
};

const sensorHealth: { category: string; sensors: { name: string; status: HealthStatus }[] }[] = [
  {
    category: "Cameras",
    sensors: [
      { name: "Front", status: "green" },
      { name: "Left", status: "green" },
      { name: "Right", status: "amber" },
      { name: "Rear", status: "red" },
    ],
  },
  {
    category: "Lidar",
    sensors: [
      { name: "Front", status: "green" },
      { name: "Left", status: "green" },
      { name: "Right", status: "amber" },
      { name: "Rear", status: "green" },
    ],
  },
  {
    category: "Radar",
    sensors: [
      { name: "Front", status: "amber" },
      { name: "Left", status: "green" },
      { name: "Right", status: "green" },
      { name: "Rear", status: "red" },
    ],
  },
];

const StatusDot = ({ status }: { status: HealthStatus }) => (
  <span className={`inline-block h-2 w-2 rounded-full ${statusColors[status]}`} />
);

const telemetryData = [
  { label: "Vehicle ID", value: "NRU-0042", icon: null },
  { label: "Battery", value: "78%", icon: Battery, color: "text-accent" },
  { label: "Disk Storage", value: "42%", icon: HardDrive, color: "text-accent" },
  { label: "Speed", value: "12.4 km/h", icon: Gauge, color: "text-primary" },
  { label: "Fault Code", value: "E-OBS-TIMEOUT", icon: AlertCircle, color: "text-warning" },
  { label: "Fault Type", value: "AV Platform", icon: AlertCircle, color: "text-warning" },
];

const chatMessages = [
  { sender: "rider", text: "Why has the car stopped?", time: "14:32" },
  { sender: "operator", text: "We detected an obstruction. Rerouting now.", time: "14:33" },
  { sender: "rider", text: "OK, how long will it take?", time: "14:33" },
];

const TelemetryPanel = () => {
  const [chatInput, setChatInput] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Telemetry */}
      <Collapsible defaultOpen className="panel-border">
        <CollapsibleTrigger className="panel-header w-full flex items-center justify-between cursor-pointer group">
          <span>Telemetry</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-2.5 space-y-2">
            {telemetryData.map((d) => (
              <div key={d.label} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{d.label}</span>
                <div className="flex items-center gap-1.5">
                  {d.icon && <d.icon className={`h-3 w-3 ${d.color}`} />}
                  <span className={`font-mono font-medium ${d.color || "text-foreground"}`}>
                    {d.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sensor Health */}
      <Collapsible defaultOpen className="panel-border">
        <CollapsibleTrigger className="panel-header w-full flex items-center justify-between cursor-pointer group">
          <span>Sensor Health</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-2.5 space-y-2.5">
            {sensorHealth.map((group) => (
              <div key={group.category}>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {group.category}
                </div>
                <div className="space-y-1">
                  {group.sensors.map((sensor) => (
                    <div key={sensor.name} className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{sensor.name}</span>
                      <StatusDot status={sensor.status} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Camera History */}
      <Collapsible defaultOpen className="panel-border">
        <CollapsibleTrigger className="panel-header w-full flex items-center justify-between cursor-pointer group">
          <span>Camera History</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-2.5 space-y-2">
            <div className="relative w-full aspect-video bg-secondary/50 rounded-sm border border-border overflow-hidden flex items-center justify-center">
              <div className="text-[10px] text-muted-foreground font-mono">Front Camera — 15s clip</div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                <div className="h-full bg-primary/60 rounded-r-sm" style={{ width: isPlaying ? "100%" : "0%", transition: isPlaying ? "width 15s linear" : "none" }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-sm bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </button>
              <span className="text-[10px] text-muted-foreground font-mono">
                {isPlaying ? "Playing..." : "Paused"} · 00:15
              </span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rider Comms */}
      <Collapsible defaultOpen className="panel-border flex flex-col min-h-0">
        <CollapsibleTrigger className="panel-header w-full flex items-center justify-between cursor-pointer group">
          <span>Rider Comms</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="overflow-auto p-2.5 space-y-2">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`text-[11px] ${
                  msg.sender === "operator" ? "text-right" : ""
                }`}
              >
                <div
                  className={`inline-block px-2 py-1.5 rounded-md max-w-[85%] ${
                    msg.sender === "operator"
                      ? "bg-primary/15 text-foreground"
                      : "bg-secondary text-card-foreground"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5 font-mono">{msg.time}</div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border flex gap-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message rider..."
              className="flex-1 bg-secondary text-xs text-foreground px-2.5 py-1.5 rounded-sm border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="p-1.5 rounded-sm bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              <Send className="h-3 w-3" />
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Guided Autonomy Controls */}
      <div className="panel-border">
        <div className="panel-header">Guided Autonomy Controls</div>
        <div className="p-2.5 space-y-2">
          <div className="text-[10px] text-muted-foreground mb-2">
            Suggested: Override obstruction and reroute via Mission St.
          </div>
          <Button variant="command" size="lg" className="w-full gap-2">
            <ArrowRight className="h-4 w-4" />
            Execute Reroute
          </Button>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="flex-1 text-[10px]">
              Hold Position
            </Button>
            <Button variant="destructive" size="sm" className="flex-1 text-[10px]">
              E-Stop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryPanel;
