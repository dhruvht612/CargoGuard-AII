# CargoGuard AI

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss&logoColor=white)

An AI agent that automatically assembles verified freight claim defense packages using Zenduit telematics and xentag authentication data — so fleet operators win disputes faster and with less manual effort.

## About

Freight and cargo claims are expensive and time-consuming. Fleet operators often spend 8–20 hours per claim manually gathering evidence from disparate systems, and disorganized responses lead to lost disputes.

CargoGuard AI addresses this by classifying incoming claims, pulling verified evidence from telematics and authentication sources, estimating win likelihood, and assembling a structured response package — with explicit human approval required before anything is finalized.

> **Current status:** This repository contains an **MVP frontend prototype**. There is no backend, no live Zenduit/xentag API integration, and authentication uses client-side demo credentials only.

## Features

### Operator Portal

| Route | Page |
|-------|------|
| `/login` | Operator login |
| `/dashboard` | Claims dashboard |
| `/claims/new` | New claim intake |
| `/claims/:id` | Claim detail (routes to dashboard) |

### Admin Portal

| Route | Page |
|-------|------|
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/claims` | All claims |
| `/admin/integrations` | Integration settings |
| `/admin/analytics` | Analytics charts |
| `/admin/settings` | Settings |

### Shared

- Role-based route guards (`operator` vs `admin`)
- Mock claims, users, and analytics data for UI development

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Icons | Lucide React |
| Linting | ESLint |

> The [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md) document describes a planned full-stack setup (Next.js, FastAPI/Express, LLM layer). This repo currently implements the **React + Vite frontend only**.

## Getting Started

### Prerequisites

- Node.js 18+

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Demo Credentials

| Portal | Email | Password |
|--------|-------|----------|
| Operator | `operator@cargoguard.ai` | `operator123` |
| Admin | `admin@cargoguard.ai` | `admin123` |

## Project Structure

```
src/
├── App.jsx                  # Route definitions
├── context/
│   └── AuthContext.jsx      # Demo auth state
├── pages/
│   ├── operator/            # Operator portal pages
│   └── admin/               # Admin portal pages
├── components/
│   ├── shared/              # RoleGuard, badges, etc.
│   ├── operator/            # Operator-specific UI
│   └── admin/               # Admin layout and sidebar
└── data/
    └── mockData.js          # Mock claims, users, analytics

docs/                        # Product and engineering docs
```

## Claim Types

CargoGuard handles four freight claim categories:

| Type | Trigger | Key Evidence |
|------|---------|--------------|
| **Non-Delivery** | Receiver claims goods never arrived | GPS delivery confirmation, route log, timestamp |
| **Damaged in Transit** | Goods arrived damaged | Dashcam footage, shock/tilt sensor data, pre-load photos |
| **Not As Described** | Goods don't match order | Product scan log, authentication record, chain of custody |
| **Counterfeit / Fraud** | Product authenticity disputed | Cryptographic certificate, scan history, tamper detection |

## Documentation

- [Product Requirements (PRD)](docs/PRD.md) — product vision, agent flow, and functional requirements
- [Frontend Specification](docs/FRONTEND_SPEC.md) — UI structure, design tokens, and component layout
- [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md) — planned full-stack architecture and data flow
- [Security & Access](docs/SECURITY_AND_ACCESS.md) — authentication, data handling, and compliance model
- [Feature Tickets](docs/FEATURE_TICKETS.md) — implementation backlog and priorities

## Roadmap

**Implemented**

- Dual-portal UI shell (operator + admin)
- Role-based route guards
- Mock data dashboards and analytics views

**Planned**

- Backend API and session management
- LLM-based claim type classifier
- Zenduit and xentag evidence adapters (mock → live)
- Multi-step evidence review wizard
- Win likelihood estimator
- PDF / paste-ready package export

See [Feature Tickets](docs/FEATURE_TICKETS.md) for the full backlog.

## License

[MIT](LICENSE) — Copyright (c) 2026 Dhruv Thakar
