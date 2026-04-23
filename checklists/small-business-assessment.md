# Small Business Security Assessment Checklist
## Boriken AI Consulting — Master Checklist

**Client:** _______________
**Date:** _______________
**Assessor:** _______________

---

## 1. External Reconnaissance
- [ ] WHOIS and domain registration details
- [ ] DNS record enumeration (A, MX, TXT, NS, CNAME, SOA)
- [ ] Subdomain discovery (crt.sh, subfinder, amass)
- [ ] Technology fingerprinting (Wappalyzer, headers, response analysis)
- [ ] Google dorking (site:, filetype:, inurl:, intitle:)
- [ ] Shodan/Censys lookup for exposed services
- [ ] Email format and employee enumeration (LinkedIn, theHarvester)
- [ ] Breach database check (Have I Been Pwned — domain search)
- [ ] GitHub/GitLab recon for leaked code or credentials

## 2. Web Application Security (OWASP Top 10)
- [ ] **Broken Access Control** — Test auth bypass, IDOR, privilege escalation
- [ ] **Cryptographic Failures** — Check for sensitive data in cleartext, weak encryption
- [ ] **Injection** — Test SQLi, XSS, command injection on all inputs
- [ ] **Insecure Design** — Review business logic flaws
- [ ] **Security Misconfiguration** — Default creds, unnecessary features, verbose errors
- [ ] **Vulnerable Components** — Check JS libraries, frameworks for known CVEs
- [ ] **Auth Failures** — Test login brute force, session management, password policy
- [ ] **Data Integrity Failures** — Check for unsigned updates, insecure deserialization
- [ ] **Logging Failures** — Verify security events are logged
- [ ] **SSRF** — Test any URL input fields for server-side request forgery

## 3. Security Headers & SSL/TLS
- [ ] Strict-Transport-Security (HSTS)
- [ ] Content-Security-Policy (CSP)
- [ ] X-Content-Type-Options (nosniff)
- [ ] X-Frame-Options (clickjacking protection)
- [ ] Referrer-Policy
- [ ] Permissions-Policy
- [ ] Cache-Control on sensitive pages
- [ ] SSL/TLS version (TLS 1.2+ only)
- [ ] Certificate validity and chain
- [ ] Cipher suite strength
- [ ] HSTS preload status

## 4. Email Security
- [ ] SPF record present and correctly configured
- [ ] DKIM record present
- [ ] DMARC record present with policy (p=reject preferred)
- [ ] DMARC reporting configured (rua/ruf)
- [ ] MX records point to expected mail provider
- [ ] Email provider security features (M365 ATP, Google Advanced Protection)
- [ ] Legacy protocols disabled (POP3, IMAP if not needed)

## 5. Network Perimeter
- [ ] Port scan — identify exposed services (nmap top 1000 + common extras)
- [ ] Service version detection on open ports
- [ ] VPN configuration (if applicable)
- [ ] Remote access methods (RDP, SSH, TeamViewer, AnyDesk)
- [ ] Firewall rules review (if access granted)
- [ ] Unnecessary services exposed to internet

## 6. Cloud & SaaS Configuration
### Microsoft 365
- [ ] MFA enabled for all users (especially admins)
- [ ] Legacy authentication protocols disabled
- [ ] Admin accounts are dedicated (not daily-use accounts)
- [ ] Conditional access policies configured
- [ ] Audit logging enabled
- [ ] External sharing settings appropriate
- [ ] Data Loss Prevention (DLP) policies

### Google Workspace
- [ ] 2-Step verification enforced
- [ ] Admin accounts use security keys
- [ ] Third-party app access restricted
- [ ] Drive sharing settings appropriate
- [ ] Mobile device management enabled
- [ ] Audit logs active

### General Cloud
- [ ] Cloud storage permissions (S3, Azure Blob, GCS)
- [ ] No publicly accessible storage buckets
- [ ] API keys not exposed in code or configs
- [ ] Secrets management in place

## 7. Identity & Access Management
- [ ] Password policy meets minimums (12+ chars, complexity)
- [ ] MFA deployed across all critical systems
- [ ] Service accounts audited
- [ ] Former employee accounts disabled
- [ ] Shared accounts eliminated or documented
- [ ] Least privilege principle followed
- [ ] Admin access limited and monitored

## 8. Endpoint Security
- [ ] Antivirus/EDR deployed on all endpoints
- [ ] Operating systems patched and current
- [ ] Automatic updates enabled
- [ ] Full disk encryption enabled
- [ ] USB/removable media policy
- [ ] Screen lock policy enforced
- [ ] Mobile device management (if BYOD)

## 9. Data Protection
- [ ] Sensitive data inventory exists
- [ ] Data classified by sensitivity
- [ ] Encryption at rest for sensitive data
- [ ] Encryption in transit (TLS everywhere)
- [ ] Backup strategy in place
- [ ] Backups tested for restore
- [ ] Data retention policy defined

## 10. Incident Response & Business Continuity
- [ ] Incident response plan exists
- [ ] IR plan has been tested/tabletop exercised
- [ ] Roles and responsibilities defined
- [ ] Contact list current (internal + external)
- [ ] Cyber insurance in place
- [ ] Business continuity plan exists
- [ ] Disaster recovery tested

## 11. Employee Security Awareness
- [ ] Security awareness training conducted (annual minimum)
- [ ] Phishing awareness (test or training)
- [ ] Acceptable use policy exists
- [ ] Clean desk / clean screen policy
- [ ] Social engineering awareness
- [ ] Reporting procedure for suspicious activity known

## 12. Regulatory Compliance (Select Applicable)

### HIPAA (Healthcare)
- [ ] Risk assessment completed (annual)
- [ ] BAAs in place with all vendors handling PHI
- [ ] PHI access logged and monitored
- [ ] Encryption of PHI at rest and in transit
- [ ] Workforce training documented
- [ ] Breach notification procedure in place

### PCI-DSS (Payment Cards)
- [ ] Cardholder data environment (CDE) identified
- [ ] Network segmentation of CDE
- [ ] No stored card data (or properly encrypted)
- [ ] PCI-compliant payment processor
- [ ] Quarterly vulnerability scans (ASV)
- [ ] Annual SAQ completed

### NYDFS 23 NYCRR 500 (Financial — NY)
- [ ] Cybersecurity program in place
- [ ] CISO designated (can be outsourced)
- [ ] Written cybersecurity policy
- [ ] Penetration testing annual
- [ ] Vulnerability assessment bi-annual
- [ ] Multi-factor authentication
- [ ] Encryption of nonpublic information
- [ ] Third-party service provider security policy

---

## Scoring Summary

| Category | Score (1-5) | Notes |
|----------|-------------|-------|
| External Attack Surface | | |
| Web Application Security | | |
| Security Headers & SSL | | |
| Email Security | | |
| Network Perimeter | | |
| Cloud Configuration | | |
| Identity & Access | | |
| Endpoint Security | | |
| Data Protection | | |
| Incident Response | | |
| Security Awareness | | |
| Compliance | | |
| **Overall** | | |

**Scoring Guide:** 1 = Critical gaps, 2 = Major gaps, 3 = Adequate, 4 = Good, 5 = Excellent
