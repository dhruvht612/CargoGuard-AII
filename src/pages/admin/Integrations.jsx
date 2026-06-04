import { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Key, Zap } from "lucide-react";

const integrations = [
  { id: "zenduit", name: "Zenduit", description: "Telematics, GPS, dashcam, and sensor data", status: "live", lastSync: "2 min ago", latency: "142ms", color: "emerald" },
  { id: "xentag", name: "xentag", description: "Product authentication, scan history, tamper detection", status: "live", lastSync: "5 min ago", latency: "98ms", color: "emerald" },
  { id: "anthropic", name: "Anthropic LLM", description: "Claim classification and package generation", status: "mock", lastSync: "Active", latency: "820ms", color: "amber" },
  { id: "carrier", name: "Carrier API", description: "Real-time carrier tracking and claim filing", status: "offline", lastSync: "N/A", latency: "N/A", color: "danger" },
];

function StatusIcon({ status }) {
  if (status === "live") return <CheckCircle className="w-5 h-5 text-emerald" />;
  if (status === "mock") return <AlertTriangle className="w-5 h-5 text-amber" />;
  return <XCircle className="w-5 h-5 text-danger" />;
}

function StatusLabel({ status }) {
  const map = {
    live: "bg-emerald-100 text-emerald-700",
    mock: "bg-amber-100 text-amber-700",
    offline: "bg-red-100 text-red-700",
  };
  const labels = { live: "Connected", mock: "Mock Mode", offline: "Not Connected" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status]}`}>{labels[status]}</span>;
}

export default function Integrations() {
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState({});

  const runTest = (id) => {
    setTesting(id);
    setTestResult(r => ({ ...r, [id]: null }));
    setTimeout(() => {
      setTesting(null);
      setTestResult(r => ({ ...r, [id]: id === "carrier" ? "error" : "success" }));
    }, 1500);
  };

  return (
    <div className="p-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl text-navy">Integrations</h1>
        <p className="text-gray-500 mt-1">Manage external data connections</p>
      </div>

      <div className="space-y-4">
        {integrations.map((intg, i) => (
          <div key={intg.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in stagger-${i + 1}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  intg.status === "live" ? "bg-emerald-50" : intg.status === "mock" ? "bg-amber-50" : "bg-red-50"
                }`}>
                  <StatusIcon status={intg.status} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-navy text-lg">{intg.name}</h3>
                    <StatusLabel status={intg.status} />
                  </div>
                  <p className="text-sm text-gray-500">{intg.description}</p>
                  <div className="flex items-center gap-6 mt-3">
                    <div>
                      <p className="text-xs text-gray-400">Last sync</p>
                      <p className="text-sm font-semibold text-gray-700">{intg.lastSync}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Latency</p>
                      <p className="text-sm font-semibold text-gray-700">{intg.latency}</p>
                    </div>
                    {testResult[intg.id] && (
                      <div>
                        <p className="text-xs text-gray-400">Last test</p>
                        <p className={`text-sm font-semibold ${testResult[intg.id] === "success" ? "text-emerald" : "text-danger"}`}>
                          {testResult[intg.id] === "success" ? "✓ Passed" : "✗ Failed"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {intg.status !== "offline" && (
                  <>
                    <button
                      onClick={() => runTest(intg.id)}
                      disabled={testing === intg.id}
                      className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {testing === intg.id
                        ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Testing...</>
                        : <><Zap className="w-3.5 h-3.5" /> Test</>
                      }
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                      <Key className="w-3.5 h-3.5" /> Rotate Key
                    </button>
                    {intg.status === "mock" && (
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors">
                        Switch to Live
                      </button>
                    )}
                  </>
                )}
                {intg.status === "offline" && (
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-semibold cursor-not-allowed">
                    Configure (Roadmap)
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
