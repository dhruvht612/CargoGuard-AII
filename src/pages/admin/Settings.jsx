import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [sessionTTL, setSessionTTL] = useState(120);
  const [rateLimit, setRateLimit] = useState(100);
  const [weights, setWeights] = useState({
    gps: 40, dashcam: 30, xentag: 20, sensor: 10,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl text-navy">Settings</h1>
          <p className="text-gray-500 mt-1">Platform configuration</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
            saved ? "bg-emerald text-white" : "bg-navy text-white hover:bg-navy-light"
          }`}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in stagger-1">
          <h3 className="font-bold text-navy mb-5">General</h3>
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: "Platform Name", value: "CargoGuard AI" },
              { label: "Support Email", value: "support@cargoguard.ai" },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <input defaultValue={value}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Win Estimate Weights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in stagger-2">
          <h3 className="font-bold text-navy mb-2">Win Estimate Scoring Weights</h3>
          <p className="text-sm text-gray-500 mb-5">Adjust how much each evidence type contributes to the win likelihood score</p>
          <div className="space-y-5">
            {[
              { key: "gps", label: "GPS Delivery Confirmation" },
              { key: "dashcam", label: "Dashcam / Visual Evidence" },
              { key: "xentag", label: "xentag Authentication" },
              { key: "sensor", label: "Sensor Data (shock/tilt/temp)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">{label}</label>
                  <span className="text-sm font-bold text-navy">{weights[key]}%</span>
                </div>
                <input type="range" min={0} max={60} value={weights[key]}
                  onChange={e => setWeights(w => ({ ...w, [key]: Number(e.target.value) }))}
                  className="w-full accent-navy" />
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">Total weight</span>
              <span className={`text-sm font-bold ${Object.values(weights).reduce((a, b) => a + b, 0) === 100 ? "text-emerald" : "text-danger"}`}>
                {Object.values(weights).reduce((a, b) => a + b, 0)}%
                {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && " (should equal 100%)"}
              </span>
            </div>
          </div>
        </div>

        {/* Session & Rate Limits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in stagger-3">
          <h3 className="font-bold text-navy mb-5">Session & Rate Limits</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Session TTL (minutes)</label>
              <input type="number" value={sessionTTL} onChange={e => setSessionTTL(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
              <p className="text-xs text-gray-400 mt-1">Claim data is cleared after this period</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rate Limit (requests/hour/user)</label>
              <input type="number" value={rateLimit} onChange={e => setRateLimit(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
              <p className="text-xs text-gray-400 mt-1">Max API calls per user per hour</p>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in stagger-4">
          <h3 className="font-bold text-navy mb-5">Platform Audit Log</h3>
          <div className="space-y-3">
            {[
              { time: "2026-06-03 14:21", actor: "Admin User", action: "API key rotated", target: "Zenduit" },
              { time: "2026-06-03 11:05", actor: "Admin User", action: "User suspended", target: "priya@apex.ca" },
              { time: "2026-06-02 09:30", actor: "Admin User", action: "Settings updated", target: "Session TTL → 120 min" },
              { time: "2026-06-01 16:44", actor: "Admin User", action: "User invited", target: "jordan@apex.ca" },
              { time: "2026-05-31 10:12", actor: "Admin User", action: "Integration toggled", target: "Anthropic → mock mode" },
            ].map((entry, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl text-sm">
                <span className="font-mono text-xs text-gray-400 w-36 flex-shrink-0">{entry.time}</span>
                <span className="font-semibold text-gray-700 w-28 flex-shrink-0">{entry.actor}</span>
                <span className="text-gray-600 flex-1">{entry.action}</span>
                <span className="text-navy font-medium">{entry.target}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-navy font-semibold hover:underline">Export full audit log →</button>
        </div>
      </div>
    </div>
  );
}
