# CargoGuard AI — Technical Architecture Document

## 1. Overview

CargoGuard AI is a web-based AI agent application. The architecture follows a three-tier model: frontend (React), backend API (Node.js/Python), and external data integrations (Zenduit, xentag). The AI layer runs as an orchestration service between the backend and the LLM provider.

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│              React Frontend (Next.js)                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼──────────────────────────────────┐
│                  API GATEWAY                            │
│            (Node.js / Express or FastAPI)               │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Auth       │  │  Claim       │  │  Package      │  │
│  │  Service    │  │  Orchestrator│  │  Generator    │  │
│  └─────────────┘  └──────┬───────┘  └───────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼──────┐  ┌───────▼──────┐  ┌──────▼───────┐
│  LLM Layer   │  │  Zenduit API │  │  xentag API  │
│  (Claude /   │  │  - GPS logs  │  │  - Scan logs │
│   GPT-4o)    │  │  - Dashcam   │  │  - Auth cert │
│              │  │  - Sensors   │  │  - Tamper    │
└──────────────┘  └──────────────┘  └──────────────┘
        │
┌───────▼──────────────────────────────────────────────┐
│              Evidence Store (Session-scoped)          │
│         In-memory only — cleared on session end       │
└──────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14 (React) | SSR, fast routing, easy deployment |
| Backend | FastAPI (Python) or Express (Node.js) | Async, easy LLM integration |
| LLM | Claude claude-sonnet-4-20250514 via Anthropic API | Strong reasoning, structured output |
| Evidence Store | In-memory (Redis session or Python dict) | Zero persistence by default |
| File Handling | Multer (Node) or python-multipart | PDF/image upload support |
| PDF Generation | WeasyPrint or Puppeteer | Claim package export |
| Zenduit Integration | REST API (mock in MVP) | Telematics data source |
| xentag Integration | REST API (mock in MVP) | Authentication data source |
| Auth | JWT + session tokens | Stateless, secure |
| Hosting | Vercel (frontend) + Railway/Render (backend) | Fast MVP deployment |
| CI/CD | GitHub Actions | Auto-deploy on push to main |

---

## 4. Core Services

### 4.1 Claim Orchestrator
- Receives raw claim notice (text or parsed PDF)
- Calls LLM to classify into one of four claim types
- Triggers appropriate evidence pull strategy per claim type
- Manages state machine: S0 → S1 → S2 → S3 → S4 → S5 → S6

### 4.2 Evidence Puller
- Zenduit adapter: pulls GPS route, delivery timestamp, dashcam clips, shock/tilt sensor data for given order ID and date range
- xentag adapter: pulls scan log, authentication certificate, tamper detection status for given product/tag ID
- Returns normalized evidence object:
```json
{
  "delivery_proof": { "gps_confirmed": true, "timestamp": "...", "dashcam_url": "..." },
  "condition_proof": { "shock_events": 0, "pre_load_photo": "...", "sensor_range_ok": true },
  "identity_proof": { "auth_valid": true, "scan_history": [...], "tamper_detected": false }
}
```

### 4.3 Win Estimator
- Rule-based scoring engine (not pure LLM) for transparency and auditability
- Inputs: claim type + evidence object
- Outputs: band (Weak/Moderate/Strong), factor list, missing item, disclaimer
- LLM used only to format the human-readable explanation

### 4.4 Package Generator
- Template engine fills structured claim response
- Sections: Cover Narrative, Evidence Index, Attached Files, Disclaimer
- Output: structured text (paste-ready) + PDF export
- All references to facts are grounded in the evidence object — no hallucinated claims

---

## 5. Data Flow

```
1. User uploads claim notice
2. Backend parses text (PDF → text via pdfplumber if needed)
3. LLM classifies claim type
4. Backend calls Zenduit + xentag APIs with order/tag ID
5. Evidence normalized into three buckets
6. Win estimator scores the evidence
7. Frontend displays evidence review + win band
8. User approves
9. Package generator produces final doc
10. Session data cleared
```

---

## 6. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/claims/intake | Submit claim notice text or file |
| GET | /api/claims/:id/evidence | Get pulled evidence for a claim |
| POST | /api/claims/:id/estimate | Run win likelihood estimate |
| POST | /api/claims/:id/approve | Human approval gate |
| GET | /api/claims/:id/package | Download finalized package |
| DELETE | /api/claims/:id | Clear session data |

---

## 7. Integration Specs

### Zenduit (Mock for MVP)
```
GET /zenduit/v1/trips?order_id={id}&date={date}
GET /zenduit/v1/dashcam?vehicle_id={id}&timestamp={ts}
GET /zenduit/v1/sensors?vehicle_id={id}&date={date}
```

### xentag (Mock for MVP)
```
GET /xentag/v1/tag/{tag_id}/scans
GET /xentag/v1/tag/{tag_id}/authenticate
GET /xentag/v1/tag/{tag_id}/tamper
```

---

## 8. Scalability

- Stateless backend — horizontal scaling via load balancer
- Session data in Redis (shared across instances)
- LLM calls async with timeout + retry
- Zenduit/xentag calls parallelized (Promise.all / asyncio.gather)
- PDF generation offloaded to background worker queue (Bull / Celery)

---

## 9. Deployment

```
main branch push
    → GitHub Actions runs tests
    → Frontend deploys to Vercel
    → Backend deploys to Railway
    → Environment variables injected from GitHub Secrets
```
