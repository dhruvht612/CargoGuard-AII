# CargoGuard AI — Backend

FastAPI backend that powers the CargoGuard AI operator and admin portals.

## Stack

| Layer | Technology |
|---|---|
| Runtime | Python 3.11 |
| Framework | FastAPI |
| Session store | Redis 7 |
| LLM | Anthropic Claude (claude-sonnet-4-20250514) |
| PDF export | WeasyPrint |
| Auth | JWT (python-jose) + bcrypt |
| Env config | python-dotenv |

## Quick start

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # fill in keys
redis-server &                # or use Docker
uvicorn app.main:app --reload --port 8000
```

Frontend expects the API at `http://localhost:8000`.  
Set `VITE_API_BASE=http://localhost:8000` in the frontend `.env`.

## Layout

```
backend/
├── app/
│   ├── main.py               # FastAPI app, CORS, startup
│   ├── config.py             # Settings from .env
│   ├── dependencies.py       # get_current_user, get_db, rate limiter
│   │
│   ├── routers/
│   │   ├── auth.py           # POST /auth/login  POST /auth/logout
│   │   ├── claims.py         # CRUD + agent triggers
│   │   ├── evidence.py       # Zenduit + xentag pulls
│   │   ├── packages.py       # PDF generation + approval gate
│   │   ├── admin/
│   │   │   ├── users.py      # user management
│   │   │   ├── claims.py     # admin claims view
│   │   │   ├── analytics.py  # charts data
│   │   │   ├── integrations.py
│   │   │   └── settings.py
│   │
│   ├── agents/
│   │   ├── classifier.py     # Intake & Classification Agent
│   │   ├── evidence.py       # Evidence Collection Agent
│   │   ├── scorer.py         # Strength Scoring Agent
│   │   └── generator.py      # Package Generation Agent
│   │
│   ├── adapters/
│   │   ├── zenduit.py        # Zenduit REST adapter (mock-capable)
│   │   └── xentag.py         # xentag REST adapter (mock-capable)
│   │
│   ├── models/
│   │   ├── claim.py          # Pydantic schemas
│   │   ├── user.py
│   │   ├── evidence.py
│   │   └── package.py
│   │
│   └── services/
│       ├── session.py        # Redis session helpers
│       ├── pdf.py            # WeasyPrint PDF builder
│       └── audit.py          # Audit log writer
│
├── tests/
│   ├── test_auth.py
│   ├── test_claims.py
│   ├── test_agents.py
│   └── test_adapters.py
│
├── requirements.txt
├── .env.example
└── Dockerfile
```

## Running with Docker

```bash
docker build -t cargoguard-backend .
docker run -p 8000:8000 --env-file .env cargoguard-backend
```

## Environment variables

See `.env.example` for all required keys.  Critical ones:

```
ANTHROPIC_API_KEY=sk-ant-...
ZENDUIT_API_KEY=...
XENTAG_API_KEY=...
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-me-in-production
USE_MOCK_ADAPTERS=true   # flip to false when live keys are ready
```
