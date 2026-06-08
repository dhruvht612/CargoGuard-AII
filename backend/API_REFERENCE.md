# CargoGuard AI — API Reference

Base URL: `http://localhost:8000`  
All protected routes require `Authorization: Bearer <access_token>`.

---

## Auth

### POST /auth/login
Authenticate and receive a JWT.

**Request**
```json
{ "email": "operator@cargoguard.ai", "password": "operator123" }
```

**Response 200**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "U-001",
    "name": "Alex Rivera",
    "email": "operator@cargoguard.ai",
    "role": "operator",
    "company": "TransNorth Fleet"
  }
}
```

**Errors**
- `401` — invalid credentials

---

### POST /auth/logout
Invalidate the current session token.

**Response 200** `{ "message": "logged out" }`

---

## Claims

### GET /claims
List claims for the authenticated operator.

**Query params**
| Param | Type | Description |
|---|---|---|
| status | string | Filter: Active, Draft, Submitted, Won, Lost |
| type | string | Filter by claim type |
| limit | int | Default 50 |
| offset | int | Default 0 |

**Response 200**
```json
{
  "claims": [
    {
      "id": "CG-1042",
      "type": "Non-Delivery",
      "amount": 4200,
      "deadline": "2026-06-08",
      "status": "Active",
      "win_band": "Strong",
      "created": "2026-06-01T00:00:00Z"
    }
  ],
  "total": 6
}
```

---

### POST /claims
Create a new claim (Step 1 of wizard — Intake).

**Request**
```json
{
  "notice_text": "We are disputing shipment order #10421...",
  "order_ref": "ORD-10421",
  "amount": 4200,
  "deadline": "2026-06-08"
}
```

**Response 201**
```json
{
  "id": "CG-1043",
  "status": "Draft",
  "claim_type": "Non-Delivery",
  "claim_type_confidence": 0.91,
  "session_id": "sess_abc123"
}
```

The `claim_type` is set by the Classification Agent automatically.  
If `claim_type_confidence < 0.70` the response also includes:
```json
{ "requires_manual_type": true }
```
and the frontend shows the 4-option type selector.

---

### GET /claims/{claim_id}
Fetch a single claim with full detail.

**Response 200**
```json
{
  "id": "CG-1042",
  "type": "Non-Delivery",
  "amount": 4200,
  "deadline": "2026-06-08",
  "status": "Active",
  "win_band": "Strong",
  "win_score": 78,
  "win_factors_for": ["GPS delivery confirmed", "xentag auth valid"],
  "win_factors_against": ["No signature confirmation"],
  "win_missing": "Signature confirmation for high-value orders",
  "order_ref": "ORD-10421",
  "created": "2026-06-01T00:00:00Z",
  "approved_at": null,
  "package_url": null
}
```

---

### PATCH /claims/{claim_id}
Update claim type (manual override) or deadline.

**Request**
```json
{ "claim_type": "Damaged" }
```

**Response 200** — updated claim object

---

### DELETE /claims/{claim_id}
Delete a draft claim and clear its session data.

**Response 204** No content

---

## Evidence

### POST /claims/{claim_id}/evidence/pull
Trigger the Evidence Collection Agent. Queries Zenduit and xentag APIs in parallel.

**Request**
```json
{ "order_id": "ORD-10421", "tag_id": "TAG-88291", "trip_date": "2026-06-01" }
```

**Response 200**
```json
{
  "claim_id": "CG-1042",
  "completeness_score": 75,
  "delivery": [
    { "label": "GPS Delivery Confirmation", "status": "present", "value": "Jun 1, 2026 14:32 — 490 Elm Ave, Toronto ON", "source": "Zenduit" },
    { "label": "Address Match",             "status": "present", "value": "Matches receipt address", "source": "Zenduit" },
    { "label": "Dashcam Clip",              "status": "present", "value": "2.3 MB clip available",  "source": "Zenduit" },
    { "label": "Signature Confirmation",    "status": "missing", "value": null,                     "source": "Zenduit" }
  ],
  "condition": [
    { "label": "Shock Sensor Events", "status": "present", "value": "0 events during transit",         "source": "Zenduit" },
    { "label": "Pre-Load Photo",      "status": "missing", "value": null,                              "source": "Manual Upload" },
    { "label": "Temperature Log",     "status": "present", "value": "Within range throughout transit", "source": "Zenduit" }
  ],
  "identity": [
    { "label": "xentag Auth Certificate", "status": "present", "value": "Valid — authenticated Jun 1, 2026", "source": "xentag" },
    { "label": "Scan History",            "status": "present", "value": "4 scans logged",                    "source": "xentag" },
    { "label": "Tamper Detected",         "status": "present", "value": "No tampering detected",             "source": "xentag" }
  ],
  "gaps_ranked": [
    { "label": "Signature Confirmation", "impact": "large",  "bucket": "delivery" },
    { "label": "Pre-Load Photo",         "impact": "medium", "bucket": "condition" }
  ]
}
```

---

### POST /claims/{claim_id}/evidence/upload
Upload a supplemental evidence file (photo, PDF, signed receipt).

**Request** — multipart/form-data
```
file: <binary>
bucket: "delivery" | "condition" | "identity"
label: "Pre-Load Photo"
```

**Response 201**
```json
{ "item_id": "ev_001", "label": "Pre-Load Photo", "status": "present", "bucket": "condition" }
```

Files are held in session memory only — never written to persistent storage.

---

## Packages

### POST /claims/{claim_id}/packages/score
Run the Strength Scoring Agent against current evidence.

**Response 200**
```json
{
  "win_band": "Strong",
  "win_score": 78,
  "factors_for": [
    "GPS delivery confirmed to receipt address",
    "xentag authentication certificate valid",
    "Zero shock events during transit"
  ],
  "factors_against": [
    "No signature confirmation on file",
    "Pre-load photo not available"
  ],
  "highest_impact_missing": "Signature confirmation for high-value orders",
  "disclaimer": "This is an estimate only. The insurer or arbitrator makes the final decision."
}
```

---

### POST /claims/{claim_id}/packages/draft
Run the Package Generation Agent. Returns a preview — does NOT finalize.

**Response 200**
```json
{
  "draft_id": "draft_abc",
  "cover_narrative": "On June 1, 2026 at 14:32, Vehicle #447 delivered shipment order ORD-10421 to the address specified on the purchase order...",
  "evidence_index": [
    { "n": 1, "label": "GPS delivery log (Zenduit)",   "description": "Confirms delivery Jun 1, 2026 14:32 to correct address" },
    { "n": 2, "label": "Dashcam clip (Zenduit)",        "description": "Shows intact delivery" },
    { "n": 3, "label": "xentag auth certificate",       "description": "Valid, no tampering detected" }
  ],
  "disclaimer": "Not legal advice. This package was assembled from verified telematics and authentication data. Review carefully before submission."
}
```

---

### POST /claims/{claim_id}/packages/approve
Human approval gate. Finalizes the package and generates PDF.  
**No package is finalized without this call.**

**Request**
```json
{ "draft_id": "draft_abc", "approved": true }
```

**Response 200**
```json
{
  "package_id": "pkg_001",
  "pdf_url": "/claims/CG-1042/packages/pkg_001/download",
  "approved_at": "2026-06-08T10:22:00Z",
  "message": "Submit this package to your insurer before 2026-06-08. CargoGuard does not submit on your behalf."
}
```

---

### GET /claims/{claim_id}/packages/{package_id}/download
Download the finalized PDF package.

**Response 200** — `Content-Type: application/pdf`

---

## Admin — Users

> All `/admin/*` routes require `role: admin` in the JWT.

### GET /admin/users
List all users.

**Query params:** `role`, `status`, `search`, `limit`, `offset`

**Response 200**
```json
{
  "users": [
    {
      "id": "U-001",
      "name": "Alex Rivera",
      "email": "alex@transnorth.ca",
      "company": "TransNorth Fleet",
      "role": "Manager",
      "claims_count": 12,
      "joined": "2026-01-15",
      "status": "Active"
    }
  ],
  "total": 6
}
```

---

### POST /admin/users/invite
Send an email invite to a new user.

**Request**
```json
{ "email": "newuser@company.ca", "role": "Operator" }
```

**Response 201** `{ "message": "Invite sent to newuser@company.ca" }`

---

### PATCH /admin/users/{user_id}
Update role or status.

**Request**
```json
{ "role": "Manager" }
```
or
```json
{ "status": "Suspended" }
```

**Response 200** — updated user object

---

### DELETE /admin/users/{user_id}
Delete a user account.

**Response 204** No content

---

## Admin — Claims

### GET /admin/claims
List all claims across all operators.

**Query params:** `type`, `status`, `win_band`, `company`, `date_from`, `date_to`, `limit`, `offset`

**Response 200** — same shape as `GET /claims` but includes `operator` and `company` fields

---

### GET /admin/claims/{claim_id}
Full claim detail for admin view, including evidence object and audit log.

**Response 200** — claim object + `audit_log` array:
```json
{
  "audit_log": [
    { "timestamp": "2026-06-01T10:00:00Z", "actor": "alex@transnorth.ca", "action": "claim_created", "detail": "" },
    { "timestamp": "2026-06-01T10:05:00Z", "actor": "system",             "action": "evidence_pulled", "detail": "completeness: 75%" },
    { "timestamp": "2026-06-01T10:12:00Z", "actor": "alex@transnorth.ca", "action": "package_approved", "detail": "" }
  ]
}
```

---

## Admin — Analytics

### GET /admin/analytics/claims-over-time
**Response 200**
```json
{ "data": [{ "month": "Jan", "claims": 8 }, { "month": "Feb", "claims": 14 }] }
```

### GET /admin/analytics/claims-by-type
**Response 200**
```json
{ "data": [{ "type": "Non-Delivery", "count": 38 }, { "type": "Damaged", "count": 29 }] }
```

### GET /admin/analytics/win-rate-by-type
**Response 200**
```json
{ "data": [{ "type": "Non-Delivery", "rate": 74 }, { "type": "Damaged", "rate": 58 }] }
```

### GET /admin/analytics/response-time
**Response 200**
```json
{ "data": [{ "month": "Jan", "avg_minutes": 18 }, { "month": "Jun", "avg_minutes": 11 }] }
```

---

## Admin — Integrations

### GET /admin/integrations
**Response 200**
```json
{
  "integrations": [
    { "id": "zenduit",    "name": "Zenduit",       "status": "live",    "last_sync": "2 min ago", "latency_ms": 142 },
    { "id": "xentag",     "name": "xentag",        "status": "live",    "last_sync": "5 min ago", "latency_ms": 98  },
    { "id": "anthropic",  "name": "Anthropic LLM", "status": "mock",    "last_sync": "active",    "latency_ms": 820 },
    { "id": "carrier_api","name": "Carrier API",   "status": "offline", "last_sync": "N/A",       "latency_ms": null }
  ]
}
```

### POST /admin/integrations/{integration_id}/test
**Response 200** `{ "result": "success", "latency_ms": 138 }`  
**Response 200** `{ "result": "error",   "message": "Connection refused" }`

### POST /admin/integrations/{integration_id}/rotate-key
**Response 200** `{ "message": "API key rotated. Update your .env file." }`

---

## Admin — Settings

### GET /admin/settings
**Response 200**
```json
{
  "platform_name": "CargoGuard AI",
  "support_email": "support@cargoguard.ai",
  "session_ttl_minutes": 120,
  "rate_limit_per_hour": 100,
  "scoring_weights": {
    "gps_delivery":    40,
    "dashcam":         30,
    "xentag_auth":     20,
    "sensor_data":     10
  }
}
```

### PATCH /admin/settings
**Request** — partial update, any subset of the above fields  
**Response 200** — full updated settings object

---

## Error format

All errors follow this shape:
```json
{ "detail": "Human-readable error message", "code": "ERROR_CODE" }
```

Common error codes:
| Code | HTTP | Meaning |
|---|---|---|
| `AUTH_REQUIRED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient role |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request body invalid |
| `RATE_LIMITED` | 429 | Too many requests |
| `ADAPTER_ERROR` | 502 | Zenduit or xentag API unavailable |
