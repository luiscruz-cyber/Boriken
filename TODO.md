# Irongate AI Solutions — TODO
**Last updated:** 2026-03-29

---

## Next Up

### 1. Set Up Stripe Account
- [ ] Go to https://dashboard.stripe.com/register
- [ ] Create account with business email
- [ ] Complete business verification (name, address, bank account for payouts)
- [ ] Go to Developers > API Keys
- [ ] Copy test keys (sk_test_... and pk_test_...)
- [ ] Paste into `~/cruz-cybersecurity/.env`:
  ```
  STRIPE_SECRET_KEY=sk_test_YOUR_KEY
  STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
  ```
- [ ] Test payment locally: `npm start` then visit http://localhost:3000/payment.html
- [ ] Use test card: 4242 4242 4242 4242, any future expiry, any CVC
- [ ] Once working, swap to live keys (sk_live_... and pk_live_...)

### 2. Deploy Backend for Live Payments
- [ ] Deploy Node.js server to Render.com (free tier) or Railway
- [ ] Update `.env` DOMAIN to production URL
- [ ] Update Netlify site to point API calls to the backend URL
- [ ] Test full payment flow end-to-end

### 3. Redeploy Website
- [ ] Redeploy with new name & pricing (`node deploy.js`)
- [ ] Verify live site shows "Irongate AI Solutions"

### 4. Update Remaining Pricing (if desired)
- Tier 1 (External Security Checkup): **$79 launch / $399 normal** (DONE)
- Tier 2 (Small Business Assessment): currently $999 launch / $2,500 normal
- Tier 3 (Compliance Review): currently $2,499 launch / $5,000 normal
- Monthly Retainer: currently $750/mo

---

## Completed
- [x] Business plan created
- [x] Website built (HTML/CSS/JS)
- [x] Payment portal with Stripe integration built
- [x] Client proposal template created
- [x] Assessment report template created
- [x] Service agreement / contract created
- [x] 12-category assessment checklist created
- [x] Website deployed to Netlify: https://cruz-cybersecurity.netlify.app
- [x] Node.js + Express backend with Stripe Checkout
- [x] Pentest project started (Ama Earth Group — for portfolio)
- [x] Renamed to "Irongate AI Solutions" across all files (2026-03-29)
- [x] Updated Tier 1 pricing to $79 launch / $399 normal (2026-03-29)

---

## Project Files Map

```
~/cruz-cybersecurity/
├── server.js                  # Backend — Stripe payments + static file server
├── deploy.js                  # Deploys website/ folder to Netlify
├── package.json               # npm start / npm run dev
├── .env                       # Stripe API keys (EDIT THIS)
├── .env.example               # Reference for required env vars
├── .gitignore
├── TODO.md                    # THIS FILE — your task tracker
├── BUSINESS-PLAN.md           # Service tiers, markets, revenue projections
├── website/
│   ├── index.html             # Homepage
│   ├── payment.html           # Payment portal (3 tiers + Stripe checkout)
│   ├── payment-success.html   # Post-payment confirmation
│   ├── css/style.css          # Stylesheet
│   └── js/main.js             # Mobile nav, form handler, scroll
├── templates/
│   ├── CLIENT-PROPOSAL.md     # Send to prospects
│   └── ASSESSMENT-REPORT.md   # Deliver to clients after assessment
├── checklists/
│   └── small-business-assessment.md  # 100+ item assessment checklist
└── contracts/
    └── SERVICE-AGREEMENT.md   # Legal agreement with auth to test
```

## Live URLs
- **Website:** https://cruz-cybersecurity.netlify.app
- **Payment:** https://cruz-cybersecurity.netlify.app/payment.html

## How to Run Locally
```bash
cd ~/cruz-cybersecurity
npm start
# Open http://localhost:3000
```

## How to Redeploy Website
```bash
cd ~/cruz-cybersecurity
node deploy.js
```
