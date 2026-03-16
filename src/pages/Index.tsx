import { useState } from "react";
import TopNav from "@/components/TopNav";
import LeftNav from "@/components/LeftNav";
import ContextView from "@/components/ContextView";
import TelemetryPanel from "@/components/TelemetryPanel";
import OpenTasksTable from "@/components/OpenTasksTable";
import LiveDashboardMap from "@/components/LiveDashboardMap";
import { ScenarioProvider } from "@/contexts/ScenarioContext";

const Index = () => {
  const [activeNav, setActiveNav] = useState("Home");

  return (
    <ScenarioProvider>
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        <TopNav />
        <div className="flex-1 flex gap-2 p-2 min-h-0">
          <LeftNav activeNav={activeNav} setActiveNav={setActiveNav} />
          <div className="flex-1 min-w-0">
            {activeNav === "My Tasks" ? (
              <ContextView />
            ) : activeNav === "Tasks" ? (
              <OpenTasksTable />
            ) : (
              activeNav === "Home" ? (
                <LiveDashboardMap />
              ) : (
                <div className="h-full panel-border">
                  <div className="panel-header">{activeNav}</div>
                </div>
              )
            )}
          </div>
          {activeNav === "My Tasks" && (
            <div className="w-[25%] min-w-0 overflow-y-auto">
              <TelemetryPanel onResolve={() => setActiveNav("My Tasks")} onNavigate={setActiveNav} />
            </div>
          )}
        </div>
      </div>
    </ScenarioProvider>
  );
};

export default Index;
