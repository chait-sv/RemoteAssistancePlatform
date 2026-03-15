import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { allTasks, getBand, type Task } from "@/data/taskData";
import vehicleImg from "@/assets/vehicle-marker.png";

// San Francisco street coordinates for seeding vehicles – real streets, no overlaps
const sfStreetPositions: [number, number][] = [
  // Central / East SF
  [37.7849, -122.4094], [37.7752, -122.4183], [37.7695, -122.4285],
  [37.7835, -122.4328], [37.7912, -122.3977], [37.7645, -122.4219],
  [37.7788, -122.3918], [37.7701, -122.4486], [37.7593, -122.4148],
  [37.7826, -122.4469], [37.7743, -122.4371], [37.7667, -122.3987],
  [37.7719, -122.4053], [37.7888, -122.4112], [37.7561, -122.4089],
  [37.7934, -122.4215], [37.7678, -122.4567], [37.7812, -122.4652],
  [37.7532, -122.4193], [37.7859, -122.3893], [37.7621, -122.4345],
  [37.7773, -122.4518], [37.7903, -122.4301], [37.7548, -122.4425],
  [37.7866, -122.4178], [37.7712, -122.3945], [37.7639, -122.4612],
  [37.7795, -122.4039], [37.7582, -122.4267], [37.7841, -122.4543],
  [37.7724, -122.4159], [37.7656, -122.4398], [37.7918, -122.4067],
  [37.7567, -122.4512], [37.7876, -122.4234], [37.7698, -122.3912],
  [37.7612, -122.4178], [37.7833, -122.3978],
  [37.7685, -122.4489], [37.7945, -122.4145], [37.7573, -122.4334],
  [37.7808, -122.4412], [37.7662, -122.4078],
  [37.7891, -122.4289], [37.7523, -122.4223],
  // West SF – Richmond, Sunset, Golden Gate Park area
  [37.7752, -122.4823], [37.7789, -122.4912], [37.7711, -122.4945],
  [37.7735, -122.5034], [37.7698, -122.5089], [37.7761, -122.5123],
  [37.7643, -122.4878], [37.7672, -122.4956], [37.7618, -122.5012],
  [37.7589, -122.4889], [37.7556, -122.4967], [37.7534, -122.5045],
  [37.7812, -122.4789], [37.7838, -122.4867], [37.7865, -122.4934],
  [37.7801, -122.5067], [37.7778, -122.5145], [37.7745, -122.5189],
  [37.7612, -122.5078], [37.7578, -122.5134], [37.7545, -122.4812],
  [37.7823, -122.5012], [37.7856, -122.5078], [37.7689, -122.5167],
  [37.7656, -122.5089], [37.7723, -122.4756], [37.7667, -122.4812],
  [37.7598, -122.4745], [37.7512, -122.4878], [37.7489, -122.4956],
];

const bandColors = {
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
};

function createVehicleIcon(vehicleId: string, band: "green" | "amber" | "red") {
  const color = bandColors[band];
  return L.divIcon({
    className: "vehicle-marker",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;">
        <div style="
          background:${color};
          color:#000;
          font-size:10px;
          font-weight:700;
          font-family:'JetBrains Mono',monospace;
          padding:2px 5px;
          border-radius:3px;
          white-space:nowrap;
          line-height:1.2;
          box-shadow:0 1px 4px rgba(0,0,0,0.5);
          border:1px solid rgba(0,0,0,0.2);
        ">${vehicleId}</div>
        <div style="
          width:0;height:0;
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-top:6px solid ${color};
        "></div>
        <div style="
          width:8px;height:8px;
          background:${color};
          border-radius:50%;
          border:2px solid #000;
          box-shadow:0 0 6px ${color};
          margin-top:-1px;
        "></div>
      </div>
    `,
    iconSize: [60, 40],
    iconAnchor: [30, 40],
  });
}

function selectVehicles(tasks: Task[]): { task: Task; band: "green" | "amber" | "red" }[] {
  const green = tasks.filter((t) => getBand(t.elapsed) === "green");
  const amber = tasks.filter((t) => getBand(t.elapsed) === "amber");
  const red = tasks.filter((t) => getBand(t.elapsed) === "red");

  const pickN = (arr: Task[], n: number) => arr.slice(0, n);
  const gCount = Math.floor(green.length * 0.5);
  const aCount = Math.floor(amber.length * 0.5);
  const rCount = Math.floor(red.length * 0.5);

  const gArr = pickN(green, gCount).map((t) => ({ task: t, band: "green" as const }));
  const aArr = pickN(amber, aCount).map((t) => ({ task: t, band: "amber" as const }));
  const rArr = pickN(red, rCount).map((t) => ({ task: t, band: "red" as const }));

  // Interleave bands so colors are evenly distributed across map positions
  const result: { task: Task; band: "green" | "amber" | "red" }[] = [];
  const maxLen = Math.max(gArr.length, aArr.length, rArr.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < gArr.length) result.push(gArr[i]);
    if (i < aArr.length) result.push(aArr[i]);
    if (i < rArr.length) result.push(rArr[i]);
  }
  return result;
}

const LiveDashboardMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  const vehicles = useMemo(() => selectVehicles(allTasks), []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [37.7749, -122.4194],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Light tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Zoom control bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Attribution bottom-left
    L.control.attribution({ position: "bottomleft" }).addTo(map).addAttribution(
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
    );

    // Plot vehicles
    vehicles.forEach(({ task, band }, i) => {
      const pos = sfStreetPositions[i % sfStreetPositions.length];
      const icon = createVehicleIcon(task.vehicleId, band);
      L.marker(pos, { icon }).addTo(map);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [vehicles]);

  return (
    <div className="h-full panel-border flex flex-col">
      <div className="panel-header flex items-center justify-between">
        <span>Live Dashboard</span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Healthy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning" /> Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive" /> Critical
          </span>
        </div>
      </div>
      <div ref={mapRef} className="flex-1" />
    </div>
  );
};

export default LiveDashboardMap;
