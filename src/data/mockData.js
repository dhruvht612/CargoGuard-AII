export const mockClaims = [
  { id: "CG-1042", type: "Non-Delivery", amount: 4200, deadline: "2026-06-08", status: "Active", winBand: "Strong", operator: "Alex Rivera", company: "TransNorth Fleet", created: "2026-06-01" },
  { id: "CG-1041", type: "Damaged", amount: 1100, deadline: "2026-06-10", status: "Draft", winBand: "Moderate", operator: "Sam Chen", company: "Maple Logistics", created: "2026-06-02" },
  { id: "CG-1040", type: "Counterfeit", amount: 8500, deadline: "2026-06-07", status: "Submitted", winBand: "Weak", operator: "Maria Santos", company: "GreatLake Freight", created: "2026-05-30" },
  { id: "CG-1039", type: "Not As Described", amount: 2300, deadline: "2026-06-12", status: "Won", winBand: "Strong", operator: "David Kim", company: "TransNorth Fleet", created: "2026-05-28" },
  { id: "CG-1038", type: "Non-Delivery", amount: 6700, deadline: "2026-06-05", status: "Lost", winBand: "Weak", operator: "Alex Rivera", company: "TransNorth Fleet", created: "2026-05-25" },
  { id: "CG-1037", type: "Damaged", amount: 3400, deadline: "2026-06-14", status: "Active", winBand: "Moderate", operator: "Priya Patel", company: "Apex Carriers", created: "2026-06-01" },
];

export const mockUsers = [
  { id: "U-001", name: "Alex Rivera", email: "alex@transnorth.ca", company: "TransNorth Fleet", role: "Manager", claims: 12, joined: "2026-01-15", status: "Active" },
  { id: "U-002", name: "Sam Chen", email: "sam@maplelogistics.ca", company: "Maple Logistics", role: "Operator", claims: 5, joined: "2026-02-20", status: "Active" },
  { id: "U-003", name: "Maria Santos", email: "maria@greatlake.ca", company: "GreatLake Freight", role: "Operator", claims: 8, joined: "2026-01-30", status: "Active" },
  { id: "U-004", name: "David Kim", email: "david@transnorth.ca", company: "TransNorth Fleet", role: "Operator", claims: 3, joined: "2026-03-10", status: "Active" },
  { id: "U-005", name: "Priya Patel", email: "priya@apex.ca", company: "Apex Carriers", role: "Manager", claims: 9, joined: "2026-01-05", status: "Suspended" },
  { id: "U-006", name: "Jordan Lee", email: "jordan@apex.ca", company: "Apex Carriers", role: "Operator", claims: 2, joined: "2026-04-01", status: "Active" },
];

export const mockAnalytics = {
  claimsOverTime: [
    { month: "Jan", claims: 8 }, { month: "Feb", claims: 14 }, { month: "Mar", claims: 11 },
    { month: "Apr", claims: 19 }, { month: "May", claims: 23 }, { month: "Jun", claims: 16 },
  ],
  claimsByType: [
    { type: "Non-Delivery", count: 38 }, { type: "Damaged", count: 29 },
    { type: "Not As Described", count: 18 }, { type: "Counterfeit", count: 6 },
  ],
  winRateByType: [
    { type: "Non-Delivery", rate: 74 }, { type: "Damaged", rate: 58 },
    { type: "Not As Described", rate: 62 }, { type: "Counterfeit", rate: 31 },
  ],
};

export const mockEvidence = {
  delivery: [
    { label: "GPS Delivery Confirmation", status: "present", value: "Jun 1, 2026 14:32 — 490 Elm Ave, Toronto ON", source: "Zenduit" },
    { label: "Address Match", status: "present", value: "Matches receipt address ✓", source: "Zenduit" },
    { label: "Dashcam Clip", status: "present", value: "2.3 MB clip available", source: "Zenduit" },
    { label: "Signature Confirmation", status: "missing", value: null, source: "Zenduit" },
  ],
  condition: [
    { label: "Shock Sensor Events", status: "present", value: "0 events during transit", source: "Zenduit" },
    { label: "Pre-Load Photo", status: "missing", value: null, source: "Manual Upload" },
    { label: "Temperature Log", status: "present", value: "Within range throughout transit", source: "Zenduit" },
  ],
  identity: [
    { label: "xentag Auth Certificate", status: "present", value: "Valid — authenticated Jun 1, 2026", source: "xentag" },
    { label: "Scan History", status: "present", value: "4 scans logged", source: "xentag" },
    { label: "Tamper Detected", status: "present", value: "No tampering detected", source: "xentag" },
  ],
};
