import TopNav from "@/components/TopNav";
import TaskQueue from "@/components/TaskQueue";
import ContextView from "@/components/ContextView";
import TelemetryPanel from "@/components/TelemetryPanel";

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopNav />
      <div className="flex-1 flex gap-2 p-2 min-h-0">
        {/* Column 1 — Task Queue (20%) */}
        <div className="w-[20%] min-w-0">
          <TaskQueue />
        </div>
        {/* Column 2 — Context View (55%) */}
        <div className="w-[55%] min-w-0">
          <ContextView />
        </div>
        {/* Column 3 — Telemetry & Actions (25%) */}
        <div className="w-[25%] min-w-0">
          <TelemetryPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
