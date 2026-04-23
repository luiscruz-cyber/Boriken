const SERVICES = require('./_shared/services');

exports.handler = async () => {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
    };
};
