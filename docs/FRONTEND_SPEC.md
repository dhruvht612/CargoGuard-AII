# CargoGuard AI — Frontend Specification Document

## 1. Overview

The CargoGuard AI frontend is a **React 18 (Vite)** single-page application. It has two distinct portals:

- **Operator Portal** — fleet operators file claims, review evidence, and download packages
- **Admin Portal** — internal team manages users, monitors all claims, configures integrations, and views analytics

The UI must be fast, clear, and confidence-inspiring. Operators are stressed when filing claims and need a tool that feels professional and trustworthy. Admins need power and visibility.

**Stack:** React 18 + Vite + React Router v6 + Tailwind CSS + Recharts

---

## 2. Design Principles

- **Clarity over cleverness** — every screen has one primary action
- **Progress visibility** — always show where the user is in the flow
- **Trust signals everywhere** — show data sources, timestamps, confidence bands
- **No surprises** — no action taken without explicit user confirmation
- **Role-aware UI** — admin and operator views are completely separated by route guard

---

## 3. Color Palette & Typography

| Token | Value | Usage |
|---|---|---|
| Primary | #1A3C5E (dark navy) | Buttons, headers, key actions |
| Accent | #2ECC71 (green) | Success states, confirmed evidence |
| Warning | #F39C12 (amber) | Missing evidence, deadlines |
| Danger | #E74C3C (red) | Critical missing items, errors |
| Admin accent | #7C3AED (purple) | Admin-only UI elements |
| Background | #F8F9FA | Page background |
| Surface | #FFFFFF | Cards, panels |
| Text primary | #1A1A2E | Body text |
| Text secondary | #6B7280 | Labels, helper text |

**Font:** Inter (Google Fonts)

---

## 4. Application Structure

```
src/
├── main.jsx                  # App entry point
├── App.jsx                   # Router root
├── routes/
│   ├── OperatorRoutes.jsx    # Protected: role=operator
│   └── AdminRoutes.jsx       # Protected: role=admin
├── pages/
│   ├── operator/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NewClaim.jsx
│   │   ├── ClaimDetail.jsx
│   │   └── PackageDownload.jsx
│   └── admin/
│       ├── AdminLogin.jsx
│       ├── AdminDashboard.jsx
│       ├── UserManagement.jsx
│       ├── AllClaims.jsx
│       ├── ClaimInspect.jsx
│       ├── Integrations.jsx
│       ├── Analytics.jsx
│       └── Settings.jsx
├── components/
│   ├── shared/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── RoleGuard.jsx
│   │   ├── DeadlineBanner.jsx
│   │   └── NotFound.jsx
│   ├── operator/
│   │   ├── ClaimWizard.jsx
│   │   ├── ClaimIntakeForm.jsx
│   │   ├── ClaimTypeBadge.jsx
│   │   ├── EvidenceBucket.jsx
│   │   ├── EvidenceItem.jsx
│   │   ├── WinEstimateCard.jsx
│   │   ├── PackagePreview.jsx
│   │   ├── FileUploadZone.jsx
│   │   └── ClaimsDashboardTable.jsx
│   └── admin/
│       ├── AdminSidebar.jsx
│       ├── StatCard.jsx
│       ├── UserTable.jsx
│       ├── ClaimsTable.jsx
│       ├── IntegrationStatusCard.jsx
│       ├── WinRateChart.jsx
│       ├── ClaimsByTypeChart.jsx
│       └── AuditLogTable.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useClaim.js
│   └── useAdmin.js
├── context/
│   └── AuthContext.jsx
└── api/
    ├── claimsApi.js
    └── adminApi.js
```

---

## 5. Routing

```jsx
// App.jsx
<BrowserRouter>
  <Routes>
    {/* Public */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Operator Portal — requires role=operator */}
    <Route element={<RoleGuard role="operator" />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/claims/new" element={<NewClaim />} />
      <Route path="/claims/:id" element={<ClaimDetail />} />
      <Route path="/claims/:id/package" element={<PackageDownload />} />
    </Route>

    {/* Admin Portal — requires role=admin */}
    <Route element={<RoleGuard role="admin" />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/claims" element={<AllClaims />} />
      <Route path="/admin/claims/:id" element={<ClaimInspect />} />
      <Route path="/admin/integrations" element={<Integrations />} />
      <Route path="/admin/analytics" element={<Analytics />} />
      <Route path="/admin/settings" element={<Settings />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

---

## 6. Operator Portal Screens

### 6.1 Login
- Email + password form
- "Admin? Login here" link → `/admin/login`
- JWT stored in memory (not localStorage)

### 6.2 Operator Dashboard
- Stats bar: Active Claims | Won This Month | Avg Response Time
- Claims table: Claim ID, Type, Amount, Deadline, Status, Win Estimate
- `+ New Claim` button (top right, primary)

### 6.3 New Claim — 5-Step Wizard

**Progress bar at top:** Intake → Evidence → Estimate → Review → Package

#### Step 1: Intake
```
┌─────────────────────────────────────────────────────┐
│  Paste your claim notice below                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  [Large textarea]                           │   │
│  └─────────────────────────────────────────────┘   │
│  Or upload:  [Upload PDF / Image]                   │
│                                                     │
│  Order Reference: [____________]                    │
│  Claim Amount:    [$ _________]                     │
│  Response Deadline: [Date picker]                   │
│                                                     │
│  Detected type: 🔍 Analyzing...                     │
│  → ✅ Non-Delivery Claim (after analysis)           │
│                                                     │
│  [Continue →]                                       │
└─────────────────────────────────────────────────────┘
```

#### Step 2: Evidence Review
- Three collapsible buckets: Delivery Proof / Condition Proof / Identity Proof
- Each item: status icon + source label + value or "Not found"
- Upload zone for supplemental files
- Evidence completeness progress bar

#### Step 3: Win Estimate
- Color-coded band bar (red=Weak, amber=Moderate, green=Strong)
- Factors for / against lists
- Highest-impact missing item callout
- Non-removable disclaimer

#### Step 4: Review & Approve
- Full scrollable package preview
- "Approve & Generate Package" — explicit click required
- Back / Edit options

#### Step 5: Package Ready
- Download PDF button
- Copy cover narrative button
- Handoff instructions
- Prevention tips

---

## 7. Admin Portal Screens

### 7.1 Admin Login (`/admin/login`)
- Separate login page with purple Admin accent color
- MFA (TOTP) prompt after password
- "Back to operator login" link

### 7.2 Admin Dashboard (`/admin`)

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN  CargoGuard AI                    👤 Admin  [Logout]     │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Dashboard│  📊 Overview                                        │
│ Users    │                                                      │
│ Claims   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ Integr.  │  │ 142      │ │ 38       │ │ 67%      │ │ $48K   │ │
│ Analytics│  │ Total    │ │ Active   │ │ Win Rate │ │ Claims │ │
│ Settings │  │ Claims   │ │ Claims   │ │ (30d)    │ │ Value  │ │
│          │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│          │                                                      │
│          │  Claims by Type (bar chart)  Win Rate Over Time     │
│          │  [Recharts bar]              [Recharts line]        │
│          │                                                      │
│          │  Recent Activity                                     │
│          │  ┌─────────────────────────────────────────────┐   │
│          │  │ #1042  Non-Delivery  $4,200  Strong  Approved│   │
│          │  │ #1041  Damaged       $1,100  Moderate  Draft │   │
│          │  │ #1040  Counterfeit   $8,500  Weak   Pending  │   │
│          │  └─────────────────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────────────────┘
```

### 7.3 User Management (`/admin/users`)

**Table columns:** User ID | Name | Email | Company | Role | Claims | Joined | Status | Actions

**Actions per row:**
- View profile
- Edit role (Operator / Manager / Admin)
- Suspend / Reactivate account
- Reset password (sends email)
- Delete account (with confirmation modal)

**Top bar:**
- Search by name/email
- Filter by role / status
- `+ Invite User` button → sends email invite with temp password

**Bulk actions:**
- Select multiple users → Suspend / Export / Delete

### 7.4 All Claims (`/admin/claims`)

**Table columns:** Claim ID | Operator | Company | Type | Amount | Deadline | Win Band | Status | Created | Actions

**Filters:**
- Claim type (multi-select)
- Win band (Weak / Moderate / Strong)
- Status (Draft / Approved / Submitted / Won / Lost)
- Date range picker
- Company / operator search

**Actions per row:**
- Inspect claim (read-only view)
- Flag for review
- Export as CSV row

**Top bar:**
- `Export All (CSV)` button
- Summary stats: total value, avg win band, overdue count

### 7.5 Claim Inspector (`/admin/claims/:id`)

Read-only deep view of a single claim:
- Claim metadata (type, amount, deadline, operator)
- Full evidence object (all three buckets, values from Zenduit/xentag)
- Win estimate with scoring breakdown
- Package preview (read-only)
- Audit log for this claim (who did what, timestamps)
- Admin notes field (internal only, not shown to operator)
- Flag / Escalate / Archive buttons

### 7.6 Integrations (`/admin/integrations`)

```
┌─────────────────────────────────────────────────────┐
│  Integration Status                                 │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🟢 Zenduit API         Connected            │   │
│  │    Last sync: 2 min ago  Latency: 142ms     │   │
│  │    [Test Connection]  [Rotate Key]           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🟢 xentag API          Connected            │   │
│  │    Last sync: 5 min ago  Latency: 98ms      │   │
│  │    [Test Connection]  [Rotate Key]           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🟡 Anthropic LLM       Connected (mock)     │   │
│  │    Model: claude-sonnet-4-20250514           │   │
│  │    [Switch to Live]  [Test Prompt]           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔴 Carrier API         Not connected        │   │
│  │    [Configure]  (Roadmap)                   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 7.7 Analytics (`/admin/analytics`)

Charts (all using Recharts):
- **Claims Volume Over Time** — line chart, daily/weekly/monthly toggle
- **Claims by Type** — bar chart (Non-Delivery / Damaged / Not As Described / Counterfeit)
- **Win Rate by Claim Type** — grouped bar chart
- **Evidence Completeness Distribution** — histogram
- **Average Response Time** — line chart (target < 15 min)
- **Top Companies by Claim Volume** — horizontal bar chart

Filters: date range, company, claim type

Export: CSV / PNG per chart

### 7.8 Settings (`/admin/settings`)

Sections:
- **General** — platform name, support email, logo upload
- **Win Estimate Thresholds** — adjust scoring weights per claim type (sliders)
- **Session Policy** — configure session TTL (default 2h)
- **Rate Limits** — configure per-user limits
- **Notification Emails** — configure alert recipients for critical errors
- **Audit Log** — full platform-wide audit log with search/filter/export

---

## 8. Shared Components

| Component | Used In | Description |
|---|---|---|
| `RoleGuard` | Both | Redirects to login if role doesn't match |
| `Navbar` | Both | Top bar with logo, user name, logout |
| `Sidebar` | Admin | Left nav with icons + labels, collapsible |
| `DeadlineBanner` | Operator | Sticky countdown, red if < 24h |
| `StatCard` | Both | KPI card with label, value, trend arrow |
| `ConfirmModal` | Both | Reusable confirm dialog for destructive actions |
| `ToastNotification` | Both | Success/error/warning toasts |

---

## 9. State Management

- **Auth state:** React Context (`AuthContext`) — stores user object, role, token
- **Claim wizard state:** local `useState` in `ClaimWizard.jsx` — cleared on unmount
- **Admin data:** React Query (TanStack Query) — server state, caching, refetch
- **No Redux** — unnecessary complexity for this scope

---

## 10. Responsive Behavior

| Breakpoint | Operator Portal | Admin Portal |
|---|---|---|
| Desktop ≥1024px | Two-column wizard | Full sidebar + content |
| Tablet 768–1023px | Single column | Collapsed sidebar (icons only) |
| Mobile <768px | Single column, simplified | Admin portal: desktop-only warning |

---

## 11. Error States

| Scenario | UI Response |
|---|---|
| Claim type undetectable | Manual type selector (4 buttons) |
| Zenduit API down | Warning banner + manual upload fallback |
| xentag API down | Warning banner + manual upload fallback |
| LLM timeout | Spinner + "Retrying…" message |
| Session expired | Modal: session expired, data cleared |
| Admin unauthorized | Redirect to `/admin/login` |

---

## 12. Accessibility

- WCAG 2.1 AA compliance
- All form fields have associated labels
- Modals trap focus
- aria-live for dynamic content
- Keyboard navigable throughout
- Color contrast ≥ 4.5:1
