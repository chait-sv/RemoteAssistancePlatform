import { Camera, Map, Maximize2, MapPin } from "lucide-react";

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
        <div className="flex-1 flex items-center justify-center scanline relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="text-center z-10">
            <Camera className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">FEED — NRU-0042 — CAM_FRONT</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">1920×1080 @ 30fps | 48ms latency</p>
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
            <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono">Layer: Semantic | Objects: 142 | Updated 1.2s ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextView;
