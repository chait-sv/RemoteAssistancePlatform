import { Home, User, FolderOpen, Loader, BarChart3, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import TaskQueue from "@/components/TaskQueue";

const navItems = [
  { icon: Home, label: "Home" },
  { icon: User, label: "My Tasks" },
  { icon: FolderOpen, label: "Open Tasks" },
  { icon: BarChart3, label: "Reporting" },
];

interface LeftNavProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const LeftNav = ({ activeNav, setActiveNav }: LeftNavProps) => {
  const [expanded, setExpanded] = useState(true);
  const active = activeNav;
  const setActive = setActiveNav;

  return (
    <div className="flex h-full min-w-0">
      {/* Icon rail — always visible */}
      <div className="flex flex-col h-full w-12 shrink-0 panel-border">
        <div className="panel-header flex items-center justify-center">
          <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground transition-colors">
            {expanded ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center py-2 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;
            return (
              <Tooltip key={item.label} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActive(item.label)}
                    className={cn(
                      "w-9 h-9 rounded-sm flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                {!expanded && (
                  <TooltipContent side="right" className="text-xs">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Expandable task queue panel */}
      {expanded && active === "My Tasks" && (
        <div className="w-[220px] min-w-0 h-full">
          <TaskQueue />
        </div>
      )}
    </div>
  );
};

export default LeftNav;
