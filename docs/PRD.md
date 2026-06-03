# CargoGuard AI — Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** CargoGuard AI  
**One-liner:** An AI agent that automatically assembles verified freight claim defense packages using Zenduit telematics and xentag authentication data — so fleet operators win disputes faster and with less manual effort.

**Version:** v1.0  
**Last Updated:** June 2026  
**Status:** MVP Planning

---

## 2. Problem Statement

Freight and cargo claims are one of the most painful, time-consuming, and expensive problems in logistics:

- The freight claims industry processes **$1B+ in claims annually** in North America alone
- Fleet operators spend **8–20 hours per claim** manually gathering evidence from disparate systems
- Without structured, verified proof, operators lose winnable disputes
- Insurers and buyers take advantage of disorganized responses
- Small and mid-size fleet operators have no dedicated claims staff

**Why now:** Zenduit and xentag together create a first-of-its-kind verified data layer — GPS-confirmed delivery, dashcam footage, sensor telemetry, and cryptographic product authentication — that can be assembled automatically by an AI agent.

---

## 3. Goals

### v1 Goals
- Classify incoming freight claims into one of four claim types
- Auto-pull verified evidence from Zenduit and xentag APIs
- Assemble a structured response package in the correct format
- Give an honest, reason-tuned win likelihood estimate
- Require human approval before any response is finalized
- Charge a per-claim fee via subscription or usage model

### Non-Goals (v1)
- Direct submission to insurers or courts (agent prepares, human submits)
- Legal advice or jurisdiction-specific legal conclusions
- eBay, Amazon, or consumer marketplace disputes
- Real-time carrier API integration (roadmap)

---

## 4. Target Users

| Role | Description |
|---|---|
| **Primary User** | Fleet operations manager or dispatcher at a mid-size trucking company |
| **Buyer/Decision-Maker** | VP of Operations or CFO at fleet company (50–500 trucks) |
| **First Segment** | Refrigerated freight (reefer) operators — high claim frequency, high stakes |

---

## 5. Claim Type Matrix

| Claim Type | Trigger | Key Evidence |
|---|---|---|
| **Non-Delivery** | Receiver claims goods never arrived | Zenduit GPS delivery confirmation, timestamp, route log |
| **Damaged in Transit** | Goods arrived damaged | Zenduit dashcam footage, shock/tilt sensor data, pre-load condition photos |
| **Not As Described / Wrong Item** | Goods don't match order | xentag product scan log, authentication record, chain of custody |
| **Counterfeit / Fraud** | Product authenticity disputed | xentag cryptographic certificate, full scan history, tamper detection log |

---

## 6. Agent Flow (State Machine)

```
S0  INTAKE
    → User pastes or uploads claim notice
    → Agent classifies claim type (one of four above)
    → Captures deadline, claim amount, order reference

S1  EVIDENCE PULL
    → Queries Zenduit API: GPS route, delivery timestamp, dashcam clips, sensor logs
    → Queries xentag API: scan history, auth certificate, tamper status
    → Organizes into three buckets: Delivery Proof, Condition Proof, Identity Proof

S2  EVIDENCE REVIEW
    → Shows present vs missing evidence
    → Ranks missing items by impact
    → Allows user to upload supplemental files

S3  WIN ESTIMATE
    → Outputs Weak / Moderate / Strong band
    → Lists top 2–3 factors for and against
    → States highest-impact missing item
    → Disclaimer: estimate only, insurer/court decides

S4  HUMAN APPROVAL
    → Shows full package preview
    → User must explicitly approve before finalization
    → Options: Approve / Edit / Add Evidence / Cancel

S5  PACKAGE GENERATION
    → Produces structured claim response document
    → Includes cover narrative + evidence index + attached files
    → Paste-ready or PDF export

S6  HANDOFF
    → Clear instructions: submit this to [insurer/buyer] before [deadline]
    → Agent does not submit — human submits
    → Optional: prevention checklist for future claims
```

---

## 7. Functional Requirements

| ID | Requirement |
|---|---|
| FR-1 | Classify claim into one of four types; branch all logic on classification |
| FR-2 | Accept claim notice as pasted text or uploaded PDF/image |
| FR-3 | Pull evidence automatically from Zenduit and xentag APIs |
| FR-4 | Organize evidence into Delivery Proof, Condition Proof, Identity Proof buckets |
| FR-5 | Capture response deadline and surface it at every stage |
| FR-6 | Output win likelihood band (Weak/Moderate/Strong) with reasoning and disclaimer |
| FR-7 | Require explicit human approval before package is finalized |
| FR-8 | Produce paste-ready or PDF response package |
| FR-9 | State clearly that the human submits and the insurer/court decides |
| FR-10 | Write no user claim data to persistent storage without explicit opt-in |
| FR-11 | Label all output "not legal advice" |
| FR-12 | Support supplemental file uploads (images, PDFs) at evidence review stage |

---

## 8. Win Likelihood Model

**Base by claim type:**
- Non-Delivery: Highest ceiling (GPS confirmation is strong)
- Not As Described: Medium ceiling
- Damaged: Medium ceiling
- Counterfeit/Fraud: Variable (xentag cert is strong; depends on counterparty)

**Positive adjustments:**
- GPS delivery confirmed to correct address: +large
- Dashcam footage shows intact goods at load: +large
- xentag auth certificate valid at delivery scan: +large
- Shock/tilt sensor data within normal range: +medium
- On-time delivery, clean message history: +small

**Output format:**
- Band: Weak / Moderate / Strong
- Top 2–3 factors for and against
- Highest-impact missing item
- Disclaimer: "This is an estimate based on evidence provided. The final decision rests with the insurer, arbitrator, or court."

---

## 9. Marketplace Model

| Layer | Description |
|---|---|
| **Sellers** | Fleet operators (submit claims, pay per-claim fee) |
| **Buyers** | Insurers, brokers (access verified telematics data for faster settlement) |
| **Third Parties** | Freight attorneys, claims adjusters (offered as add-on services) |
| **Revenue** | Subscription (base platform) + per-claim fee + data access fee for insurers |

---

## 10. Success Metrics

- Time to assemble claim response: target < 15 minutes (vs 8–20 hours today)
- Win rate improvement: target 20%+ over unassisted claims
- Claims processed per month per customer
- Insurer adoption of verified data feed
- NPS from fleet operators

---

## 11. MVP Scope (Weeks 1–4)

**Build:**
- Claim intake UI (paste text + file upload)
- Claim classifier (4 types)
- Zenduit API mock data pull (GPS, dashcam, sensors)
- xentag API mock data pull (scan log, auth cert)
- Evidence bucket organizer
- Win estimate engine
- Package generator (structured doc output)
- Human approval gate

**Do NOT build yet:**
- Live insurer submission
- Real-time carrier API
- Billing/payment system
- Multi-user team accounts
- Mobile app

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| Zenduit/xentag API access limited | Use mock data for MVP; negotiate data partnership |
| AI hallucination in claim narrative | Template-based generation; human review gate |
| Legal liability for "advice" | Explicit "not legal advice" label everywhere |
| Low fleet operator adoption | Start with 3 pilot customers; offer first 10 claims free |
| Insurer reluctance to accept AI-assembled docs | Lead with human-reviewed output framing |
