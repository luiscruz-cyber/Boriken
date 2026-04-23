const SERVICES = {
    'security-checkup': {
        name: 'External Security Checkup',
        description: 'Website security audit, SSL/TLS review, email security check, exposed services scan, and prioritized findings report.',
        price: 7900,
        fullPrice: 39900,
        timeline: '1-2 business days'
    },
    'business-assessment': {
        name: 'Small Business Security Assessment',
        description: 'Full external + cloud workspace audit, password & MFA review, employee security evaluation, executive report with remediation roadmap.',
        price: 99900,
        fullPrice: 250000,
        timeline: '3-5 business days'
    },
    'compliance-review': {
        name: 'Security & Compliance Review',
        description: 'Comprehensive assessment + HIPAA/PCI/NYDFS compliance gap analysis, vulnerability scanning, incident response review, 30/60/90 day roadmap.',
        price: 249900,
        fullPrice: 500000,
        timeline: '1-2 weeks'
    },
    'monthly-retainer': {
        name: 'Monthly Security Retainer',
        description: 'Monthly vulnerability scanning, quarterly phishing simulations, incident response on-call, and annual reassessment.',
        price: 75000,
        fullPrice: 75000,
        recurring: true,
        timeline: 'Ongoing'
    }
};

module.exports = SERVICES;
