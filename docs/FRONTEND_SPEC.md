# CargoGuard AI — Frontend Specification Document

## 1. Overview

The CargoGuard AI frontend is a web application built in Next.js 14 (React). It guides fleet operators through a multi-step claim response workflow. The UI must be fast, clear, and confidence-inspiring — operators are stressed when filing claims and need a tool that feels professional and trustworthy.

---

## 2. Design Principles

- **Clarity over cleverness** — every screen has one primary action
- **Progress visibility** — always show where the user is in the flow
- **Trust signals everywhere** — show data sources, timestamps, confidence bands
- **No surprises** — no action taken without explicit user confirmation
- **Mobile-aware** — responsive, but desktop-first (operators work on computers)

---

## 3. Color Palette & Typography

| Token | Value | Usage |
|---|---|---|
| Primary | #1A3C5E (dark navy) | Buttons, headers, key actions |
| Accent | #2ECC71 (green) | Success states, confirmed evidence |
| Warning | #F39C12 (amber) | Missing evidence, deadlines |
| Danger | #E74C3C (red) | Critical missing items, errors |
| Background | #F8F9FA | Page background |
| Surface | #FFFFFF | Cards, panels |
| Text primary | #1A1A2E | Body text |
| Text secondary | #6B7280 | Labels, helper text |

**Font:** Inter (Google Fonts) — clean, legible, professional

---

## 4. Page Structure

### 4.1 Landing / Login Page
- Hero: "Fight freight claims with verified proof — not paperwork"
- Sub: "CargoGuard AI pulls GPS, dashcam, and authentication data automatically"
- CTA: "Start a Claim" (primary button)
- Trust bar: "Powered by Zenduit telematics + xentag authentication"
- Login form below fold

### 4.2 Dashboard (Post-Login)
- Header: Logo + nav (Dashboard, New Claim, History, Settings)
- Stats bar: Active Claims | Won This Month | Avg Response Time
- Claims table: columns = Claim ID, Type, Amount, Deadline, Status, Win Estimate
- CTA: "+ New Claim" button (top right)

### 4.3 New Claim — Step-by-Step Wizard

**Step indicator at top:** Intake → Evidence → Estimate → Review → Package

#### Step 1: Intake
```
┌─────────────────────────────────────────────────────┐
│  Paste your claim notice below                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  [Large textarea — claim notice text]       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Or upload the claim document    [Upload PDF]       │
│                                                     │
│  Order Reference: [____________]                    │
│  Claim Amount:    [$ _________ ]                    │
│  Response Deadline: [Date picker]                   │
│                                                     │
│  [Continue →]                                       │
└─────────────────────────────────────────────────────┘
```

**Below the form:**  
Detected claim type badge appears after text analysis:  
`🔍 Detected: Non-Delivery Claim` (amber badge while analyzing, green when confirmed)

#### Step 2: Evidence Review
```
┌─────────────────────────────────────────────────────┐
│  Evidence collected for Claim #1042                 │
│  Claim Type: Non-Delivery   Deadline: Jun 8, 2026  │
│                                                     │
│  ✅ DELIVERY PROOF                                  │
│     GPS confirmed delivery: Jun 1, 2026 14:32       │
│     Address match: ✅ Matches receipt address       │
│     Dashcam clip: Available (2.3MB)                 │
│                                                     │
│  ⚠️  CONDITION PROOF                               │
│     Shock sensor data: ✅ 0 events                 │
│     Pre-load photo: ❌ Not found — upload below     │
│     [Upload pre-load photo]                         │
│                                                     │
│  ✅ IDENTITY PROOF                                  │
│     xentag auth cert: Valid                         │
│     Scan history: 4 scans logged                    │
│     Tamper detected: No                             │
│                                                     │
│  [← Back]   [Continue with current evidence →]     │
└─────────────────────────────────────────────────────┘
```

#### Step 3: Win Estimate
```
┌─────────────────────────────────────────────────────┐
│  Win Likelihood Estimate                            │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  ████████████░░░░  STRONG                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ✅ For you                                         │
│     • GPS delivery confirmed to receipt address     │
│     • xentag authentication valid at delivery       │
│     • Zero shock events during transit              │
│                                                     │
│  ❌ Against you                                     │
│     • No pre-load condition photo on file           │
│     • Signature confirmation not available          │
│                                                     │
│  💡 Biggest improvement: Upload pre-load photo      │
│                                                     │
│  ⚠️  This is an estimate only. The insurer         │
│  or arbitrator makes the final decision.            │
│                                                     │
│  [← Improve Evidence]   [Generate Package →]       │
└─────────────────────────────────────────────────────┘
```

#### Step 4: Review & Approve
```
┌─────────────────────────────────────────────────────┐
│  Review Your Claim Package                          │
│                                                     │
│  [Full package preview — scrollable]                │
│                                                     │
│  Cover Narrative:                                   │
│  "On June 1, 2026 at 14:32, Vehicle #447            │
│  delivered shipment order #10421 to the             │
│  address specified on the purchase order.           │
│  GPS coordinates confirm delivery at..."            │
│                                                     │
│  Evidence Index:                                    │
│  1. GPS delivery log (Zenduit) — attached           │
│  2. Dashcam clip — attached                         │
│  3. xentag auth certificate — attached              │
│                                                     │
│  ⚠️  NOT LEGAL ADVICE                              │
│                                                     │
│  [← Edit]   [✅ Approve & Generate Package]        │
└─────────────────────────────────────────────────────┘
```

#### Step 5: Package Ready
```
┌─────────────────────────────────────────────────────┐
│  ✅ Your claim package is ready                     │
│                                                     │
│  [⬇ Download PDF Package]                          │
│  [📋 Copy Cover Narrative]                         │
│                                                     │
│  Next step: Submit this package to your insurer     │
│  before June 8, 2026. CargoGuard does not           │
│  submit on your behalf.                             │
│                                                     │
│  💡 Prevention tips for this claim type:           │
│     • Always capture pre-load dashcam footage      │
│     • Enable signature confirmation for orders      │
│       over $1,000                                   │
│                                                     │
│  [← Dashboard]   [Start New Claim]                 │
└─────────────────────────────────────────────────────┘
```

---

## 5. Component Library

| Component | Description |
|---|---|
| `ClaimWizard` | Top-level multi-step wrapper with progress bar |
| `ClaimIntakeForm` | Text area + file upload + metadata fields |
| `ClaimTypeBadge` | Shows detected claim type with confidence |
| `EvidenceBucket` | Collapsible section for Delivery / Condition / Identity proof |
| `EvidenceItem` | Individual evidence line with status icon and value |
| `WinEstimateCard` | Progress bar + band label + factor lists + disclaimer |
| `PackagePreview` | Scrollable package preview with section headers |
| `DeadlineBanner` | Sticky banner showing deadline countdown |
| `ActionBar` | Bottom bar with Back / Continue buttons |
| `FileUploadZone` | Drag-and-drop zone with validation feedback |
| `ClaimsDashboardTable` | Sortable, filterable claims table |

---

## 6. Responsive Behavior

- Desktop (≥1024px): Two-column layout (form left, evidence summary right)
- Tablet (768–1023px): Single column, full width
- Mobile (<768px): Single column, simplified evidence view, download-focused

---

## 7. Error States

| Scenario | UI Response |
|---|---|
| Claim type undetectable | "We couldn't classify this claim. Please select manually." + 4 type buttons |
| Zenduit API unavailable | Warning banner: "Live telematics unavailable — upload evidence manually" |
| xentag API unavailable | Warning banner: "Authentication data unavailable — upload certificate manually" |
| LLM timeout | "Analysis is taking longer than expected. Retrying…" with spinner |
| File too large | Inline error: "File exceeds 20MB limit" |
| Session expired | Modal: "Your session has expired for security. Your data has been cleared." |

---

## 8. Accessibility

- WCAG 2.1 AA compliance target
- All form fields have associated labels
- Error messages announced via aria-live
- Focus management between wizard steps
- Keyboard navigable throughout
- Color contrast ratio ≥ 4.5:1 for all text
