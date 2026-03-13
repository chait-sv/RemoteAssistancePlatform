import { Radio, Shield, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const TopNav = () => {
  const [tenant, setTenant] = useState("uber-fleet");
  const [city, setCity] = useState("san-francisco");

  return (
    <nav className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-sans font-bold text-sm tracking-widest uppercase text-foreground">
          FIP
        </span>
        <span className="text-sm font-semibold text-foreground hidden sm:inline tracking-wide">
          Fleet Intelligence Platform
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Radio className="h-3 w-3 text-accent status-pulse" />
          <span>CONNECTED</span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-7 w-[140px] border-border bg-card text-xs text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="san-francisco">San Francisco</SelectItem>
              <SelectItem value="los-angeles">Los Angeles</SelectItem>
              <SelectItem value="phoenix">Phoenix</SelectItem>
              <SelectItem value="miami">Miami</SelectItem>
              <SelectItem value="austin">Austin</SelectItem>
              <SelectItem value="london">London</SelectItem>
              <SelectItem value="tokyo">Tokyo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-muted-foreground">Tenant:</span>
          <Select value={tenant} onValueChange={setTenant}>
            <SelectTrigger className="h-7 w-[200px] border-border bg-card text-xs text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="uber-fleet">Uber Fleet (Nuro/Lucid)</SelectItem>
              <SelectItem value="dev-fleet">Dev Fleet</SelectItem>
              <SelectItem value="wayve">Wayve</SelectItem>
              <SelectItem value="zoox">Zoox</SelectItem>
              <SelectItem value="waymo">Waymo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
