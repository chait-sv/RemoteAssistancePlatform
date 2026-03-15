import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// --- seed helpers ---
const faultTypes = ["Fleet CX", "AV Platform", "Vehicle Platform", "Hardware"];
const statuses = ["Not Started", "In progress", "Rescue"];
const operators = [
  "J. Martinez", "A. Chen", "R. Patel", "K. Okonkwo", "L. Johansson",
  "M. Tanaka", "S. Williams", "D. Kim", "P. Novak", "T. Adeyemi",
  "C. Rivera", "B. Schmidt", "N. Gupta", "F. Larsen", "H. Yamamoto",
];
const faultCodes: Record<string, string[]> = {
  "Fleet CX": ["CX-001", "CX-002", "CX-003", "CX-004", "CX-005", "CX-006", "CX-007", "CX-008"],
  "AV Platform": ["AV-101", "AV-102", "AV-103", "AV-104"],
  "Vehicle Platform": ["VP-201", "VP-202", "VP-203"],
  Hardware: ["HW-301", "HW-302", "HW-303", "HW-304"],
};
const descriptions: Record<string, string[]> = {
  "Fleet CX": [
    "Pickup location mismatch", "Passenger no-show timeout", "Route deviation detected",
    "Rider app sync failure", "ETA calculation error", "Door unlock failure at stop",
    "Payment processing delay", "Ride cancellation conflict",
  ],
  "AV Platform": [
    "Perception model degradation", "Planner timeout exceeded", "Localization drift detected",
    "Prediction module error",
  ],
  "Vehicle Platform": [
    "Brake system warning", "Steering actuator fault", "Powertrain thermal alert",
  ],
  Hardware: [
    "LiDAR sensor obstruction", "Camera feed dropout", "GNSS signal loss", "Radar calibration drift",
  ],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateTasks() {
  const rand = seededRandom(42);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  // distribute fault types: 60 Fleet CX, 20 AV, 10 VP, 10 HW
  const typePool: string[] = [
    ...Array(60).fill("Fleet CX"),
    ...Array(20).fill("AV Platform"),
    ...Array(10).fill("Vehicle Platform"),
    ...Array(10).fill("Hardware"),
  ];
  // shuffle
  for (let i = typePool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [typePool[i], typePool[j]] = [typePool[j], typePool[i]];
  }

  // distribute status: 75 in progress, 20 not started, 5 rescue
  const statusPool: string[] = [
    ...Array(75).fill("In progress"),
    ...Array(20).fill("Not Started"),
    ...Array(5).fill("Rescue"),
  ];
  for (let i = statusPool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [statusPool[i], statusPool[j]] = [statusPool[j], statusPool[i]];
  }

  const priorities = ["P1", "P2", "P3"];
  const now = Date.now();

  return Array.from({ length: 100 }, (_, i) => {
    const faultType = typePool[i];
    const createdOffset = Math.floor(rand() * 86400) * 1000; // within last 24h
    const created = new Date(now - createdOffset);
    const elapsed = Math.floor(rand() * 301); // 0–300 seconds
    return {
      id: `INT-${5000 + i}`,
      description: pick(descriptions[faultType]),
      priority: pick(priorities),
      vehicleId: `NRU-${String(Math.floor(rand() * 200)).padStart(4, "0")}`,
      faultCode: pick(faultCodes[faultType]),
      faultType,
      created,
      elapsed,
      operator: pick(operators),
      status: statusPool[i],
    };
  });
}

type Task = ReturnType<typeof generateTasks>[number];
type SortDir = "asc" | "desc" | null;

const columnDefs: { key: keyof Task; label: string }[] = [
  { key: "id", label: "Task ID" },
  { key: "description", label: "Task Description" },
  { key: "priority", label: "Priority" },
  { key: "vehicleId", label: "Vehicle ID" },
  { key: "faultCode", label: "Fault Code" },
  { key: "faultType", label: "Fault Type" },
  { key: "created", label: "Created" },
  { key: "elapsed", label: "Elapsed (s)" },
  { key: "operator", label: "Remote Operator" },
  { key: "status", label: "Status" },
];

const priorityOrder: Record<string, number> = { P1: 0, P2: 1, P3: 2, P4: 3 };
const statusOrder: Record<string, number> = { Rescue: 0, "In progress": 1, "Not Started": 2 };

const statusColors: Record<string, string> = {
  "In progress": "bg-primary/20 text-primary border-primary/30",
  "Not Started": "bg-muted text-muted-foreground border-border",
  Rescue: "bg-destructive/20 text-destructive border-destructive/30",
};

const priorityColors: Record<string, string> = {
  P1: "bg-destructive/20 text-destructive border-destructive/30",
  P2: "bg-warning/20 text-warning border-warning/30",
  P3: "bg-primary/20 text-primary border-primary/30",
  P4: "bg-muted text-muted-foreground border-border",
};

const allTasks = generateTasks();

const OpenTasksTable = () => {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof Task | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (key: keyof Task) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    if (!filter) return allTasks;
    const q = filter.toLowerCase();
    return allTasks.filter((t) =>
      Object.values(t).some((v) =>
        String(v instanceof Date ? v.toLocaleString() : v).toLowerCase().includes(q)
      )
    );
  }, [filter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];
      if (sortKey === "priority") { aVal = priorityOrder[aVal] ?? 99; bVal = priorityOrder[bVal] ?? 99; }
      else if (sortKey === "status") { aVal = statusOrder[aVal] ?? 99; bVal = statusOrder[bVal] ?? 99; }
      else if (sortKey === "created") { aVal = (aVal as Date).getTime(); bVal = (bVal as Date).getTime(); }
      else if (sortKey === "elapsed") { /* already number */ }
      else { aVal = String(aVal).toLowerCase(); bVal = String(bVal).toLowerCase(); }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: keyof Task }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="flex flex-col h-full panel-border">
      <div className="panel-header flex items-center justify-between">
        <span>Open Tasks</span>
        <Input
          placeholder="Filter tasks…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-6 w-56 text-[11px] bg-background border-border"
        />
      </div>
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columnDefs.map((col) => (
                <TableHead
                  key={col.key}
                  className="cursor-pointer select-none whitespace-nowrap text-xs h-9 px-3"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    <SortIcon col={col.key} />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((task) => (
              <TableRow key={task.id} className="text-xs">
                <TableCell className="px-3 py-1.5 font-semibold text-foreground">{task.id}</TableCell>
                <TableCell className="px-3 py-1.5 max-w-[200px] truncate">{task.description}</TableCell>
                <TableCell className="px-3 py-1.5">
                  <Badge variant="outline" className={`text-[11px] px-1.5 py-0 ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className="px-3 py-1.5 font-mono">{task.vehicleId}</TableCell>
                <TableCell className="px-3 py-1.5 font-mono">{task.faultCode}</TableCell>
                <TableCell className="px-3 py-1.5">{task.faultType}</TableCell>
                <TableCell className="px-3 py-1.5 whitespace-nowrap">
                  {task.created.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
                </TableCell>
                <TableCell className={`px-3 py-1.5 font-mono text-right font-semibold ${task.elapsed > 60 ? "text-destructive" : task.elapsed >= 40 ? "text-warning" : "text-green-500"}`}>{task.elapsed}</TableCell>
                <TableCell className="px-3 py-1.5">{task.operator}</TableCell>
                <TableCell className="px-3 py-1.5">
                  <Badge variant="outline" className={`text-[11px] px-1.5 py-0 ${statusColors[task.status]}`}>
                    {task.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default OpenTasksTable;
