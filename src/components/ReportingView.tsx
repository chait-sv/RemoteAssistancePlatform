import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { closedTasks } from "@/data/taskData";

/* ── Section 1: Average Time to Resolve ── */

const avgByFaultCode = (() => {
  const map = new Map<string, { sum: number; count: number }>();
  closedTasks.forEach((t) => {
    const entry = map.get(t.faultCode) || { sum: 0, count: 0 };
    entry.sum += t.elapsed;
    entry.count += 1;
    map.set(t.faultCode, entry);
  });
  return Array.from(map.entries())
    .map(([code, { sum, count }]) => ({ faultCode: code, avg: Math.round(sum / count) }))
    .sort((a, b) => a.faultCode.localeCompare(b.faultCode));
})();

const barColor = (avg: number) => {
  if (avg > 60) return "hsl(0 72% 51%)";
  if (avg >= 40) return "hsl(38 92% 50%)";
  return "hsl(145 80% 42%)";
};

const AvgResolveChart = () => (
  <div className="panel-border flex flex-col h-[340px]">
    <div className="panel-header">Average Time to Resolve (s) by Fault Code</div>
    <div className="flex-1 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={avgByFaultCode} margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 20% 18%)" />
          <XAxis
            dataKey="faultCode"
            tick={{ fontSize: 10, fill: "hsl(215 15% 45%)" }}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 45%)" }} />
          <Tooltip
            contentStyle={{
              background: "hsl(220 18% 10%)",
              border: "1px solid hsl(210 20% 18%)",
              borderRadius: 6,
              fontSize: 11,
              color: "hsl(195 60% 75%)",
            }}
            formatter={(value: number) => [`${value}s`, "Avg Elapsed"]}
          />
          <Bar dataKey="avg" radius={[3, 3, 0, 0]}>
            {avgByFaultCode.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.avg)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/* ── Section 2: Fault Metrics ── */

interface FaultMetric {
  faultCode: string;
  faultDescription: string;
  occurrences: number;
  vehicleId: string;
}

type MetricSortKey = keyof FaultMetric;
type SortDir = "asc" | "desc" | null;

const faultMetrics: FaultMetric[] = (() => {
  const map = new Map<string, { count: number; vehicles: Set<string>; description: string }>();
  closedTasks.forEach((t) => {
    const entry = map.get(t.faultCode) || { count: 0, vehicles: new Set<string>(), description: t.description };
    entry.count += 1;
    entry.vehicles.add(t.vehicleId);
    map.set(t.faultCode, entry);
  });
  const rows: FaultMetric[] = [];
  map.forEach((val, code) => {
    val.vehicles.forEach((vid) => {
      rows.push({ faultCode: code, faultDescription: val.description, occurrences: val.count, vehicleId: vid });
    });
  });
  return rows;
})();

const metricCols: { key: MetricSortKey; label: string }[] = [
  { key: "faultCode", label: "Fault Code" },
  { key: "faultDescription", label: "Fault Description" },
  { key: "occurrences", label: "Occurrences" },
  { key: "vehicleId", label: "Vehicle ID" },
];

const FaultMetricsTable = () => {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<MetricSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (key: MetricSortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    if (!filter) return faultMetrics;
    const q = filter.toLowerCase();
    return faultMetrics.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [filter]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      let aVal: string | number = a[sortKey];
      let bVal: string | number = b[sortKey];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: MetricSortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="panel-border flex flex-col flex-1 min-h-0">
      <div className="panel-header flex items-center justify-between">
        <span>Fault Metrics</span>
        <Input
          placeholder="Filter metrics…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-6 w-56 text-[11px] bg-background border-border"
        />
      </div>
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {metricCols.map((col) => (
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
            {sorted.map((row, i) => (
              <TableRow key={`${row.faultCode}-${row.vehicleId}-${i}`} className="text-xs">
                <TableCell className="px-3 py-1.5 font-mono">{row.faultCode}</TableCell>
                <TableCell className="px-3 py-1.5 font-mono text-right font-semibold">{row.occurrences}</TableCell>
                <TableCell className="px-3 py-1.5 font-mono">{row.vehicleId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

/* ── Main Reporting View ── */

const ReportingView = () => (
  <div className="flex flex-col h-full gap-2">
    <AvgResolveChart />
    <FaultMetricsTable />
  </div>
);

export default ReportingView;
