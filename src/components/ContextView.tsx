import { Camera, Map, Maximize2, MapPin, ShieldCheck, ShieldOff, AlertOctagon } from "lucide-react";
import { useState } from "react";
import { useScenario } from "@/contexts/ScenarioContext";
import hdMapImg from "@/assets/hd-map.png";
import camLeft from "@/assets/cam-left.jpg";
import camFront from "@/assets/cam-front.jpg";
import camRight from "@/assets/cam-right.jpg";
import constructionFront from "@/assets/construction-front.jpg";
import constructionLeft from "@/assets/construction-left.jpg";
import constructionRight from "@/assets/construction-right.jpg";
import constructionMap from "@/assets/construction-map.png";

const scenarioCamera = {
  "INT-4821": {
    left: camLeft,
    front: camFront,
    right: camRight,
    overlay: "Passenger spotted 50ft ahead in restricted red zone",
    routeActive: true,
  },
  "INT-4822": {
    left: constructionLeft,
    front: constructionFront,
    right: constructionRight,
    overlay: "Live Feed: Human flagger gesturing vehicle to cross double-yellow line",
    routeActive: false,
  },
  "INT-4823": {
    left: camLeft,
    front: camFront,
    right: camRight,
    overlay: "Sensor calibration in progress",
    routeActive: false,
  },
};

const scenarioMap = {
  "INT-4821": { img: hdMapImg, label: "Semantic", coords: "LAT 37.7749 | LNG -122.4194", showPathBlocked: false },
  "INT-4822": { img: constructionMap, label: "Construction", coords: "LAT 37.7812 | LNG -122.4098", showPathBlocked: true },
  "INT-4823": { img: hdMapImg, label: "Semantic", coords: "LAT 37.7749 | LNG -122.4194", showPathBlocked: false },
};

const ContextView = () => {
  const [autonomyEngaged, setAutonomyEngaged] = useState(true);
  const { activeTicket } = useScenario();
  const cam = scenarioCamera[activeTicket];
  const map = scenarioMap[activeTicket];

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Live Camera Feed */}
      <div className="flex-1 panel-border flex flex-col min-h-0">
        <div className="panel-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-3 w-3 text-primary" />
            <span>Live Camera Feed</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutonomyEngaged(!autonomyEngaged)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                autonomyEngaged
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-destructive/20 text-destructive border border-destructive/30"
              }`}
            >
              {autonomyEngaged ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <ShieldOff className="h-3.5 w-3.5" />
              )}
              {autonomyEngaged ? "AV ENGAGED" : "AV DISENGAGED"}
            </button>
            <span className="text-[10px] text-destructive status-pulse font-mono">● REC</span>
            <Maximize2 className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </div>
        </div>
        <div className="flex-1 flex min-h-0 relative overflow-hidden">
          {/* Left Camera - 25% */}
          <div className="w-1/4 relative border-r border-border">
            <img src={cam.left} alt="Left camera view" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/20" />
            <div className="absolute top-1.5 left-1.5 bg-background/70 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
              <span className="text-[9px] font-mono text-muted-foreground">CAM_LEFT</span>
            </div>
          </div>
          {/* Center Camera - 50% */}
          <div className="w-1/2 relative border-r border-border">
            <img src={cam.front} alt="Front camera view" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/10" />
            {/* AV Planner Route Overlay - only for scenario 1 */}
            {cam.routeActive && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 190 300 C 190 260, 195 240, 210 220 C 225 200, 260 185, 295 178" fill="none" stroke="hsl(185 100% 45% / 0.15)" strokeWidth="28" strokeLinecap="round" />
                <path d="M 190 300 C 190 260, 195 240, 210 220 C 225 200, 260 185, 295 178" fill="none" stroke="hsl(142 71% 45% / 0.5)" strokeWidth="14" strokeLinecap="round" />
                <path d="M 190 300 C 190 260, 195 240, 210 220 C 225 200, 260 185, 295 178" fill="none" stroke="hsl(142 71% 65% / 0.9)" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" />
                <circle cx="295" cy="178" r="6" fill="hsl(142 71% 45% / 0.8)" stroke="white" strokeWidth="1.5" />
                <circle cx="295" cy="178" r="2.5" fill="white" />
              </svg>
            )}
            <div className="absolute top-1.5 left-1.5 bg-background/70 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
              <span className="text-[9px] font-mono text-muted-foreground">CAM_FRONT</span>
            </div>
            {cam.routeActive && (
              <div className="absolute top-1.5 right-1.5 bg-green-500/20 backdrop-blur-sm px-1.5 py-0.5 rounded-sm border border-green-500/30">
                <span className="text-[9px] font-mono text-green-400">ROUTE ACTIVE</span>
              </div>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-sm text-center">
              <p className="text-[10px] text-warning font-semibold">{cam.overlay}</p>
              <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">1920×1080 @ 30fps | 48ms latency</p>
            </div>
          </div>
          {/* Right Camera - 25% */}
          <div className="w-1/4 relative">
            <img src={cam.right} alt="Right camera view" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/20" />
            <div className="absolute top-1.5 left-1.5 bg-background/70 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
              <span className="text-[9px] font-mono text-muted-foreground">CAM_RIGHT</span>
            </div>
          </div>
        </div>
      </div>

      {/* HD Semantic Map */}
      <div className="flex-1 panel-border flex flex-col min-h-0">
        <div className="panel-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="h-3 w-3 text-accent" />
            <span>HD Semantic Map</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{map.coords}</span>
        </div>
        <div className="flex-1 relative overflow-hidden min-h-0">
          <img src={map.img} alt="HD Semantic Map" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/10" />
          {map.showPathBlocked && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="bg-destructive/80 backdrop-blur-sm p-2 rounded-sm border border-destructive">
                <AlertOctagon className="h-6 w-6 text-destructive-foreground" />
              </div>
              <span className="text-[11px] font-mono font-bold text-destructive bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-sm">PATH BLOCKED</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-4 bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-destructive" />
              <span className="text-[10px] text-destructive font-mono font-semibold">Current Location</span>
            </div>
            {!map.showPathBlocked && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-warning" />
                <span className="text-[10px] text-warning font-mono font-semibold">New Waypoint</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-sm">
            <p className="text-[10px] text-muted-foreground/60 font-mono">Layer: {map.label} | Objects: 142 | Updated 1.2s ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextView;
