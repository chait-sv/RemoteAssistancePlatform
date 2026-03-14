import { useState } from "react";
import TopNav from "@/components/TopNav";
import LeftNav from "@/components/LeftNav";
import ContextView from "@/components/ContextView";
import TelemetryPanel from "@/components/TelemetryPanel";
import { ScenarioProvider } from "@/contexts/ScenarioContext";

const Index = () => {
  const [activeNav, setActiveNav] = useState("My Tasks");

  return (
    <ScenarioProvider>
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        <TopNav />
        <div className="flex-1 flex gap-2 p-2 min-h-0">
          <LeftNav activeNav={activeNav} setActiveNav={setActiveNav} />
          <div className="flex-1 min-w-0">
            <ContextView />
          </div>
          {activeNav === "My Tasks" && (
            <div className="w-[25%] min-w-0 overflow-y-auto">
              <TelemetryPanel />
            </div>
          )}
        </div>
      </div>
    </ScenarioProvider>
  );
};

export default Index;
