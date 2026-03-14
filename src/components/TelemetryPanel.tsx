import { Battery, HardDrive, Gauge, AlertCircle, Send, ArrowRight, ChevronDown, Play, Pause, Mic, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useScenario } from "@/contexts/ScenarioContext";

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
      { name: "Rear", status: "green" },
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
      { name: "Rear", status: "green" },
    ],
  },
];

const StatusDot = ({ status }: { status: HealthStatus }) => (
  <span className={`inline-block h-2 w-2 rounded-full ${statusColors[status]}`} />
);

const scenarioTelemetry = {
  "INT-4821": [
    { label: "Vehicle ID", value: "NL-0012", icon: null },
    { label: "Battery", value: "87%", icon: Battery, color: "text-accent" },
    { label: "Disk Storage", value: "42%", icon: HardDrive, color: "text-accent" },
    { label: "Speed", value: "0 mph", icon: Gauge, color: "text-primary" },
    { label: "Fault Code", value: "E-PICKUP-TIMEOUT", icon: AlertCircle, color: "text-warning" },
    { label: "Fault Type", value: "Fleet CX", icon: AlertCircle, color: "text-warning" },
    { label: "Fault Description", value: "Rider in restricted zone", icon: AlertCircle, color: "text-warning" },
  ],
  "INT-4822": [
    { label: "Vehicle ID", value: "NL-0025", icon: null },
    { label: "Battery", value: "72%", icon: Battery, color: "text-accent" },
    { label: "Disk Storage", value: "74%", icon: HardDrive, color: "text-accent" },
    { label: "Speed", value: "0 mph", icon: Gauge, color: "text-primary" },
    { label: "Fault Code", value: "E-signage-conflict", icon: AlertCircle, color: "text-warning" },
    { label: "Fault Type", value: "Fleet CX", icon: AlertCircle, color: "text-warning" },
    { label: "Fault Description", value: "Conflicting signage detected", icon: AlertCircle, color: "text-warning" },
  ],
  "INT-4823": [
    { label: "Vehicle ID", value: "NRU-0089", icon: null },
    { label: "Battery", value: "94%", icon: Battery, color: "text-accent" },
    { label: "Disk Storage", value: "31%", icon: HardDrive, color: "text-accent" },
    { label: "Speed", value: "15 mph", icon: Gauge, color: "text-primary" },
    { label: "Fault Code", value: "E-SENSOR-CAL", icon: AlertCircle, color: "text-warning" },
    { label: "Fault Type", value: "Hardware", icon: AlertCircle, color: "text-warning" },
    { label: "Fault Description", value: "Lidar calibration drift detected", icon: AlertCircle, color: "text-warning" },
  ],
};

const scenarioChat = {
  "INT-4821": [
    { sender: "rider", text: "Why has the car stopped?", time: "14:32" },
    { sender: "operator", text: "Nuro Support is helping your vehicle find a safe place to pull over. We see you on the curb.", time: "14:33" },
    { sender: "rider", text: "OK, how long will it take?", time: "14:33" },
  ],
  "INT-4822": [
    { sender: "system", text: "Your vehicle has paused for road work. Resuming shortly.", time: "14:45" },
  ],
  "INT-4823": [
    { sender: "system", text: "Vehicle performing sensor calibration. No rider action required.", time: "15:01" },
  ],
};

const scenarioAutonomy = {
  "INT-4821": {
    action: "Action: Review and send new Waypoint to Vehicle.",
    actionColor: "text-accent",
    warning: null,
    specialButton: null,
  },
  "INT-4822": {
    action: "Action: Relax constraint: Approve opposing lane usage when it is safe to do so.",
    actionColor: "text-accent",
    warning: "Hard Constraint Active: Do Not Cross Double-Yellow Line",
    specialButton: null,
  },
  "INT-4823": {
    action: "Action: Approve recalibration sequence.",
    actionColor: "text-accent",
    warning: null,
    specialButton: null,
  },
};

const TelemetryPanel = () => {
  const [chatInput, setChatInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const { activeTicket } = useScenario();

  const telemetryData = scenarioTelemetry[activeTicket];
  const chatMessages = scenarioChat[activeTicket];
  const autonomy = scenarioAutonomy[activeTicket];

  return (
    <div className="flex flex-col gap-2 pb-2">
      {/* Telemetry */}
      <Collapsible defaultOpen className="panel-border">
        <CollapsibleTrigger className="panel-header w-full flex items-center justify-between cursor-pointer group">
          <span>Telemetry</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-2.5 space-y-2">
            {telemetryData.map((d) => (
              <div key={d.label} className="flex items-start justify-between text-[11px]">
                <span className="text-muted-foreground shrink-0 mr-2">{d.label}</span>
                <div className="flex items-start gap-1.5 justify-end">
                  {d.icon && <d.icon className={`h-3 w-3 ${d.color} shrink-0 mt-0.5`} />}
                  <span className={`font-mono font-medium text-right ${d.color || "text-foreground"}`}>
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
            <div className="relative w-full aspect-video bg-secondary/50 rounded-sm border border-border overflow-hidden">
              <video
                ref={(el) => {
                  if (el) {
                    if (isPlaying) {
                      el.play().catch(() => {});
                    } else {
                      el.pause();
                    }
                  }
                }}
                src="/videos/dashcam-front.mp4"
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
              />
              <div className="absolute top-1.5 left-1.5 bg-background/70 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
                <span className="text-[9px] font-mono text-muted-foreground">CAM_FRONT · 10s buffer</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                <div className="h-full bg-primary/60 rounded-r-sm" style={{ width: isPlaying ? "100%" : "0%", transition: isPlaying ? "width 10s linear" : "none" }} />
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
                {isPlaying ? "Playing..." : "Paused"} · 00:10
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
          <div className="overflow-y-auto max-h-[180px] p-2.5 space-y-2">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`text-[11px] ${
                  msg.sender === "operator" ? "text-right" : msg.sender === "system" ? "text-center" : ""
                }`}
              >
                <div
                  className={`inline-block px-2 py-1.5 rounded-md max-w-[85%] ${
                    msg.sender === "operator"
                      ? "bg-primary/15 text-foreground"
                      : msg.sender === "system"
                      ? "bg-accent/15 text-accent italic"
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
            <button className="p-1.5 rounded-sm bg-accent/20 text-accent hover:bg-accent/30 transition-colors" title="Push to Talk">
              <Mic className="h-3 w-3" />
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Guided Autonomy Controls */}
      <div className="panel-border">
        <div className="panel-header">Guided Autonomy Controls</div>
        <div className="p-2.5 space-y-2">
          {autonomy.warning && (
            <div className="flex items-start gap-1.5 mb-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
              <span className="text-[11px] text-warning font-semibold">{autonomy.warning}</span>
            </div>
          )}
          {autonomy.action && (
            <div className={`text-[11px] ${autonomy.actionColor} font-semibold mb-2`}>
              {autonomy.action}
            </div>
          )}
          {autonomy.specialButton && (
            <Button variant="destructive" size="sm" className="w-full text-[10px] bg-orange-600 hover:bg-orange-700 border-orange-500">
              {autonomy.specialButton}
            </Button>
          )}
          <Button variant="command" size="lg" className="w-full gap-2">
            <ArrowRight className="h-4 w-4" />
            Execute
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
