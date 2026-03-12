import { Battery, Gauge, AlertCircle, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const telemetryData = [
  { label: "Vehicle ID", value: "NRU-0042", icon: null },
  { label: "Battery", value: "78%", icon: Battery, color: "text-accent" },
  { label: "Speed", value: "12.4 km/h", icon: Gauge, color: "text-primary" },
  { label: "Fault Code", value: "E-OBS-TIMEOUT", icon: AlertCircle, color: "text-warning" },
];

const chatMessages = [
  { sender: "rider", text: "Why has the car stopped?", time: "14:32" },
  { sender: "operator", text: "We detected an obstruction. Rerouting now.", time: "14:33" },
  { sender: "rider", text: "OK, how long will it take?", time: "14:33" },
];

const TelemetryPanel = () => {
  const [chatInput, setChatInput] = useState("");

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Telemetry */}
      <div className="panel-border">
        <div className="panel-header">Telemetry</div>
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
      </div>

      {/* Rider Comms */}
      <div className="panel-border flex-1 flex flex-col min-h-0">
        <div className="panel-header">Rider Comms</div>
        <div className="flex-1 overflow-auto p-2.5 space-y-2">
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
      </div>

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
