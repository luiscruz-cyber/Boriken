const SERVICES = require('./_shared/services');
const { stripeCall } = require('./_shared/stripe');

const DOMAIN = process.env.DOMAIN || 'https://borikenaiconsulting.com';

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let body;
    try { body = JSON.parse(event.body || '{}'); }
    catch (e) { return jsonError(400, 'Invalid JSON'); }

    const { serviceId, customerEmail, companyName } = body;
    const service = SERVICES[serviceId];
    if (!service) return jsonError(400, 'Invalid service selected');

    const params = {
        'payment_method_types[0]': 'card',
        mode: service.recurring ? 'subscription' : 'payment',
        success_url: `${DOMAIN}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${DOMAIN}/payment.html`,
        'line_items[0][quantity]': 1,
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': service.name,
        'line_items[0][price_data][product_data][description]': service.description,
        'line_items[0][price_data][unit_amount]': service.price,
        'metadata[serviceId]': serviceId,
        'metadata[companyName]': companyName || ''
    };
    if (customerEmail) params.customer_email = customerEmail;
    if (service.recurring) {
        params['line_items[0][price_data][recurring][interval]'] = 'month';
    }

    try {
        const session = await stripeCall('POST', '/checkout/sessions', params);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: session.url })
        };
    } catch (err) {
        console.error('Stripe checkout error:', err.message);
        return jsonError(500, 'Payment session creation failed. Please try again.');
    }
};

function jsonError(statusCode, message) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: message })
    };
}
