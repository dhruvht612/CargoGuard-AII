# CargoGuard AI — Feature Ticket List

> Format: [EPIC] TICKET-ID: Title | Priority | Estimate | Description

---

## EPIC 1: Claim Intake

**CARGO-001** | Priority: P0 | Estimate: 3 days
**Claim notice text intake**
Build the claim intake form that accepts pasted text. Include field validation for claim amount, order reference, and deadline. Store in session memory only.

**CARGO-002** | Priority: P0 | Estimate: 2 days
**Claim notice PDF/image upload**
Allow users to upload a PDF or image of the claim notice. Extract text using pdfplumber (PDF) or Tesseract OCR (image). Pass extracted text to classifier.

**CARGO-003** | Priority: P0 | Estimate: 2 days
**Claim type classifier**
LLM-based classifier that reads claim notice text and maps it to one of four types: Non-Delivery, Damaged, Not As Described, Counterfeit/Fraud. Output includes detected type + confidence level. If confidence < 70%, prompt user to select manually.

**CARGO-004** | Priority: P1 | Estimate: 1 day
**Manual claim type override**
Allow user to manually select or override the detected claim type via a 4-option button group shown below the auto-detected badge.

**CARGO-005** | Priority: P1 | Estimate: 1 day
**Deadline capture and countdown**
Capture response deadline at intake. Display as sticky banner on all subsequent screens showing days/hours remaining. Show red warning if < 24 hours remaining.

---

## EPIC 2: Evidence Collection

**CARGO-010** | Priority: P0 | Estimate: 3 days
**Zenduit API adapter (mock)**
Build the Zenduit integration adapter. For MVP, use mock data. Adapter takes order ID + date range and returns: GPS delivery coordinates, delivery timestamp, dashcam clip URL, shock/tilt sensor readings. Normalize to standard evidence object.

**CARGO-011** | Priority: P0 | Estimate: 3 days
**xentag API adapter (mock)**
Build the xentag integration adapter. For MVP, use mock data. Adapter takes tag ID and returns: scan history array, authentication certificate status, tamper detection boolean. Normalize to standard evidence object.

**CARGO-012** | Priority: P0 | Estimate: 2 days
**Evidence bucket organizer**
Organize pulled evidence into three display buckets: Delivery Proof, Condition Proof, Identity Proof. Show each item with status icon (✅ present, ⚠️ partial, ❌ missing). Rank missing items by impact on win likelihood.

**CARGO-013** | Priority: P1 | Estimate: 2 days
**Supplemental file upload**
Allow users to upload additional evidence files during the Evidence Review step. File types: PDF, JPG, PNG. Max 20MB per file.

**CARGO-014** | Priority: P1 | Estimate: 1 day
**Evidence completeness score**
Calculate and display an evidence completeness percentage based on evidence present vs expected for the detected claim type. Display as progress bar.

**CARGO-015** | Priority: P2 | Estimate: 2 days
**Live Zenduit API integration**
Replace mock adapter with live Zenduit API calls. Handle rate limits, timeouts, and partial data. Requires Zenduit API credentials.

**CARGO-016** | Priority: P2 | Estimate: 2 days
**Live xentag API integration**
Replace mock adapter with live xentag API calls. Handle invalid tag IDs, revoked certificates, API errors. Requires xentag API credentials.

---

## EPIC 3: Win Likelihood Estimation

**CARGO-020** | Priority: P0 | Estimate: 2 days
**Rule-based win scoring engine**
Implement win likelihood scoring. Inputs: claim type + evidence object. Outputs: band (Weak/Moderate/Strong), factor scores. Rule-based for auditability.

**CARGO-021** | Priority: P0 | Estimate: 1 day
**Win estimate UI card**
Display win estimate as visual card: color-coded progress bar, band label, top 2–3 factors for/against, highest-impact missing item, disclaimer.

**CARGO-022** | Priority: P1 | Estimate: 1 day
**Win estimate disclaimer**
"This is an estimate only. The insurer or arbitrator makes the final decision." appears on win estimate card AND in generated package. Non-removable.

**CARGO-023** | Priority: P2 | Estimate: 3 days
**Win estimate calibration (Admin)**
After first 50 real claims, analyze outcomes vs estimates. Admin can adjust scoring weights via Settings sliders. Build calibration dashboard in Admin > Settings.

---

## EPIC 4: Package Generation

**CARGO-030** | Priority: P0 | Estimate: 3 days
**Cover narrative generator**
LLM-generated cover narrative grounded strictly in evidence object. Template-guided. Output: 2–3 paragraph factual summary.

**CARGO-031** | Priority: P0 | Estimate: 2 days
**Evidence index builder**
Numbered evidence index listing all attached items with source, type, and relevance note.

**CARGO-032** | Priority: P0 | Estimate: 1 day
**Human approval gate**
Full package shown before finalization. User must click "Approve & Generate Package" explicitly. Audit log entry created on approval.

**CARGO-033** | Priority: P0 | Estimate: 2 days
**PDF package export**
Professional PDF: cover narrative + evidence index + disclaimer + branding. WeasyPrint or Puppeteer.

**CARGO-034** | Priority: P1 | Estimate: 1 day
**Copy-to-clipboard for cover narrative**
One-click copy of cover narrative text for pasting into insurer portal.

**CARGO-035** | Priority: P1 | Estimate: 1 day
**Handoff instructions screen**
Post-package screen with submission instructions, deadline reminder, insurer contact info field.

---

## EPIC 5: Operator Portal

**CARGO-040** | Priority: P1 | Estimate: 3 days
**Operator authentication (React)**
Email + password login with JWT. Token stored in React Context (memory), not localStorage. HttpOnly cookie for refresh. Password reset via email.

**CARGO-041** | Priority: P1 | Estimate: 2 days
**Operator dashboard**
Claims table with columns: Claim ID, Type, Amount, Deadline, Status, Win Estimate. Sortable, filterable. Quick actions: View / Continue / Download.

**CARGO-042** | Priority: P1 | Estimate: 2 days
**React Router setup**
Configure React Router v6 with RoleGuard wrapper. Operator routes: /dashboard, /claims/new, /claims/:id, /claims/:id/package. Redirect unauthenticated users to /login.

**CARGO-043** | Priority: P2 | Estimate: 2 days
**Team/multi-user support (Operator)**
Company account can have multiple operator/manager users. Manager sees all team claims. Ties into Admin user management.

---

## EPIC 6: Admin Portal

**CARGO-050** | Priority: P1 | Estimate: 2 days
**Admin login page**
Separate `/admin/login` route with purple accent styling. Email + password + MFA (TOTP) flow. "Back to operator login" link. Admin JWT has role=admin claim.

**CARGO-051** | Priority: P1 | Estimate: 2 days
**Admin route guard**
`RoleGuard` component checks JWT role claim. If role !== admin, redirect to `/admin/login`. All `/admin/*` routes protected. Admin sidebar hidden from operators.

**CARGO-052** | Priority: P1 | Estimate: 3 days
**Admin dashboard**
4 KPI stat cards (Total Claims, Active Claims, Win Rate 30d, Total Claims Value). Claims by Type bar chart (Recharts). Win Rate Over Time line chart (Recharts). Recent activity table (last 10 claims across all users).

**CARGO-053** | Priority: P1 | Estimate: 3 days
**User management table**
Table: User ID, Name, Email, Company, Role, Claims Count, Joined, Status, Actions. Actions: View, Edit Role, Suspend/Reactivate, Reset Password, Delete (with confirm modal). Top bar: search, role filter, status filter, Invite User button.

**CARGO-054** | Priority: P1 | Estimate: 1 day
**Invite user flow**
Admin clicks Invite User → enters email + role → system sends invite email with temp password link. New user forced to set password on first login.

**CARGO-055** | Priority: P1 | Estimate: 3 days
**All claims table (Admin)**
Table: Claim ID, Operator, Company, Type, Amount, Deadline, Win Band, Status, Created, Actions. Filters: claim type, win band, status, date range, company search. Export All CSV button. Overdue count alert banner.

**CARGO-056** | Priority: P1 | Estimate: 2 days
**Claim inspector (Admin)**
Read-only deep view of any claim. Shows: metadata, full evidence object (all three buckets), win estimate scoring breakdown, package preview, per-claim audit log, admin notes field, Flag/Escalate/Archive actions.

**CARGO-057** | Priority: P1 | Estimate: 2 days
**Integration status page**
Cards for Zenduit, xentag, Anthropic LLM, Carrier API (roadmap). Each card shows: status (🟢/🟡/🔴), last sync time, latency, Test Connection button, Rotate API Key button. Admin can toggle mock ↔ live per integration.

**CARGO-058** | Priority: P2 | Estimate: 3 days
**Analytics page**
6 Recharts charts: Claims Volume Over Time (line), Claims by Type (bar), Win Rate by Claim Type (grouped bar), Evidence Completeness Distribution (histogram), Avg Response Time (line), Top Companies by Volume (horizontal bar). Date range filter, export per chart.

**CARGO-059** | Priority: P2 | Estimate: 2 days
**Admin settings page**
Sections: General (platform name, support email, logo), Win Estimate Thresholds (sliders per claim type), Session Policy (TTL config), Rate Limits config, Notification Emails, Platform-wide Audit Log (search/filter/export CSV).

**CARGO-060** | Priority: P2 | Estimate: 1 day
**Admin sidebar**
Left nav with icons + labels. Items: Dashboard, Users, Claims, Integrations, Analytics, Settings. Collapsible to icon-only on tablet. Active route highlighted. Role badge ("Admin") shown below user name.

**CARGO-061** | Priority: P2 | Estimate: 2 days
**Platform-wide audit log**
Every significant action logged: claim created, evidence pulled, package approved, user suspended, API key rotated, settings changed. Table in Admin > Settings with columns: Timestamp, Actor, Action, Target, IP. Filterable, exportable.

**CARGO-062** | Priority: P2 | Estimate: 1 day
**Bulk user actions**
Admin can select multiple users in the user table and apply bulk actions: Suspend, Export CSV, Delete (with confirmation).

---

## EPIC 7: Infrastructure & DevOps

**CARGO-070** | Priority: P0 | Estimate: 1 day
**Vite + React 18 project setup**
Initialize project with Vite, React 18, React Router v6, Tailwind CSS, Recharts. Configure ESLint, Prettier. Set up folder structure per Frontend Spec Section 4.

**CARGO-071** | Priority: P0 | Estimate: 1 day
**Environment variable management**
All API keys in environment variables. GitHub Secrets for CI/CD. Vite env vars prefixed VITE_ for frontend. No keys in committed code.

**CARGO-072** | Priority: P0 | Estimate: 2 days
**CI/CD pipeline**
GitHub Actions: lint + test on every PR. Deploy frontend (Vite build) to Vercel, backend to Railway on merge to main. Block merge on failure.

**CARGO-073** | Priority: P1 | Estimate: 1 day
**Rate limiting**
API gateway rate limiting: 100 req/hour per user, 10 package generations/hour. 429 with retry-after header.

**CARGO-074** | Priority: P1 | Estimate: 1 day
**Session cleanup job**
Background job clears expired Redis sessions every 15 minutes.

**CARGO-075** | Priority: P1 | Estimate: 2 days
**Error monitoring**
Sentry for frontend and backend. Alert on >5 errors/minute. PII scrubbed from error payloads.

---

## Priority Summary

| Priority | Key Tickets | Target |
|---|---|---|
| P0 (MVP must-have) | CARGO-001–003, 010–012, 020–021, 030–033, 070–072 | Week 1–2 |
| P1 (v1 complete) | CARGO-004–005, 013–014, 022, 034–035, 040–042, 050–057, 073–075 | Week 3–4 |
| P2 (Post-launch) | CARGO-015–016, 023, 043, 058–062 | Month 2 |
