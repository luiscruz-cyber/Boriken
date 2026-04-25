# Boriken AI Consulting

Small-business cybersecurity consultancy — public site, payment portal, and Stripe checkout backend.

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

Service definitions live in `netlify/functions/_shared/services.js` as the single source of truth — update there and push to redeploy.

---

## Tech Stack

- **Frontend:** Static HTML / CSS / vanilla JS, hosted on Netlify
- **Backend:** Netlify Functions (serverless Node 20) — checkout, payment status, Stripe webhook
- **Payments:** Stripe Checkout (hosted) + signature-verified webhooks (live mode)
- **DNS:** OpenSRS (via Zoho registrar) — `borikenaiconsulting.com`
- **Email:** ImprovMX forwarder — `contact@borikenaiconsulting.com` → owner's Gmail
- **CI/CD:** GitHub Actions deploy on push to `main` via Netlify CLI

---

## Repository Structure

```
~/Boriken/
├── README.md
├── BUSINESS-PLAN.md
├── TODO.md
├── package.json
├── netlify.toml                       # /api/* → functions
├── .github/workflows/deploy.yml       # Auto-deploy on push to main
├── netlify/functions/
│   ├── config.js                      # GET /api/config
│   ├── checkout.js                    # POST /api/checkout
│   ├── payment-status.js              # GET /api/payment-status?session_id=...
│   ├── webhook.js                     # POST /api/webhook
│   └── _shared/
│       ├── services.js                # Service catalog (SSOT)
│       └── stripe.js                  # Pure-Node Stripe HTTP helper
├── server.js                          # Legacy local-dev Express server
├── deploy.js                          # Legacy manual deploy script (slated for removal — see scheduled cleanup 2026-05-07)
├── website/
│   ├── index.html                     # Homepage
│   ├── payment.html                   # 3-tier checkout page
│   ├── payment-success.html           # Post-payment confirmation
│   ├── privacy.html                   # Privacy Policy
│   ├── terms.html                     # Terms of Service
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
├── templates/
│   ├── CLIENT-PROPOSAL.md
│   └── ASSESSMENT-REPORT.md
├── checklists/
│   └── small-business-assessment.md
└── contracts/
    └── SERVICE-AGREEMENT.md
```

---

## Backend Architecture

Functions live in `netlify/functions/`. `netlify.toml` rewrites `/api/*` to `/.netlify/functions/*`.

| Method | Path | Function | Purpose |
|--------|------|----------|---------|
| `GET`  | `/api/config` | `config.js` | Returns service catalog + Stripe publishable key |
| `POST` | `/api/checkout` | `checkout.js` | Creates a Stripe Checkout Session, returns redirect URL |
| `GET`  | `/api/payment-status?session_id=...` | `payment-status.js` | Returns paid/unpaid + service + amount for the success page |
| `POST` | `/api/webhook` | `webhook.js` | Receives Stripe events; verifies signature with `STRIPE_WEBHOOK_SECRET` |

Functions use Node stdlib only (no `stripe` npm dep). Stripe API calls go through a small `https`-based helper in `_shared/stripe.js`.

### Payment flow
1. Customer hits `/payment.html`, picks a tier, enters email + company name
2. Frontend calls `POST /api/checkout` → backend creates Stripe session → returns hosted Stripe URL
3. Customer pays on Stripe's domain (PCI scope stays with Stripe)
4. Stripe redirects to `/payment-success.html?session_id=...`
5. Success page calls `GET /api/payment-status?session_id=...` to confirm and display details
6. Stripe also POSTs to `/api/webhook` — currently just logs; TODO: trigger confirmation email + project tracking

### Recurring vs one-time
- `monthly-retainer` → `mode: 'subscription'` with `recurring: { interval: 'month' }`
- All other tiers → `mode: 'payment'` (one-time)

---

## Deployment

### Continuous deployment (GitHub Actions)
Every push to `main` triggers `.github/workflows/deploy.yml`, which runs `netlify deploy --prod` to push `website/` and `netlify/functions/` to the Netlify site.

Repo secrets used by the workflow:
- `NETLIFY_AUTH_TOKEN` — Netlify personal access token
- `NETLIFY_SITE_ID` — `12834436-f4e9-4db0-8ac0-bb0207f1f160`

> **Why GHA instead of Netlify's native git integration:** Netlify's free tier blocks builds from "unrecognized contributors" on private repos. Connecting the GitHub identity didn't unblock it (Google-login Netlify accounts don't satisfy the check). API-based deploys via GHA bypass that gate entirely.

### Local development
```bash
npm start           # runs server.js (Express) on localhost:3000
npm run dev         # watch mode
```

The Express server in `server.js` is for local testing without deploying. Production traffic flows through Netlify Functions, not Express.

---

## Environment

### Local `.env` (gitignored)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DOMAIN=http://localhost:3000
PORT=3000
```

### Netlify env vars (production)
- `STRIPE_SECRET_KEY` — `sk_live_...`
- `STRIPE_PUBLISHABLE_KEY` — `pk_live_...`
- `STRIPE_WEBHOOK_SECRET` — live webhook signing secret `whsec_...`

Manage via the Netlify UI or `netlify env:set <KEY> <VALUE>`.

---

## Status

### Done
- Live site, custom domain, automatic SSL
- Stripe **live mode** end-to-end (checkout, success page, webhook with signature verification)
- Email forwarding for `contact@borikenaiconsulting.com` → owner Gmail
- Privacy Policy + Terms of Service pages (template — pending lawyer review)
- Featured client engagement (Ama Earth Group)
- Continuous deployment via GHA

### Open items
1. **Replace contact form's `mailto:`** with a real submission endpoint (Netlify Function → email)
2. **Mercury business bank account** — application in review; once approved, swap Stripe payouts from personal to business account
3. **Virtual mailbox** for public-facing business address (replace the home address currently in `privacy.html`/`terms.html`)
4. **Lawyer review** of `privacy.html` + `terms.html` for NJ jurisdiction
5. **Favicon, SEO meta tags, Open Graph tags** — site polish
6. **Confirmation email on `checkout.session.completed`** — webhook currently just logs
7. **Rate limiting** on `/api/checkout` — low priority pre-traffic

### Known issues
- **Netlify API token hardcoded in `deploy.js:6`** — scheduled for removal/rotation 2026-05-07 (the file is dead code now that GHA handles deploys)

---

## Useful Commands

```bash
# Deploy: any push to main triggers GHA
git push origin main

# Run local dev server (uses .env)
npm start

# Test Stripe locally with test card 4242 4242 4242 4242 (any future expiry, any CVC)

# Tail production function logs
netlify logs:functions --site boriken-ai-consulting

# View / set Netlify env vars
netlify env:list  --site boriken-ai-consulting
netlify env:set <KEY> <VALUE> --site boriken-ai-consulting
```

---

## Related Projects

- **Ama Earth Group** — current client engagement (SOC 2 compliance preparation + ongoing security review). Working repo: `~/pentest-ama-earth-group/`.
