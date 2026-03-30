require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN || `http://localhost:${PORT}`;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'website')));

// Service definitions — single source of truth for pricing
const SERVICES = {
    'security-checkup': {
        name: 'External Security Checkup',
        description: 'Website security audit, SSL/TLS review, email security check, exposed services scan, and prioritized findings report.',
        price: 7900, // cents ($79 launch price)
        fullPrice: 39900,
        timeline: '1-2 business days'
    },
    'business-assessment': {
        name: 'Small Business Security Assessment',
        description: 'Full external + cloud workspace audit, password & MFA review, employee security evaluation, executive report with remediation roadmap.',
        price: 99900, // cents ($999 launch price)
        fullPrice: 250000,
        timeline: '3-5 business days'
    },
    'compliance-review': {
        name: 'Security & Compliance Review',
        description: 'Comprehensive assessment + HIPAA/PCI/NYDFS compliance gap analysis, vulnerability scanning, incident response review, 30/60/90 day roadmap.',
        price: 249900, // cents ($2,499 launch price)
        fullPrice: 500000,
        timeline: '1-2 weeks'
    },
    'monthly-retainer': {
        name: 'Monthly Security Retainer',
        description: 'Monthly vulnerability scanning, quarterly phishing simulations, incident response on-call, and annual reassessment.',
        price: 75000, // cents ($750/mo)
        fullPrice: 75000,
        recurring: true,
        timeline: 'Ongoing'
    }
};

// API: Get services and publishable key (for frontend)
app.get('/api/config', (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        services: Object.entries(SERVICES).map(([id, svc]) => ({
            id,
            name: svc.name,
            description: svc.description,
            price: svc.price,
            fullPrice: svc.fullPrice,
            recurring: svc.recurring || false,
            timeline: svc.timeline
        }))
    });
});

// API: Create Stripe Checkout Session
app.post('/api/checkout', async (req, res) => {
    try {
        const { serviceId, customerEmail, companyName } = req.body;
        const service = SERVICES[serviceId];

        if (!service) {
            return res.status(400).json({ error: 'Invalid service selected' });
        }

        const sessionConfig = {
            payment_method_types: ['card'],
            customer_email: customerEmail || undefined,
            metadata: {
                serviceId,
                companyName: companyName || ''
            },
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: service.name,
                        description: service.description
                    },
                    unit_amount: service.price,
                    ...(service.recurring ? { recurring: { interval: 'month' } } : {})
                },
                quantity: 1
            }],
            mode: service.recurring ? 'subscription' : 'payment',
            success_url: `${DOMAIN}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}/payment.html`
        };

        const session = await stripe.checkout.sessions.create(sessionConfig);
        res.json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err.message);
        res.status(500).json({ error: 'Payment session creation failed. Please try again.' });
    }
});

// API: Verify payment (for success page)
app.get('/api/payment-status/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.json({
            status: session.payment_status,
            customerEmail: session.customer_email || session.customer_details?.email,
            service: SERVICES[session.metadata?.serviceId]?.name || 'Security Assessment',
            amount: session.amount_total
        });
    } catch (err) {
        res.status(400).json({ error: 'Could not retrieve payment info' });
    }
});

// Stripe webhook for payment confirmation
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const event = req.body;

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(`Payment received: ${session.metadata?.serviceId} from ${session.customer_email}`);
            // TODO: Send confirmation email, create project in your tracking system
            break;
        default:
            break;
    }

    res.json({ received: true });
});

// Serve payment pages
app.get('/payment', (req, res) => res.sendFile(path.join(__dirname, 'website', 'payment.html')));
app.get('/success', (req, res) => res.sendFile(path.join(__dirname, 'website', 'payment-success.html')));

app.listen(PORT, () => {
    console.log(`Irongate AI Solutions server running at ${DOMAIN}`);
    console.log(`Payment portal: ${DOMAIN}/payment.html`);
});
