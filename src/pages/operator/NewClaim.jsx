import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OperatorNavbar from "../../components/operator/OperatorNavbar";
import { mockEvidence } from "../../data/mockData";
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, ChevronLeft, Upload, Clock } from "lucide-react";

const STEPS = ["Intake", "Evidence", "Estimate", "Review", "Package"];

const CLAIM_TYPES = ["Non-Delivery", "Damaged", "Not As Described", "Counterfeit / Fraud"];

const WIN_CONFIG = {
  "Non-Delivery": { band: "Strong", color: "emerald", score: 78, for: ["GPS delivery confirmed to receipt address", "xentag auth certificate valid", "Zero shock events during transit"], against: ["No signature confirmation on file", "Pre-load photo not available"], missing: "Signature confirmation for high-value orders" },
  "Damaged": { band: "Moderate", color: "amber", score: 55, for: ["Shock sensor data shows 0 anomalies", "Pre-load condition photo available"], against: ["No carrier damage claim filed", "Missing temperature log"], missing: "File a carrier damage claim immediately" },
  "Not As Described": { band: "Moderate", color: "amber", score: 62, for: ["Listing description matches shipped item", "xentag scan history logged"], against: ["No pre-ship video of item", "Message history limited"], missing: "Upload pre-ship condition video" },
  "Counterfeit / Fraud": { band: "Weak", color: "danger", score: 31, for: ["xentag authentication certificate valid", "Full chain of custody logged"], against: ["Card-not-present fraud is hard to win", "No signature confirmation"], missing: "xentag certification is your strongest asset — lead with it" },
};

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            i < current ? "bg-emerald text-white" : i === current ? "bg-navy text-white" : "bg-gray-100 text-gray-400"
          }`}>
            {i < current ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
            {step}
          </div>
          {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
        </div>
      ))}
    </div>
  );
}

function EvidenceItem({ item }) {
  const icons = {
    present: <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />,
    missing: <XCircle className="w-4 h-4 text-danger flex-shrink-0" />,
    partial: <AlertTriangle className="w-4 h-4 text-amber flex-shrink-0" />,
  };
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${item.status === "present" ? "bg-emerald-50" : "bg-red-50"}`}>
      {icons[item.status]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{item.label}</p>
        {item.value ? <p className="text-xs text-gray-500 mt-0.5">{item.value}</p> : <p className="text-xs text-danger mt-0.5">Not found — upload manually</p>}
        <p className="text-xs text-gray-400 mt-0.5">Source: {item.source}</p>
      </div>
    </div>
  );
}

export default function NewClaim() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [noticeText, setNoticeText] = useState("");
  const [orderRef, setOrderRef] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [claimType, setClaimType] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [approved, setApproved] = useState(false);

  const detectType = () => {
    if (!noticeText && !orderRef) return;
    setDetecting(true);
    setTimeout(() => {
      setClaimType("Non-Delivery");
      setDetecting(false);
    }, 1500);
  };

  const win = claimType ? WIN_CONFIG[claimType] : null;
  const bandColor = { emerald: "bg-emerald", amber: "bg-amber", danger: "bg-danger" };
  const scoreWidth = win ? `${win.score}%` : "0%";

  return (
    <div className="min-h-screen bg-bg">
      <OperatorNavbar />

      {/* Deadline banner */}
      {deadline && (
        <div className="bg-amber-500 text-white text-sm text-center py-2 font-semibold flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          Response deadline: {deadline} — submit your package before this date
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="font-display text-3xl text-navy">New Claim</h1>
          <p className="text-gray-500 mt-1">Assemble your freight claim defense package</p>
        </div>

        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">

          {/* ── STEP 0: INTAKE ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Paste your claim notice</label>
                <textarea
                  value={noticeText}
                  onChange={e => { setNoticeText(e.target.value); setClaimType(null); }}
                  onBlur={detectType}
                  rows={6}
                  placeholder="Paste the claim notice text here..."
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
                />
                <div className="mt-2 flex items-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-navy/40 transition-colors">
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Or upload PDF / image of claim notice</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Reference</label>
                  <input value={orderRef} onChange={e => setOrderRef(e.target.value)} placeholder="ORD-10421" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Claim Amount</label>
                  <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="$4,200" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Response Deadline</label>
                  <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
                </div>
              </div>

              {/* Claim type detection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Claim Type</label>
                {detecting ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse-soft">
                    <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                    Analyzing claim notice...
                  </div>
                ) : claimType ? (
                  <div className="flex items-center gap-2">
                    <span className="bg-navy text-white text-sm font-semibold px-4 py-1.5 rounded-full">✓ {claimType}</span>
                    <button onClick={() => setClaimType(null)} className="text-xs text-gray-400 hover:text-gray-600">Override</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {CLAIM_TYPES.map(t => (
                      <button key={t} onClick={() => setClaimType(t)} className="text-left border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:border-navy hover:bg-navy/5 transition-colors">
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 1: EVIDENCE ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-navy text-lg">Evidence Review</h3>
                  <p className="text-sm text-gray-500">Claim type: {claimType}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Evidence completeness</p>
                  <p className="text-2xl font-bold text-emerald">75%</p>
                </div>
              </div>

              {[
                { label: "📍 Delivery Proof", items: mockEvidence.delivery },
                { label: "📦 Condition Proof", items: mockEvidence.condition },
                { label: "🏷️ Identity Proof", items: mockEvidence.identity },
              ].map(bucket => (
                <div key={bucket.label}>
                  <h4 className="text-sm font-bold text-gray-700 mb-2">{bucket.label}</h4>
                  <div className="space-y-2">
                    {bucket.items.map(item => <EvidenceItem key={item.label} item={item} />)}
                  </div>
                </div>
              ))}

              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <Upload className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                <p className="text-sm text-gray-400">Upload additional evidence (photos, signed receipts, PDFs)</p>
              </div>
            </div>
          )}

          {/* ── STEP 2: WIN ESTIMATE ── */}
          {step === 2 && win && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-navy text-lg mb-1">Win Likelihood Estimate</h3>
                <p className="text-sm text-gray-500">Based on evidence collected for {claimType}</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">Likelihood</span>
                  <span className={`font-bold text-lg ${win.band === "Strong" ? "text-emerald" : win.band === "Moderate" ? "text-amber" : "text-danger"}`}>{win.band}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${bandColor[win.color]}`} style={{ width: scoreWidth }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{win.score}% confidence score</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <h4 className="text-sm font-bold text-emerald mb-2">✅ Working for you</h4>
                  <ul className="space-y-1.5">
                    {win.for.map(f => <li key={f} className="text-xs text-gray-700">• {f}</li>)}
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-xl">
                  <h4 className="text-sm font-bold text-danger mb-2">❌ Working against you</h4>
                  <ul className="space-y-1.5">
                    {win.against.map(a => <li key={a} className="text-xs text-gray-700">• {a}</li>)}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-bold text-amber-800 mb-1">💡 Biggest improvement</p>
                <p className="text-sm text-amber-700">{win.missing}</p>
              </div>

              <div className="p-4 bg-gray-100 rounded-xl">
                <p className="text-xs text-gray-500">⚠️ <strong>Not a guarantee.</strong> This estimate is based on the evidence provided. The final decision rests with the insurer, arbitrator, or court — not CargoGuard AI.</p>
              </div>
            </div>
          )}

          {/* ── STEP 3: REVIEW ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-navy text-lg mb-1">Review Your Package</h3>
                <p className="text-sm text-gray-500">Read and approve before generating the final package</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 space-y-4 max-h-72 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Cover Narrative</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    On June 1, 2026 at 14:32, Vehicle #447 delivered shipment order {orderRef || "#10421"} to the address specified on the purchase order (490 Elm Ave, Toronto ON). GPS coordinates confirmed delivery to the correct address. Zenduit telematics recorded zero shock events during transit, and the xentag authentication certificate was validated at delivery, confirming product authenticity throughout the supply chain.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mt-2">
                    The attached dashcam footage and sensor logs provide independent verification of delivery conditions. We respectfully request the chargeback be reversed in light of the verifiable evidence presented.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Evidence Index</h4>
                  <ol className="space-y-1 text-sm text-gray-700">
                    <li>1. GPS delivery log (Zenduit) — confirms delivery Jun 1, 2026 14:32</li>
                    <li>2. Dashcam clip (Zenduit) — shows intact delivery</li>
                    <li>3. Shock sensor data (Zenduit) — 0 events during transit</li>
                    <li>4. xentag auth certificate — valid, no tampering detected</li>
                    <li>5. xentag scan history — 4 scans logged across chain of custody</li>
                  </ol>
                </div>
              </div>

              <div className="p-4 bg-gray-100 rounded-xl">
                <p className="text-xs text-gray-500">⚠️ <strong>Not legal advice.</strong> This package was assembled from verified telematics and authentication data. Review carefully before submission.</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)} className="mt-0.5 accent-navy" />
                <span className="text-sm text-gray-700">I have reviewed the package and approve it for generation</span>
              </label>
            </div>
          )}

          {/* ── STEP 4: PACKAGE READY ── */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-navy">Package Ready!</h3>
                <p className="text-gray-500 mt-1">Your claim defense package has been generated</p>
              </div>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button className="w-full bg-navy text-white py-3 rounded-xl font-semibold hover:bg-navy-light transition-colors flex items-center justify-center gap-2">
                  ⬇ Download PDF Package
                </button>
                <button className="w-full border border-navy text-navy py-3 rounded-xl font-semibold hover:bg-navy/5 transition-colors">
                  📋 Copy Cover Narrative
                </button>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <p className="text-sm font-bold text-amber-800 mb-1">📬 Next step</p>
                <p className="text-sm text-amber-700">Submit this package to your insurer before <strong>{deadline || "your deadline"}</strong>. CargoGuard AI does not submit on your behalf — you must submit through your insurer's portal or contact.</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl text-left">
                <p className="text-sm font-bold text-gray-700 mb-2">💡 Prevention tips for {claimType}</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Enable signature confirmation for orders over $1,000</li>
                  <li>• Always capture pre-load dashcam footage before departure</li>
                  <li>• File carrier damage claims within 24 hours of delivery</li>
                </ul>
              </div>

              <button onClick={() => navigate("/dashboard")} className="text-navy font-semibold text-sm hover:underline">
                ← Back to Dashboard
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => step === 0 ? navigate("/dashboard") : setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {step === 0 ? "Cancel" : "Back"}
              </button>
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && !claimType || step === 3 && !approved}
                className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === 3 ? "Approve & Generate Package" : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
