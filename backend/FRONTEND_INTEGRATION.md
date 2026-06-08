# CargoGuard AI — Frontend Integration Guide

This document explains how to wire the React frontend to the real FastAPI backend, replacing all mock data.

---

## 1. Environment setup

Create `frontend/.env.local`:
```
VITE_API_BASE=http://localhost:8000
```

---

## 2. Auth — replace hardcoded login

**Current (mock):** `src/context/AuthContext.jsx` does a local string match.

**Replace with:**

```javascript
// src/context/AuthContext.jsx

const login = async (email, password) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  // store token in memory (NOT localStorage)
  tokenRef.current = data.access_token;
  setUser(data.user);
  return data.user.role;
};
```

Store the JWT in a `useRef` (in-memory, not localStorage). Pass it via an `api` helper:

```javascript
// src/api/client.js
let _token = null;
export const setToken = (t) => { _token = t; };

export const api = async (path, opts = {}) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
      ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
    },
  });
  if (res.status === 401) { /* trigger logout */ }
  return res;
};
```

---

## 3. Claims wizard — replace mock data flow

### Step 1 — Intake (claim creation)

```javascript
// After user fills the form and clicks Continue:
const res = await api("/claims", {
  method: "POST",
  body: JSON.stringify({ notice_text: noticeText, order_ref: orderRef, amount, deadline }),
});
const data = await res.json();
setClaimId(data.id);
setClaimType(data.claim_type);           // pre-filled by Classification Agent
if (data.requires_manual_type) showTypeSelector();
```

### Step 2 — Evidence pull

```javascript
// After claim type is confirmed:
const res = await api(`/claims/${claimId}/evidence/pull`, {
  method: "POST",
  body: JSON.stringify({ order_id: orderRef, tag_id: tagId, trip_date: tripDate }),
});
const evidence = await res.json();
setEvidence(evidence);   // replace mockEvidence import
```

### Step 3 — Score

```javascript
const res = await api(`/claims/${claimId}/packages/score`, { method: "POST" });
const score = await res.json();
setWinBand(score.win_band);
setWinFactors({ for: score.factors_for, against: score.factors_against });
```

### Step 4 — Draft + Approve

```javascript
// Generate draft
const draftRes = await api(`/claims/${claimId}/packages/draft`, { method: "POST" });
const draft = await draftRes.json();
setDraft(draft);

// After human clicks Approve:
const approveRes = await api(`/claims/${claimId}/packages/approve`, {
  method: "POST",
  body: JSON.stringify({ draft_id: draft.draft_id, approved: true }),
});
const pkg = await approveRes.json();
setPackageUrl(pkg.pdf_url);
```

### Step 5 — Download

```javascript
// PDF download link
<a href={`${import.meta.env.VITE_API_BASE}${packageUrl}`}
   target="_blank"
   rel="noopener">
  Download PDF Package
</a>
```

---

## 4. Operator Dashboard — replace mockClaims

```javascript
// src/pages/operator/Dashboard.jsx
useEffect(() => {
  api("/claims").then(r => r.json()).then(data => setClaims(data.claims));
}, []);
```

---

## 5. Admin portal — replace mockUsers and mockClaims

```javascript
// Users
api("/admin/users").then(r => r.json()).then(d => setUsers(d.users));

// All claims
api("/admin/claims").then(r => r.json()).then(d => setClaims(d.claims));

// Analytics
api("/admin/analytics/claims-over-time").then(r => r.json()).then(d => setChartData(d.data));

// Integrations
api("/admin/integrations").then(r => r.json()).then(d => setIntegrations(d.integrations));

// Settings
api("/admin/settings").then(r => r.json()).then(d => setSettings(d));
```

---

## 6. File upload (supplemental evidence)

```javascript
const uploadEvidence = async (file, bucket, label) => {
  const form = new FormData();
  form.append("file", file);
  form.append("bucket", bucket);
  form.append("label", label);
  await fetch(`${import.meta.env.VITE_API_BASE}/claims/${claimId}/evidence/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenRef.current}` },
    body: form,
    // No Content-Type header — browser sets multipart boundary automatically
  });
};
```

---

## 7. Summary of mock data to remove

| File | Mock data to replace | Real source |
|---|---|---|
| `src/context/AuthContext.jsx` | Hardcoded credential check | `POST /auth/login` |
| `src/data/mockData.js` — `mockClaims` | Used in Dashboard, AllClaims | `GET /claims`, `GET /admin/claims` |
| `src/data/mockData.js` — `mockUsers` | Used in UserManagement | `GET /admin/users` |
| `src/data/mockData.js` — `mockEvidence` | Used in NewClaim wizard | `POST /evidence/pull` |
| `src/data/mockData.js` — `mockAnalytics` | Used in Analytics, AdminDashboard | `GET /admin/analytics/*` |
| `WIN_CONFIG` in NewClaim.jsx | Hardcoded score config | `POST /packages/score` |
