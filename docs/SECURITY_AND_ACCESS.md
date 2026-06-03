# CargoGuard AI — Security & Access Document

## 1. Overview

CargoGuard AI handles sensitive freight claim data, telematics records, and product authentication certificates. This document defines the security model, access controls, data handling policies, and compliance considerations for v1.

---

## 2. Core Security Principles

1. **Zero persistence by default** — claim data is never written to disk unless the user explicitly opts into saved history
2. **Minimum data collection** — only data necessary to process the claim is requested
3. **Human-in-the-loop** — no action is taken without explicit user approval
4. **No legal conclusions** — all output labeled "not legal advice"
5. **Credential isolation** — API keys never exposed to frontend

---

## 3. Authentication & Authorization

### 3.1 User Authentication
- JWT-based authentication with short-lived access tokens (15 min expiry)
- Refresh tokens stored in HttpOnly cookies (not accessible to JavaScript)
- Passwords hashed with bcrypt (cost factor 12)
- Multi-factor authentication (MFA) available via TOTP for enterprise accounts

### 3.2 Session Management
- Each claim session assigned a unique session ID (UUID v4)
- Session data stored in server-side Redis with TTL of 2 hours
- Session destroyed immediately on user logout or package download
- No session data shared between users

### 3.3 Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| **Operator** | Submit claims, view own evidence, approve packages, download |
| **Manager** | All Operator permissions + view team claims, analytics dashboard |
| **Admin** | All permissions + user management, API key management |
| **Insurer (Partner)** | Read-only access to shared verified data feeds (explicit consent required) |

---

## 4. Data Security

### 4.1 Data in Transit
- All API traffic over HTTPS/TLS 1.3
- HSTS enabled with 1-year max-age
- Certificate pinning for Zenduit and xentag API calls

### 4.2 Data at Rest
- No claim data written to database by default
- If user opts into history: AES-256 encryption at rest
- Encryption keys managed via AWS KMS or equivalent
- Database encrypted at volume level

### 4.3 File Handling
- Uploaded files (claim notices, photos, PDFs) stored in memory only during session
- Files scanned for malware on upload (ClamAV or cloud equivalent)
- File size limit: 20MB per file, 100MB per session
- Accepted types: PDF, JPG, PNG, HEIC
- Files purged from memory immediately after package generation

### 4.4 Evidence Data
- Zenduit GPS and dashcam data fetched on-demand, not cached
- xentag authentication records fetched on-demand, not cached
- All third-party data held in session memory only
- No telematics data stored on CargoGuard servers

---

## 5. API Security

### 5.1 External API Keys
- Zenduit API key stored as environment variable, never in code
- xentag API key stored as environment variable, never in code
- LLM API key (Anthropic) stored as environment variable
- All keys rotated every 90 days
- Keys scoped to minimum required permissions

### 5.2 Rate Limiting
- 100 requests/hour per user for claim intake
- 10 package generations/hour per user
- Global rate limit: 1000 requests/minute across all users
- Rate limits enforced at API gateway level

### 5.3 Input Validation
- All claim text sanitized before LLM submission (strip scripts, SQL)
- File uploads validated by magic bytes, not just extension
- Order IDs and tag IDs validated against expected format before API calls
- LLM prompt injection protection: claim data passed as data, not as instructions

---

## 6. Privacy & Compliance

### 6.1 Data Minimization
- Only order ID, claim type, and date range shared with Zenduit
- Only tag ID shared with xentag
- Driver names and personal details masked in LLM prompts where possible

### 6.2 PIPEDA Compliance (Canada)
- Privacy policy clearly states what data is collected and why
- Users can request deletion of any stored data
- Data not shared with third parties without explicit consent
- Breach notification within 72 hours if applicable

### 6.3 GDPR Considerations (if EU customers)
- Lawful basis: contract performance
- Data processor agreements with Zenduit and xentag
- Right to erasure honored within 30 days

### 6.4 No Training on User Data
- Claim data is never sent to LLM provider for training
- Anthropic API used with `"training": false` flag where available

---

## 7. Infrastructure Security

- Backend hosted on Railway/Render with private networking
- Frontend on Vercel with WAF enabled
- No public-facing database ports
- SSH access restricted to admin team with key-based auth only
- Dependency scanning via Dependabot
- Secret scanning enabled on GitHub repo
- SAST (Static Application Security Testing) via CodeQL on every PR

---

## 8. Incident Response

| Severity | Example | Response Time | Owner |
|---|---|---|---|
| Critical | Data breach, API key leak | 1 hour | CTO + Security lead |
| High | Service outage, auth bypass | 4 hours | Engineering lead |
| Medium | Rate limit bypass, minor data exposure | 24 hours | Backend lead |
| Low | UI bug, cosmetic issue | 72 hours | Any engineer |

Steps:
1. Detect → Alert via PagerDuty/Slack
2. Contain → Revoke affected keys, disable affected routes
3. Investigate → Review logs, identify scope
4. Remediate → Patch + deploy
5. Disclose → Notify affected users if required
6. Post-mortem → Document and improve

---

## 9. Security Checklist (Pre-Launch)

- [ ] All API keys in environment variables, not in code
- [ ] HTTPS enforced everywhere
- [ ] Input sanitization on all user inputs
- [ ] File upload validation by magic bytes
- [ ] Session TTL configured and tested
- [ ] Rate limiting tested under load
- [ ] RBAC tested for privilege escalation
- [ ] Dependency audit run (npm audit / pip-audit)
- [ ] SAST scan clean
- [ ] Privacy policy reviewed by legal
