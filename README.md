# Boriken AI Consulting

Small-business cybersecurity assessment consultancy — website, payment portal, and Stripe-powered booking backend.

**Live site:** https://borikenaiconsulting.com
**GitHub:** https://github.com/luiscruz-cyber/Boriken (private)

---

## Business Structure

| | |
|---|---|
| **Public brand** | Boriken AI Consulting |
| **Legal entity** | Boriken AI Consulting LLC (NJ) |
| **Relationship** | Brand matches legal entity — no DBA / alternate name filing needed |
| **Billing / Stripe / banking** | Boriken AI Consulting LLC |
| **Customer-facing branding** | Boriken AI Consulting (website, contracts, marketing) |
| **Target market** | Small businesses, NY/NJ tri-state area |

### Naming History
1. **Cruz Cybersecurity** — original working name
2. **Irongate AI Solutions** — placeholder rename (2026-03-29), abandoned (name already in use)
3. **Sentrix** — public brand (2026-04-18), abandoned (name already in use)
4. **Boriken AI Consulting** — current public brand (2026-04-23), matches legal entity

---

## Services & Pricing

| Tier | Service | Launch Price | Normal Price | Timeline |
|------|---------|--------------|--------------|----------|
| 1 | External Security Checkup | $79 | $399 | 1–2 business days |
| 2 | Small Business Security Assessment | $999 | $2,500 | 3–5 business days |
| 3 | Security & Compliance Review | $2,499 | $5,000 | 1–2 weeks |
| – | Monthly Security Retainer | $750/mo | $750/mo | Ongoing |

Service definitions live in `server.js` (`SERVICES` object) as the single source of truth. Update pricing there and redeploy.

---

## Tech Stack

- **Frontend:** Static HTML / CSS / vanilla JS (no framework)
- **Backend:** Node.js + Express (`server.js`)
- **Payments:** Stripe Checkout (hosted checkout, not custom-built card form)
- **Hosting (frontend):** Netlify
- **Hosting (backend):** Not yet deployed — planned: Render.com
- **Deploy automation:** Custom Node script (`deploy.js`) using Netlify API directly

---

## Repository Structure

```
~/Boriken/
├── README.md                   # This file
├── BUSINESS-PLAN.md            # Service tiers, markets, revenue projections
├── TODO.md                     # Master task tracker
├── server.js                   # Express + Stripe Checkout backend
├── deploy.js                   # Deploys website/ to Netlify via API
├── package.json                # npm scripts: start / dev
├── .env                        # Stripe API keys (gitignored, placeholder values)
├── .gitignore
├── website/                    # Static site deployed to Netlify
│   ├── index.html              # Homepage (hero, services, process, about, contact)
│   ├── payment.html            # Payment portal (3 tiers + Stripe checkout)
│   ├── payment-success.html    # Post-payment confirmation page
│   ├── css/style.css
│   ├── js/main.js              # Mobile nav, form handler, scroll
│   └── images/
├── templates/
│   ├── CLIENT-PROPOSAL.md      # Send to prospects
│   └── ASSESSMENT-REPORT.md    # Deliver to clients after assessment
├── checklists/
│   └── small-business-assessment.md    # 100+ item assessment checklist
└── contracts/
    └── SERVICE-AGREEMENT.md    # Master service agreement
```

---

## Backend Architecture (`server.js`)

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET`  | `/api/config` | Returns services catalog + Stripe publishable key for frontend |
| `POST` | `/api/checkout` | Creates a Stripe Checkout Session, returns redirect URL |
| `GET`  | `/api/payment-status/:sessionId` | Verifies payment status (used by success page) |
| `POST` | `/api/webhook` | Stripe webhook receiver (currently only logs `checkout.session.completed`) |
| `GET`  | `/payment`, `/success` | Serves static HTML pages |

### Payment flow
1. Customer visits `/payment.html`, picks a tier, enters email + company name.
2. Frontend calls `POST /api/checkout` → backend creates Stripe session → returns Stripe-hosted checkout URL.
3. Customer pays on Stripe's domain (PCI scope stays with Stripe, not us).
4. Stripe redirects to `/payment-success.html?session_id=...`
5. Success page calls `GET /api/payment-status/:sessionId` to confirm and display details.
6. Stripe also POSTs to `/api/webhook` — currently just logs; TODO: trigger confirmation email + project tracking.

### Recurring vs one-time
- `monthly-retainer` uses `mode: 'subscription'` with `recurring: { interval: 'month' }`
- All other tiers use `mode: 'payment'` (one-time)

---

## Deployment

### Frontend (Netlify) — currently automated
```bash
cd ~/Boriken
node deploy.js
```
- Reads everything in `website/`, SHA-1 hashes each file, POSTs manifest to Netlify API, uploads only changed files.
- Netlify site ID: `12834436-f4e9-4db0-8ac0-bb0207f1f160`
- Netlify API token is currently **hardcoded in `deploy.js`** — should be moved to `.env` (`NETLIFY_TOKEN`). See "Known Issues" below.

### Backend (not yet deployed)
Local dev only:
```bash
npm start           # production mode
npm run dev         # watch mode (auto-restart on changes)
# then visit http://localhost:3000/payment.html
```

Production plan:
1. Deploy `server.js` to Render.com (free tier) or Railway.
2. Set env vars on the host: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `DOMAIN` (production URL).
3. Update frontend `fetch` calls in `website/js/main.js` or `payment.html` to point at the Render URL for `/api/*`.
4. Configure Stripe webhook endpoint: `https://<render-url>/api/webhook`.

---

## Environment Variables (`.env`)

```
STRIPE_SECRET_KEY=sk_test_...       # or sk_live_ when going to production
STRIPE_PUBLISHABLE_KEY=pk_test_...
DOMAIN=http://localhost:3000        # set to production URL when deployed
PORT=3000                           # optional, defaults to 3000
```

`.env` is gitignored. Do NOT commit real keys.

---

## Current Status

### ✅ Done
- Business plan written
- Website designed + built (homepage, payment, success pages)
- Payment portal with 3 tiers + Stripe Checkout integration
- Backend API (Express + Stripe) working locally
- Website deployed to Netlify
- Rebranded Irongate → Sentrix across website files (2026-04-18)
- Rebranded Sentrix → Boriken AI Consulting across entire repo (2026-04-23)
- Pushed to private GitHub repo

### 🟡 In Progress / Pending
1. **Stripe account** — Create under Boriken AI Consulting LLC. Set statement descriptor to "BORIKEN" so it shows on customer card statements. Paste API keys into `.env`.
2. **Backend deployment** — Deploy `server.js` to Render.com so payments work in production, not just local.
3. **Frontend → Backend wiring** — Update frontend API URLs to point at production backend.
4. **Point borikenaiconsulting.com at Netlify** — add custom domain in Netlify, update DNS at Zoho.
5. **Rename GitHub repo** — `Sentrix` → `Boriken` on GitHub, then update local remote URL.

---

## Known Issues / Security Notes

- **Netlify API token is hardcoded in `deploy.js`** (line 6). Since this repo is private, the blast radius is limited, but the token should be moved to `.env` as `NETLIFY_TOKEN` and loaded via `process.env`. If the repo is ever made public, this token must be rotated first.
- **Backend runs Stripe in test mode only** — switch to live keys only after backend is deployed and webhook is configured.
- **No rate limiting on `/api/checkout`** — low priority until traffic exists, but worth adding before going live.
- **No email notifications yet** — the webhook handler logs payments but doesn't email the customer or notify the business. TODO in `server.js:127`.

---

## Useful Commands

```bash
# Deploy website
cd ~/Boriken && node deploy.js

# Run backend locally
npm start

# Watch mode
npm run dev

# Test Stripe locally
# Use test card: 4242 4242 4242 4242, any future expiry, any CVC

# Push to GitHub
git push origin main
```

---

## Related Projects

- **Ama Earth Group pentest engagement** (authorized) — `~/pentest-ama-earth-group/` — building portfolio case studies while the consultancy launches.
