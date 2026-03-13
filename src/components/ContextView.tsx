import { Camera, Map, Maximize2, MapPin } from "lucide-react";
import camLeft from "@/assets/cam-left.jpg";
import camFront from "@/assets/cam-front.jpg";
import camRight from "@/assets/cam-right.jpg";

const ContextView = () => {
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
            <span className="text-[10px] text-destructive status-pulse font-mono">● REC</span>
            <Maximize2 className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          </div>
        </div>
        <div className="flex-1 flex min-h-0 relative overflow-hidden">
          {/* Left Camera - 25% */}
          <div className="w-1/4 relative border-r border-border">
            <img src={camLeft} alt="Left camera view" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/20" />
            <div className="absolute top-1.5 left-1.5 bg-background/70 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
              <span className="text-[9px] font-mono text-muted-foreground">CAM_LEFT</span>
            </div>
          </div>
          {/* Center Camera - 50% */}
          <div className="w-1/2 relative border-r border-border">
            <img src={camFront} alt="Front camera view" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/10" />
            <div className="absolute top-1.5 left-1.5 bg-background/70 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
              <span className="text-[9px] font-mono text-muted-foreground">CAM_FRONT</span>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-sm text-center">
              <p className="text-[10px] text-warning font-semibold">Passenger spotted 50ft ahead in restricted red zone</p>
              <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">1920×1080 @ 30fps | 48ms latency</p>
            </div>
          </div>
          {/* Right Camera - 25% */}
          <div className="w-1/4 relative">
            <img src={camRight} alt="Right camera view" className="absolute inset-0 w-full h-full object-cover" />
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
          <span className="text-[10px] font-mono text-muted-foreground">LAT 37.7749 | LNG -122.4194</span>
        </div>
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-primary/5" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(hsl(185 100% 45% / 0.3) 1px, transparent 1px),
                linear-gradient(90deg, hsl(185 100% 45% / 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="text-center z-10">
            <Map className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">HD MAP — ZONE SF-DOWNTOWN-42</p>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-destructive" />
                <span className="text-[10px] text-destructive font-mono font-semibold">Current Location</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-green-500" />
                <span className="text-[10px] text-green-500 font-mono font-semibold">New Waypoint</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">Layer: Semantic | Objects: 142 | Updated 1.2s ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextView;
