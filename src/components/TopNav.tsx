import { ChevronDown, Radio, Shield } from "lucide-react";

const TopNav = () => {
  return (
    <nav className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-sans font-bold text-sm tracking-widest uppercase text-foreground">
          URP
        </span>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Unified Remote Platform
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Radio className="h-3 w-3 text-accent status-pulse" />
          <span>CONNECTED</span>
        </div>
        <button className="flex items-center gap-2 panel-border px-3 py-1.5 text-xs hover:bg-secondary transition-colors">
          <span className="text-muted-foreground">Active Tenant:</span>
          <span className="text-foreground font-medium">Uber Fleet (Nuro/Lucid)</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
