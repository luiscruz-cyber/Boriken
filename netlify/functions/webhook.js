const crypto = require('crypto');

exports.handler = async (event) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    const payload = event.body || '';

    if (secret) {
        if (!signature) {
            console.warn('Webhook missing stripe-signature header');
            return { statusCode: 400, body: 'Missing signature' };
        }
        if (!verifySignature(payload, signature, secret)) {
            console.warn('Webhook signature verification failed');
            return { statusCode: 400, body: 'Invalid signature' };
        }
    } else {
        console.warn('STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
    }

    let evt;
    try { evt = JSON.parse(payload); }
    catch (e) { return { statusCode: 400, body: 'Invalid JSON' }; }

    switch (evt.type) {
        case 'checkout.session.completed': {
            const session = evt.data.object;
            const serviceId = session.metadata && session.metadata.serviceId;
            console.log(`Payment received: ${serviceId} from ${session.customer_email || (session.customer_details && session.customer_details.email)} — amount ${session.amount_total}`);
            // TODO: send confirmation email, create project in tracking system
            break;
        }
        default:
            break;
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

function verifySignature(payload, header, secret) {
    const parts = Object.fromEntries(header.split(',').map(p => p.split('=')));
    const timestamp = parts.t;
    const sig = parts.v1;
    if (!timestamp || !sig) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

    try {
        return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
    } catch (e) {
        return false;
    }
}
