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
Allow user to manually select or override the detected claim type via a 4-option radio/button group shown below the auto-detected badge.

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
Allow users to upload additional evidence files (pre-load photos, condition photos, signed delivery receipts) during the Evidence Review step. Attach to evidence object. File types: PDF, JPG, PNG. Max 20MB per file.

**CARGO-014** | Priority: P1 | Estimate: 1 day  
**Evidence completeness score**  
Calculate and display an evidence completeness percentage based on evidence present vs expected for the detected claim type. Display as progress bar. Used to guide user toward uploading missing items.

**CARGO-015** | Priority: P2 | Estimate: 2 days  
**Live Zenduit API integration**  
Replace mock adapter with live Zenduit API calls using OAuth2 or API key auth. Handle rate limits, timeouts, and partial data gracefully. Requires Zenduit API credentials.

**CARGO-016** | Priority: P2 | Estimate: 2 days  
**Live xentag API integration**  
Replace mock adapter with live xentag API calls. Handle invalid tag IDs, revoked certificates, and API errors gracefully. Requires xentag API credentials.

---

## EPIC 3: Win Likelihood Estimation

**CARGO-020** | Priority: P0 | Estimate: 2 days  
**Rule-based win scoring engine**  
Implement the win likelihood scoring model from the PRD. Inputs: claim type + evidence object. Outputs: band (Weak/Moderate/Strong), factor scores. Rule-based (not pure LLM) for auditability and consistency.

**CARGO-021** | Priority: P0 | Estimate: 1 day  
**Win estimate UI card**  
Display the win estimate as a visual card: color-coded progress bar, band label, top 2–3 factors for and against, highest-impact missing item, disclaimer text.

**CARGO-022** | Priority: P1 | Estimate: 1 day  
**Win estimate disclaimer**  
Ensure "This is an estimate only. The insurer or arbitrator makes the final decision." appears on the win estimate card AND in the generated package. Non-removable.

**CARGO-023** | Priority: P2 | Estimate: 3 days  
**Win estimate calibration**  
After first 50 real claims, analyze outcomes vs estimates. Calibrate scoring weights to improve accuracy. Build admin-only calibration dashboard.

---

## EPIC 4: Package Generation

**CARGO-030** | Priority: P0 | Estimate: 3 days  
**Cover narrative generator**  
LLM-generated cover narrative for the claim response. Grounded strictly in the evidence object — no hallucinated facts. Template-guided generation. Output: 2–3 paragraph factual summary.

**CARGO-031** | Priority: P0 | Estimate: 2 days  
**Evidence index builder**  
Generate a numbered evidence index listing all attached items with source, type, and relevance. Format: "1. GPS delivery log (Zenduit) — confirms delivery at [address] on [date]."

**CARGO-032** | Priority: P0 | Estimate: 1 day  
**Human approval gate**  
Full package must be shown to user before finalization. User must click "Approve & Generate Package" explicitly. No package generated without this step. Audit log entry created on approval.

**CARGO-033** | Priority: P0 | Estimate: 2 days  
**PDF package export**  
Generate a professional PDF containing cover narrative + evidence index + disclaimer. Use WeasyPrint or Puppeteer. Include CargoGuard branding, claim ID, and timestamp. Download triggered on approval.

**CARGO-034** | Priority: P1 | Estimate: 1 day  
**Copy-to-clipboard for cover narrative**  
Allow user to copy the cover narrative text to clipboard with one click for pasting into insurer portal or email.

**CARGO-035** | Priority: P1 | Estimate: 1 day  
**Handoff instructions screen**  
After package generation, show clear instructions: "Submit this package to [insurer name] before [deadline]. CargoGuard does not submit on your behalf." Include insurer contact info field.

---

## EPIC 5: User Accounts & Dashboard

**CARGO-040** | Priority: P1 | Estimate: 3 days  
**User authentication**  
Email + password login with JWT. HttpOnly cookie for refresh token. Password reset via email. Bcrypt hashing.

**CARGO-041** | Priority: P1 | Estimate: 2 days  
**Claims dashboard**  
Table view of all claims for the logged-in user/team. Columns: Claim ID, Type, Amount, Deadline, Status, Win Estimate. Sortable and filterable. Quick action: View / Continue / Download.

**CARGO-042** | Priority: P2 | Estimate: 2 days  
**Team/multi-user support**  
Allow a company account to have multiple users (operators, managers). Manager can see all team claims. Role-based access control per Section 3.3 of Security doc.

**CARGO-043** | Priority: P2 | Estimate: 1 day  
**Claim history and audit log**  
Opt-in claim history for users who want to save past packages. Encrypted at rest. Audit log showing who approved each package and when.

---

## EPIC 6: Prevention & Insights

**CARGO-050** | Priority: P2 | Estimate: 2 days  
**Per-claim-type prevention checklist**  
After package generation, show a prevention checklist tailored to the claim type (e.g., "Enable signature confirmation for orders over $1,000"). Powered by static templates per claim type.

**CARGO-051** | Priority: P3 | Estimate: 3 days  
**Claims analytics dashboard**  
For managers: charts showing claims by type, win rate over time, average evidence completeness, most common missing evidence items. Helps operators improve their documentation practices.

---

## EPIC 7: Infrastructure & DevOps

**CARGO-060** | Priority: P0 | Estimate: 1 day  
**Environment variable management**  
All API keys (Zenduit, xentag, Anthropic, database) stored as environment variables. GitHub Secrets for CI/CD. No keys in code.

**CARGO-061** | Priority: P0 | Estimate: 2 days  
**CI/CD pipeline**  
GitHub Actions: run tests on every PR, deploy frontend to Vercel and backend to Railway on merge to main. Block merge if tests fail.

**CARGO-062** | Priority: P1 | Estimate: 1 day  
**Rate limiting**  
Implement rate limiting at API gateway: 100 requests/hour per user, 10 package generations/hour. Return 429 with retry-after header.

**CARGO-063** | Priority: P1 | Estimate: 1 day  
**Session cleanup job**  
Background job that clears expired Redis sessions every 15 minutes. Ensures no claim data persists beyond session TTL.

**CARGO-064** | Priority: P1 | Estimate: 2 days  
**Error monitoring**  
Integrate Sentry for frontend and backend error tracking. Alert on >5 errors/minute. Scrub PII from error payloads before logging.

---

## Priority Summary

| Priority | Tickets | Target |
|---|---|---|
| P0 (Must have MVP) | CARGO-001 to 003, 010 to 012, 020 to 021, 030 to 033, 060 to 061 | Week 1–2 |
| P1 (Should have v1) | CARGO-004 to 005, 013 to 014, 022, 034 to 035, 040 to 041, 062 to 064 | Week 3–4 |
| P2 (Nice to have) | CARGO-015 to 016, 023, 042 to 043, 050 to 051 | Post-launch |
| P3 (Future) | CARGO-051 | Roadmap |
