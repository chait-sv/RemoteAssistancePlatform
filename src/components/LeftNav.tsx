import { Home, User, FolderOpen, BarChart3, PanelLeftClose, PanelLeft, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import TaskQueue from "@/components/TaskQueue";

const navItems = [
  { icon: Home, label: "Home" },
  { icon: User, label: "My Tasks" },
  { icon: FolderOpen, label: "Tasks" },
  { icon: BarChart3, label: "Reporting" },
];

interface LeftNavProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const LeftNav = ({ activeNav, setActiveNav }: LeftNavProps) => {
  const [expanded, setExpanded] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const active = activeNav;
  const setActive = setActiveNav;

  const handleLogout = () => {
    logout();
    navigate("/login", { state: { message: "Logout successful." } });
  };

  return (
    <div className="flex h-full min-w-0">
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
                <TooltipContent side="right" className="text-xs z-[3000]">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
          {/* Logout */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs z-[3000]">
              Logout
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {expanded && active === "My Tasks" && (
        <div className="w-[220px] min-w-0 h-full">
          <TaskQueue />
        </div>
      )}
    </div>
  );
};

export default LeftNav;
