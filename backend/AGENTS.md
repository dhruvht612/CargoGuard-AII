# CargoGuard AI — Agent Design

The backend runs four AI agents. Three are in the MVP. One is on the roadmap and requires minimum claim volume before deployment. Each agent has a defined input schema, output schema, LLM role (if any), and fallback behavior.

---

## Agent 1 — Intake & Classification Agent

**File:** `backend/app/agents/classifier.py`

**When it runs:** Immediately after `POST /claims` receives a notice text.

**Input**
```python
{
    "notice_text": str,   # raw claim notice pasted or extracted from PDF
    "order_ref":   Optional[str]
}
```

**What it does**

Sends the notice text to Claude with a structured prompt asking it to:
1. Identify which of the four claim types best matches the notice
2. Return a confidence score (0.0–1.0)
3. Extract structured fields if present: order number, claim amount, stated deadline, counterparty name

Claude is instructed to return JSON only. The response is parsed and validated against `ClaimClassification`.

**Output**
```python
class ClaimClassification(BaseModel):
    claim_type:  ClaimType
    confidence:  float          # 0.0 – 1.0
    order_ref:   Optional[str]
    amount:      Optional[float]
    deadline:    Optional[date]
    raw_extract: dict           # full Claude JSON for audit
```

**Fallback**
If `confidence < 0.70`, the agent returns the best guess but sets `requires_manual_type: true`. The frontend shows the 4-option type selector. If the LLM call fails entirely, the endpoint returns `requires_manual_type: true` with no type preselected.

**LLM role:** High. Classification from unstructured text is where the LLM earns its keep. The prompt uses few-shot examples of all four claim types.

---

## Agent 2 — Evidence Collection Agent

**File:** `backend/app/agents/evidence.py`

**When it runs:** When `POST /claims/{claim_id}/evidence/pull` is called.

**Input**
```python
{
    "claim_type": ClaimType,
    "order_id":   str,
    "tag_id":     Optional[str],
    "trip_date":  date
}
```

**What it does**

1. Calls `adapters/zenduit.py` for the trip record, sensor data, and driver behavior — three parallel `asyncio` tasks
2. Calls `adapters/xentag.py` for the authentication certificate and scan history — one task
3. Normalizes all responses into the `EvidenceBucket` schema
4. Scores completeness: counts present items ÷ expected items for the specific claim type
5. Ranks evidence gaps by their expected impact on win score (hardcoded weights per claim type)

**LLM role:** None. This is pure API orchestration and normalization. The LLM is not used here — deterministic code is faster, cheaper, and more auditable for evidence assembly.

**Fallback**
If Zenduit API is unavailable (`USE_MOCK_ADAPTERS=false` and API times out), the bucket returns all items as `status: "missing"` with `source: "Zenduit — unavailable"` and a banner is shown in the frontend. The operator can upload supplemental files manually.

If `USE_MOCK_ADAPTERS=true` (development), the adapters return the fixture data from `mockData.js` translated to the Python schemas.

---

## Agent 3 — Strength Scoring Agent

**File:** `backend/app/agents/scorer.py`

**When it runs:** When `POST /claims/{claim_id}/packages/score` is called.

**Input**
```python
{
    "claim_type":    ClaimType,
    "evidence":      EvidenceBucket,
    "jurisdiction":  Optional[str]   # "CA-ON", "US-MI", etc. Future use
}
```

**What it does**

Applies a weighted scoring model — no LLM, pure rule-based logic for auditability:

```
Score = sum of (item_weight × presence_multiplier) for all evidence items
```

Weights per claim type (initial values, recalibrated quarterly):

| Evidence Item | Non-Delivery | Damaged | Not As Described | Counterfeit |
|---|---|---|---|---|
| GPS delivery confirmed | 35 | 15 | 10 | 15 |
| Address match | 20 | 10 | 5  | 10 |
| Dashcam clip | 15 | 25 | 10 | 10 |
| Shock/tilt sensors | 5  | 30 | 5  | 5  |
| Temperature log | 5  | 15 | 5  | 5  |
| Pre-load photo | 5  | 15 | 10 | 10 |
| xentag auth cert | 5  | 5  | 30 | 35 |
| Scan history | 5  | 5  | 15 | 30 |
| Tamper log | 5  | 5  | 10 | 30 |

Presence multiplier: `present = 1.0`, `partial = 0.5`, `missing = 0.0`

Score → Band:
- 0–39: Weak
- 40–64: Moderate  
- 65–100: Strong

The top two factors for and against are derived from the items with the highest and lowest weighted contributions to the score.

**LLM role:** Used only to generate the human-readable explanation of the band — "Here is why your score is Strong and what would improve it." The scoring arithmetic itself is deterministic.

**Output** — `ScoreResult` matching the `/score` endpoint response shape above.

---

## Agent 4 — Package Generation Agent

**File:** `backend/app/agents/generator.py`

**When it runs:** When `POST /claims/{claim_id}/packages/draft` is called.

**Input**
```python
{
    "claim_id":     str,
    "claim_type":   ClaimType,
    "order_ref":    str,
    "amount":       float,
    "deadline":     date,
    "evidence":     EvidenceBucket,
    "score_result": ScoreResult
}
```

**What it does**

1. Builds a template-grounded prompt. The prompt instructs Claude to write a factual cover narrative using ONLY the evidence fields provided. Specific instruction: "Do not state any fact that is not present in the evidence object. If a piece of evidence is missing, do not mention it or imply its absence is explained."

2. Claude returns a two-to-three paragraph narrative. The response is validated: every factual claim in the narrative is checked against a list of present evidence items. If the check fails (hallucination detected), the draft is rejected and the generator retries with a stricter prompt.

3. The evidence index is assembled deterministically from the evidence object — not by Claude.

4. The disclaimer is a fixed string appended to every package regardless of Claude output.

**LLM role:** High for the narrative, zero for the evidence index and disclaimer. This separation is what makes the output legally defensible.

**Output** — `PackageDraft` schema. The draft is stored in Redis under the session key for 2 hours. It is never written to a database. The approval call (`POST /packages/approve`) triggers PDF generation and creates the only persistent record.

---

## Agent 5 — Fraud Detection Agent (Roadmap)

**File:** `backend/app/agents/fraud.py` (stub only in MVP)

**When it runs:** In parallel with Evidence Collection for all claims above $2,000.

**Requires:** Minimum 500 labeled claim outcomes in the platform database before the model produces reliable scores. The stub returns `{ "fraud_score": null, "reason": "insufficient_data" }` until that threshold is reached.

**What it will do at scale**

Score claims against fraud indicators:
- Route deviation: GPS route vs. expected route for origin-destination pair
- Timing anomaly: delivery time vs. statistical baseline for the corridor
- Authentication gap: xentag scan missing at expected intermediate stops
- Filing pattern: operator's claim frequency vs. cohort baseline
- Value inflation: claimed amount vs. declared shipment value

Output: `fraud_score` (0–100) + top three contributing factors + recommended action (monitor / investigate / flag).

---

## Adapter mock mode

Both `zenduit.py` and `xentag.py` check `settings.USE_MOCK_ADAPTERS` at startup.

When `USE_MOCK_ADAPTERS=true`, every adapter method returns fixture data that mirrors `mockData.js` — same structure, same values. This means the frontend and backend can be developed and tested end-to-end without live API keys.

When `USE_MOCK_ADAPTERS=false`, the adapters call the real APIs. The switch is a single `.env` change with no code changes required.
