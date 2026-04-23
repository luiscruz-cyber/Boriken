const SERVICES = require('./_shared/services');
const { stripeCall } = require('./_shared/stripe');

exports.handler = async (event) => {
    const sessionId = (event.queryStringParameters || {}).session_id;
    if (!sessionId) {
        return jsonError(400, 'Missing session_id');
    }

    try {
        const session = await stripeCall('GET', `/checkout/sessions/${encodeURIComponent(sessionId)}`);
        const serviceId = session.metadata && session.metadata.serviceId;
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: session.payment_status,
                customerEmail: session.customer_email || (session.customer_details && session.customer_details.email),
                service: (SERVICES[serviceId] && SERVICES[serviceId].name) || 'Security Assessment',
                amount: session.amount_total
            })
        };
    } catch (err) {
        console.error('Stripe retrieve error:', err.message);
        return jsonError(400, 'Could not retrieve payment info');
    }
};

function jsonError(statusCode, message) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: message })
    };
}
