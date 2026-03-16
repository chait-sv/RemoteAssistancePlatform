// Shared task generation logic used by OpenTasksTable and LiveDashboardMap

export const faultTypes = ["Fleet CX", "AV Platform", "Vehicle Platform", "Hardware"];
export const statuses = ["Not Started", "In progress", "Rescue", "Closed"];
export const operators = [
  "J. Martinez", "A. Chen", "R. Patel", "K. Okonkwo", "L. Johansson",
  "M. Tanaka", "S. Williams", "D. Kim", "P. Novak", "T. Adeyemi",
  "C. Rivera", "B. Schmidt", "N. Gupta", "F. Larsen", "H. Yamamoto",
];
export const faultCodes: Record<string, string[]> = {
  "Fleet CX": ["CX-001", "CX-002", "CX-003", "CX-004", "CX-005", "CX-006", "CX-007", "CX-008"],
  "AV Platform": ["AV-101", "AV-102", "AV-103", "AV-104"],
  "Vehicle Platform": ["VP-201", "VP-202", "VP-203"],
  Hardware: ["HW-301", "HW-302", "HW-303", "HW-304"],
};
export const faultCodeDescriptions: Record<string, string> = {
  "CX-001": "Customer pickup location error",
  "CX-002": "Passenger timeout exceeded",
  "CX-003": "Unexpected route deviation",
  "CX-004": "Rider app synchronization issue",
  "CX-005": "Estimated arrival miscalculation",
  "CX-006": "Door mechanism failure at stop",
  "CX-007": "Payment gateway delay",
  "CX-008": "Cancellation state conflict",
  "AV-101": "Perception accuracy degraded",
  "AV-102": "Planning module timeout",
  "AV-103": "Localization position drift",
  "AV-104": "Prediction pipeline error",
  "VP-201": "Brake subsystem alert",
  "VP-202": "Steering control fault",
  "VP-203": "Thermal limit exceeded",
  "HW-301": "LiDAR obstruction detected",
  "HW-302": "Camera stream interrupted",
  "HW-303": "GNSS signal degraded",
  "HW-304": "Radar alignment drift",
};
export const descriptions: Record<string, string[]> = {
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

export interface Task {
  id: string;
  description: string;
  priority: string;
  vehicleId: string;
  faultCode: string;
  faultDescription: string;
  faultType: string;
  created: Date;
  elapsed: number;
  operator: string;
  status: string;
}

export function generateTasks(): Task[] {
  const rand = seededRandom(42);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  const typePool: string[] = [
    ...Array(60).fill("Fleet CX"),
    ...Array(20).fill("AV Platform"),
    ...Array(10).fill("Vehicle Platform"),
    ...Array(10).fill("Hardware"),
  ];
  for (let i = typePool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [typePool[i], typePool[j]] = [typePool[j], typePool[i]];
  }

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
    const createdOffset = Math.floor(rand() * 86400) * 1000;
    const created = new Date(now - createdOffset);
    const elapsedRoll = rand();
    const elapsed = elapsedRoll < 0.6
      ? Math.floor(rand() * 40)
      : elapsedRoll < 0.8
        ? 40 + Math.floor(rand() * 20)
        : 61 + Math.floor(rand() * 240);
    const fc = pick(faultCodes[faultType]);
    return {
      id: `INT-${5000 + i}`,
      description: pick(descriptions[faultType]),
      priority: pick(priorities),
      vehicleId: `NL-${String(Math.floor(rand() * 200)).padStart(4, "0")}`,
      faultCode: fc,
      faultDescription: faultCodeDescriptions[fc] ?? "",
      faultType,
      created,
      elapsed,
      operator: pick(operators),
      status: statusPool[i],
    };
  });
}

export function generateClosedTasks(): Task[] {
  const rand = seededRandom(999);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  const typePool: string[] = [
    ...Array(120).fill("Fleet CX"),
    ...Array(40).fill("AV Platform"),
    ...Array(20).fill("Vehicle Platform"),
    ...Array(20).fill("Hardware"),
  ];
  for (let i = typePool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [typePool[i], typePool[j]] = [typePool[j], typePool[i]];
  }

  const priorities = ["P1", "P2", "P3"];
  const now = Date.now();

  return Array.from({ length: 200 }, (_, i) => {
    const faultType = typePool[i];
    const createdOffset = (86400 + Math.floor(rand() * 604800)) * 1000;
    const created = new Date(now - createdOffset);
    const elapsedRoll = rand();
    const elapsed = elapsedRoll < 0.6
      ? Math.floor(rand() * 40)
      : elapsedRoll < 0.8
        ? 40 + Math.floor(rand() * 20)
        : 61 + Math.floor(rand() * 240);
    return {
      id: `INT-${6000 + i}`,
      description: pick(descriptions[faultType]),
      priority: pick(priorities),
      vehicleId: `NL-${String(Math.floor(rand() * 200)).padStart(4, "0")}`,
      faultCode: pick(faultCodes[faultType]),
      faultType,
      created,
      elapsed,
      operator: pick(operators),
      status: "Closed",
    };
  });
}

export const allTasks = generateTasks();
export const closedTasks = generateClosedTasks();
export const allTasksWithClosed = [...allTasks, ...closedTasks];

export function getBand(elapsed: number): "green" | "amber" | "red" {
  if (elapsed > 60) return "red";
  if (elapsed >= 40) return "amber";
  return "green";
}

export const colorBands = {
  green: { min: 0, max: 39 },
  amber: { min: 40, max: 59 },
  red: { min: 61, max: 300 },
};

export function wrapInBand(value: number, band: keyof typeof colorBands) {
  const { min, max } = colorBands[band];
  const range = max - min + 1;
  return min + ((value - min) % range + range) % range;
}
