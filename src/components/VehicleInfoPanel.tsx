import { Battery, HardDrive, Gauge, AlertCircle, Send, Play, Pause, Mic, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { type Task, getBand } from "@/data/taskData";
import { ScrollArea } from "@/components/ui/scroll-area";

type HealthStatus = "green" | "amber" | "red";

const statusColors: Record<HealthStatus, string> = {
  green: "bg-green-500",
  amber: "bg-yellow-500",
  red: "bg-red-500",
};

const StatusDot = ({ status }: { status: HealthStatus }) => (
  <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusColors[status]}`} />
);

function generateSensorHealth(seed: number): { category: string; sensors: { name: string; status: HealthStatus }[] }[] {
  const statuses: HealthStatus[] = ["green", "green", "green", "amber", "red"];
  const pick = (i: number) => statuses[(seed + i) % statuses.length];
  return [
    { category: "Cameras", sensors: [{ name: "Front", status: pick(0) }, { name: "Left", status: pick(1) }, { name: "Right", status: pick(2) }, { name: "Rear", status: pick(3) }] },
    { category: "Lidar", sensors: [{ name: "Front", status: pick(4) }, { name: "Left", status: pick(5) }, { name: "Right", status: pick(6) }, { name: "Rear", status: pick(7) }] },
    { category: "Radar", sensors: [{ name: "Front", status: pick(8) }, { name: "Left", status: pick(9) }, { name: "Right", status: pick(10) }, { name: "Rear", status: pick(11) }] },
  ];
}

interface VehicleInfoPanelProps {
  task: Task;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const VehicleInfoPanel = ({ task, onMouseEnter, onMouseLeave }: VehicleInfoPanelProps) => {
  const [chatInput, setChatInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "system", text: `Vehicle ${task.vehicleId} status update: ${task.description}`, time: "14:30" },
  ]);

  const band = getBand(task.elapsed);
  const sensorHealth = generateSensorHealth(parseInt(task.vehicleId.replace("NL-", ""), 10));

  const telemetryData = [
    { label: "Vehicle ID", value: task.vehicleId, icon: null, color: "" },
    { label: "Battery", value: `${60 + (parseInt(task.vehicleId.replace("NL-", ""), 10) % 35)}%`, icon: Battery, color: "text-accent" },
    { label: "Disk Storage", value: `${30 + (parseInt(task.vehicleId.replace("NL-", ""), 10) % 50)}%`, icon: HardDrive, color: "text-accent" },
    { label: "Speed", value: `${band === "green" ? Math.floor(Math.random() * 25) : 0} mph`, icon: Gauge, color: "text-primary" },
    { label: "Fault Code", value: task.faultCode, icon: AlertCircle, color: "text-warning" },
    { label: "Fault Type", value: task.faultType, icon: AlertCircle, color: "text-warning" },
    { label: "Fault Description", value: task.faultDescription, icon: AlertCircle, color: "text-warning" },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setMessages((prev) => [...prev, { sender: "operator", text: chatInput.trim(), time }]);
    setChatInput("");
  };

  return (
    <div
      className="absolute top-0 right-0 w-[320px] h-full z-[1100] bg-background/95 backdrop-blur-sm border-l border-border shadow-lg overflow-hidden flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="panel-header flex items-center justify-between border-b border-border">
        <span className="font-semibold text-sm">{task.vehicleId} — {task.id}</span>
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${band === "green" ? "bg-green-500" : band === "amber" ? "bg-yellow-500" : "bg-red-500"}`} />
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-2 pb-4">
          {/* Vehicle Telemetry */}
          <Collapsible defaultOpen className="panel-border">
            <CollapsibleTrigger className="panel-header w-full flex items-center justify-between cursor-pointer group">
              <span>Vehicle Telemetry</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-2.5">
                {telemetryData.map((d) => (
                  <div key={d.label} className="flex items-start justify-between text-xs">
                    <span className="text-muted-foreground shrink-0 mr-2">{d.label}</span>
                    <div className="flex items-start gap-1.5 justify-end">
                      {d.icon && <d.icon className={`h-3.5 w-3.5 ${d.color} shrink-0 mt-0.5`} />}
                      <span className={`font-mono font-medium text-right ${d.color || "text-foreground"}`}>{d.value}</span>
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
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3">
                {sensorHealth.map((group) => (
                  <div key={group.category}>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{group.category}</div>
                    <div className="space-y-1.5">
                      {group.sensors.map((sensor) => (
                        <div key={sensor.name} className="flex items-center justify-between text-xs">
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
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-2">
                <div className="relative w-full aspect-video bg-secondary/50 rounded-sm border border-border overflow-hidden">
                  <video
                    ref={(el) => {
                      if (el) {
                        if (isPlaying) el.play().catch(() => {});
                        else el.pause();
                      }
                    }}
                    src="/videos/dashcam-front.mp4"
                    className="absolute inset-0 w-full h-full object-cover"
                    muted loop playsInline
                  />
                  <div className="absolute top-1.5 left-1.5 bg-background/70 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
                    <span className="text-[11px] font-mono text-muted-foreground">CAM_FRONT · 10s buffer</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                    <div className="h-full bg-primary/60 rounded-r-sm" style={{ width: isPlaying ? "100%" : "0%", transition: isPlaying ? "width 10s linear" : "none" }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 rounded-sm bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                  <span className="text-xs text-muted-foreground font-mono">{isPlaying ? "Playing..." : "Paused"} · 00:10</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Rider Comms */}
          <Collapsible defaultOpen className="panel-border flex flex-col min-h-0">
            <CollapsibleTrigger className="panel-header w-full flex items-center justify-between cursor-pointer group">
              <span>Rider Comms</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="overflow-y-auto max-h-[140px] p-3 space-y-2.5">
                {messages.map((msg, i) => (
                  <div key={i} className={`text-xs ${msg.sender === "operator" ? "text-right" : msg.sender === "system" ? "text-center" : ""}`}>
                    <div className={`inline-block px-2.5 py-1.5 rounded-md max-w-[85%] ${
                      msg.sender === "operator" ? "bg-primary/15 text-foreground"
                        : msg.sender === "system" ? "bg-accent/15 text-accent italic"
                        : "bg-secondary text-card-foreground"
                    }`}>{msg.text}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">{msg.time}</div>
                  </div>
                ))}
              </div>
              <div className="p-2.5 border-t border-border flex gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Message rider..."
                  className="flex-1 bg-secondary text-xs text-foreground px-2.5 py-1.5 rounded-sm border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button onClick={handleSendMessage} className="p-1.5 rounded-sm bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                  <Send className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 rounded-sm bg-accent/20 text-accent hover:bg-accent/30 transition-colors" title="Push to Talk">
                  <Mic className="h-3.5 w-3.5" />
                </button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};

export default VehicleInfoPanel;
